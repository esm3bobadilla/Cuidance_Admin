/*
 * Phase A3: the invitations Edge Function (plan Phase 2.5, decision D2).
 *
 * The ONLY code that uses the service-role key. Supabase provides it to the function
 * as SUPABASE_SERVICE_ROLE_KEY at runtime; it is never in the repository, the browser
 * bundle or any response, and it is never logged.
 *
 * POST with the signed-in user's access token (Authorization: Bearer …) and JSON:
 *   { action: 'create',  workspaceId, email, role }   Owner / Admin (D5)
 *   { action: 'resend',  invitationId }                Owner / Admin; fresh link, same 7 days (D7)
 *   { action: 'revoke',  invitationId }                Owner / Admin
 *   { action: 'get',     invitationId }                The invited person (email must match)
 *   { action: 'accept',  invitationId }                The invited person; single use
 *   { action: 'decline', invitationId }                The invited person
 *
 * Settings: ADMIN_SITE_URL (public, e.g. https://example.github.io/Cuidance_Admin) is where
 * email links point. SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are
 * provided by Supabase.
 */

import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2.118.0';
import {
  acceptUrl,
  errorStatus,
  invitationState,
  isUuid,
  isValidEmail,
  mayInvite,
  mayManage,
  normalizeEmail,
  resendCooldownSeconds,
  resendWaitSeconds,
  type ErrorCode,
  type InvitationStatus,
  type WorkspaceRole,
} from '../_shared/invitation-rules.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const siteUrl = Deno.env.get('ADMIN_SITE_URL') ?? '';

// The browser calls this with a bearer token (not cookies), so any origin may ask;
// every action still needs a valid signed-in user.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

class Refusal extends Error {
  constructor(public code: ErrorCode, public extra: Record<string, unknown> = {}) {
    super(code);
  }
}
const refuse = (code: ErrorCode, extra?: Record<string, unknown>): never => {
  throw new Refusal(code, extra);
};

type InvitationRow = {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceRole;
  status: InvitationStatus;
  expires_at: string;
  updated_at: string;
  created_at: string;
  invited_by: string | null;
};

const admin = () => createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

// The caller, from their access token. Anything else (no token, expired token) is refused.
async function caller(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) refuse('not-signed-in');
  const { data, error } = await admin().auth.getUser(token);
  if (error || !data.user) refuse('not-signed-in');
  return { id: data.user!.id, email: normalizeEmail(data.user!.email) };
}

async function roleIn(db: SupabaseClient, workspaceId: string, userId: string): Promise<WorkspaceRole | null> {
  const { data, error } = await db
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  if (error) refuse('server');
  return (data?.role as WorkspaceRole | undefined) ?? null;
}

async function loadInvitation(db: SupabaseClient, invitationId: unknown): Promise<InvitationRow> {
  if (!isUuid(invitationId)) refuse('not-found');
  const { data, error } = await db
    .from('invitations')
    .select('id, workspace_id, email, role, status, expires_at, updated_at, created_at, invited_by')
    .eq('id', invitationId)
    .maybeSingle();
  if (error) refuse('server');
  if (!data) refuse('not-found');
  return data as InvitationRow;
}

// The person an invitation is for. Someone else gets "not found", never "not yours".
async function forInvitee(db: SupabaseClient, invitationId: unknown, user: { email: string }) {
  const invitation = await loadInvitation(db, invitationId);
  if (normalizeEmail(invitation.email) !== user.email) refuse('not-found');
  return invitation;
}

// An Owner or Admin allowed to manage this invitation (D5)
async function forManager(db: SupabaseClient, invitationId: unknown, user: { id: string }) {
  const invitation = await loadInvitation(db, invitationId);
  const role = await roleIn(db, invitation.workspace_id, user.id);
  if (!mayManage(role, invitation.role)) refuse(role ? 'not-allowed' : 'not-found');
  return invitation;
}

// An existing Auth account for this email, if any (prototype scale: a few pages of users)
async function findUserByEmail(db: SupabaseClient, email: string) {
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) refuse('server');
    const found = data.users.find((user) => normalizeEmail(user.email) === email);
    if (found) return found;
    if (data.users.length < 1000) return null;
  }
  return null;
}

/*
 * Sends the invitation email through Supabase Auth (D6: the project's email settings;
 * locally, the local mail catcher). The link carries a single-use token that expires
 * with the Auth email-link expiry; the invitation itself still lasts 7 days, so
 * "Resend invitation link" sends a fresh one.
 * - No account yet, or invited but not set up: an invitation email (type "invite").
 * - An account that's already set up: a sign-in link email (type "magiclink").
 */
async function sendInvitationEmail(db: SupabaseClient, invitation: InvitationRow) {
  if (!siteUrl) refuse('server');
  const redirectTo = acceptUrl(siteUrl, invitation.id);
  const existing = await findUserByEmail(db, normalizeEmail(invitation.email));

  if (!existing || !existing.email_confirmed_at) {
    const { error } = await db.auth.admin.inviteUserByEmail(invitation.email, { redirectTo });
    if (error) refuse('send-failed');
    return;
  }
  const publicClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await publicClient.auth.signInWithOtp({
    email: invitation.email,
    options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
  });
  if (error) refuse('send-failed');
}

const summary = (invitation: InvitationRow) => ({
  id: invitation.id,
  email: invitation.email,
  role: invitation.role,
  state: invitationState(invitation.status, invitation.expires_at),
  expiresAt: invitation.expires_at,
});

async function create(db: SupabaseClient, user: { id: string }, body: Record<string, unknown>) {
  const workspaceId = body.workspaceId;
  const email = normalizeEmail(body.email);
  const role = String(body.role ?? '');
  if (!isUuid(workspaceId)) refuse('bad-request');
  const callerRole = await roleIn(db, workspaceId as string, user.id);
  if (!callerRole) refuse('not-allowed');
  if (!isValidEmail(email)) refuse('invalid-email');
  if (!mayInvite(callerRole, role)) refuse(role === 'admin' || role === 'reviewer' ? 'not-allowed' : 'invalid-role');

  // Already in the workspace (active or deactivated): no invitation
  const existing = await findUserByEmail(db, email);
  if (existing) {
    const { data } = await db.from('workspace_members').select('user_id').eq('workspace_id', workspaceId).eq('user_id', existing.id).maybeSingle();
    if (data) refuse('already-member');
  }

  // A pending invitation past its 7 days no longer counts: it's closed so a new one can start
  await db
    .from('invitations')
    .update({ status: 'revoked', responded_at: new Date().toISOString() })
    .eq('workspace_id', workspaceId)
    .eq('email', email)
    .eq('status', 'pending')
    .lte('expires_at', new Date().toISOString());

  const { data, error } = await db
    .from('invitations')
    .insert({ workspace_id: workspaceId, email, role, invited_by: user.id })
    .select('id, workspace_id, email, role, status, expires_at, updated_at, created_at, invited_by')
    .single();
  if (error) refuse(error.code === '23505' ? 'already-pending' : 'server');
  const invitation = data as InvitationRow;

  try {
    await sendInvitationEmail(db, invitation);
  } catch (problem) {
    // Nothing was sent, so the invitation isn't kept
    await db.from('invitations').delete().eq('id', invitation.id);
    throw problem;
  }
  return { invitation: summary(invitation) };
}

async function resend(db: SupabaseClient, user: { id: string }, body: Record<string, unknown>) {
  const invitation = await forManager(db, body.invitationId, user);
  const state = invitationState(invitation.status, invitation.expires_at);
  if (state === 'expired') refuse('expired');
  if (state !== 'pending') refuse('not-pending', { state });
  const wait = resendWaitSeconds(invitation.updated_at);
  if (wait > 0) refuse('too-soon', { retryAfter: wait });

  // Claim the send: only one resend per cooldown, even if two arrive together.
  // The 7-day expiry is unchanged (D7); updated_at records when the link was sent.
  const cutoff = new Date(Date.now() - resendCooldownSeconds * 1000).toISOString();
  const { data: claimed, error } = await db
    .from('invitations')
    .update({ expires_at: invitation.expires_at })
    .eq('id', invitation.id)
    .eq('status', 'pending')
    .lte('updated_at', cutoff)
    .select('id');
  if (error) refuse('server');
  if (!claimed?.length) refuse('too-soon', { retryAfter: resendCooldownSeconds });

  await sendInvitationEmail(db, invitation);
  return { invitation: summary(invitation) };
}

async function revoke(db: SupabaseClient, user: { id: string }, body: Record<string, unknown>) {
  const invitation = await forManager(db, body.invitationId, user);
  if (invitation.status !== 'pending') refuse('not-pending', { state: invitation.status });
  const { data, error } = await db
    .from('invitations')
    .update({ status: 'revoked', responded_at: new Date().toISOString() })
    .eq('id', invitation.id)
    .eq('status', 'pending')
    .select('id, workspace_id, email, role, status, expires_at, updated_at, created_at, invited_by')
    .maybeSingle();
  if (error) refuse('server');
  if (!data) refuse('not-pending');
  return { invitation: summary(data as InvitationRow) };
}

async function get(db: SupabaseClient, user: { email: string }, body: Record<string, unknown>) {
  const invitation = await forInvitee(db, body.invitationId, user);
  const [{ data: workspace }, { data: inviter }] = await Promise.all([
    db.from('workspaces').select('name').eq('id', invitation.workspace_id).maybeSingle(),
    invitation.invited_by ? db.from('profiles').select('full_name').eq('id', invitation.invited_by).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  return {
    invitation: {
      ...summary(invitation),
      workspaceName: workspace?.name ?? '',
      invitedBy: (inviter as { full_name?: string } | null)?.full_name ?? '',
    },
  };
}

// Single use: the invitation moves out of "pending" in one guarded update, so a second
// accept (or an accept after decline, revoke or expiry) is refused.
async function respond(db: SupabaseClient, user: { id: string; email: string }, body: Record<string, unknown>, answer: 'accepted' | 'declined') {
  const invitation = await forInvitee(db, body.invitationId, user);
  const state = invitationState(invitation.status, invitation.expires_at);
  if (state === 'expired') refuse('expired');
  if (state !== 'pending') refuse('not-pending', { state });

  const now = new Date().toISOString();
  const { data, error } = await db
    .from('invitations')
    .update({ status: answer, responded_at: now, ...(answer === 'accepted' ? { accepted_by: user.id } : {}) })
    .eq('id', invitation.id)
    .eq('status', 'pending')
    .gt('expires_at', now)
    .select('id')
    .maybeSingle();
  if (error) refuse('server');
  if (!data) refuse('not-pending');

  if (answer === 'accepted') {
    const { error: memberError } = await db
      .from('workspace_members')
      .upsert({ workspace_id: invitation.workspace_id, user_id: user.id, role: invitation.role }, { onConflict: 'workspace_id,user_id', ignoreDuplicates: true });
    if (memberError) {
      // Put the invitation back so it can be tried again
      await db.from('invitations').update({ status: 'pending', responded_at: null, accepted_by: null }).eq('id', invitation.id);
      refuse('server');
    }
  }
  return { invitation: { ...summary({ ...invitation, status: answer }) } };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'bad-request' }, 405);
  try {
    if (!supabaseUrl || !serviceKey || !anonKey) refuse('server');
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const user = await caller(req);
    const db = admin();
    switch (body.action) {
      case 'create':
        return json({ ok: true, ...(await create(db, user, body)) });
      case 'resend':
        return json({ ok: true, ...(await resend(db, user, body)) });
      case 'revoke':
        return json({ ok: true, ...(await revoke(db, user, body)) });
      case 'get':
        return json({ ok: true, ...(await get(db, user, body)) });
      case 'accept':
        return json({ ok: true, ...(await respond(db, user, body, 'accepted')) });
      case 'decline':
        return json({ ok: true, ...(await respond(db, user, body, 'declined')) });
      default:
        refuse('bad-request');
    }
  } catch (problem) {
    if (problem instanceof Refusal) return json({ ok: false, error: problem.code, ...problem.extra }, errorStatus[problem.code]);
    // Never log request bodies, tokens or keys: only that something failed
    console.error('invitations: unexpected error');
    return json({ ok: false, error: 'server' }, 500);
  }
  return json({ ok: false, error: 'bad-request' }, 400);
});
