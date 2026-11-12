'use client';

import { adminScreens } from '../../../shared/content/admin-web-screens';
import { getSupabase } from './supabaseClient';

/*
 * Phase A3 (Supabase mode): the browser side of invitations, email links and passwords.
 *
 * - Invitations go through the `invitations` Edge Function, with the signed-in user's
 *   token. The function holds the service-role key; the browser never sees it.
 * - Email links carry a single-use token (token_hash). It is read once, removed from the
 *   address straight away (so it isn't kept in history or shared by copy and paste), then
 *   checked with Supabase Auth. Nothing here logs or stores it.
 */

export type InvitationState = 'pending' | 'expired' | 'accepted' | 'declined' | 'revoked';

export type InvitationSummary = {
  id: string;
  email: string;
  role: string;
  state: InvitationState;
  expiresAt: string;
  workspaceName?: string;
  invitedBy?: string;
};

export type FunctionError =
  | 'bad-request'
  | 'not-signed-in'
  | 'not-allowed'
  | 'invalid-email'
  | 'invalid-role'
  | 'already-member'
  | 'already-pending'
  | 'not-found'
  | 'expired'
  | 'not-pending'
  | 'too-soon'
  | 'send-failed'
  | 'server'
  | 'network';

export type FunctionResult<T> = { ok: true; data: T } | { ok: false; error: FunctionError; retryAfter?: number; state?: InvitationState };

type Action =
  | { action: 'create'; workspaceId: string; email: string; role: string }
  | { action: 'resend' | 'revoke' | 'get' | 'accept' | 'decline'; invitationId: string };

export async function callInvitations(request: Action): Promise<FunctionResult<{ invitation: InvitationSummary }>> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.functions.invoke('invitations', { body: request });
    if (!error && data?.ok) return { ok: true, data: { invitation: data.invitation } };
    // The function answers refusals with a JSON body ({ ok: false, error, … })
    const context = (error as { context?: Response } | null)?.context;
    const body = context && typeof context.json === 'function' ? await context.json().catch(() => null) : data;
    if (body && typeof body.error === 'string') return { ok: false, error: body.error, retryAfter: body.retryAfter, state: body.state };
    return { ok: false, error: 'network' };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export type LinkType = 'invite' | 'magiclink' | 'recovery';
const linkTypes: LinkType[] = ['invite', 'magiclink', 'recovery'];

// Reads the email-link token once and removes it (and its type) from the address
export function takeLinkToken(): { tokenHash: string; type: LinkType } | null {
  const url = new URL(window.location.href);
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as LinkType | null;
  if (!tokenHash && !type) return null;
  url.searchParams.delete('token_hash');
  url.searchParams.delete('type');
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  return tokenHash && type && linkTypes.includes(type) ? { tokenHash, type } : null;
}

// Checks the token with Supabase Auth; on success the person is signed in
export async function verifyLinkToken(link: { tokenHash: string; type: LinkType }): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.verifyOtp({ token_hash: link.tokenHash, type: link.type });
    return !error;
  } catch {
    return false;
  }
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Where a password-reset email link points (this site's Account Setup, in reset mode)
export const resetRedirect = () => `${window.location.origin}${base}${adminScreens['account-setup'].path}?mode=reset`;

export type ResetResult = 'sent' | 'too-soon' | 'failed';

// Always answers "sent" when Supabase accepted the request, whether or not the email
// has an account, so the page can't be used to find out who has one.
export async function requestPasswordReset(email: string): Promise<ResetResult> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: resetRedirect() });
    if (!error) return 'sent';
    return error.status === 429 ? 'too-soon' : 'failed';
  } catch {
    return 'failed';
  }
}

export type PasswordResult = 'saved' | 'weak' | 'same' | 'failed';

// Sets the signed-in person's password (and, during setup, their name)
export async function savePassword(password: string, fullName?: string): Promise<PasswordResult> {
  try {
    const supabase = await getSupabase();
    // account_ready: Accept Invitation uses it to skip setup next time (display only, not a permission)
    const { data, error } = await supabase.auth.updateUser({ password, data: { account_ready: true, ...(fullName ? { full_name: fullName } : {}) } });
    if (error) {
      if (error.code === 'weak_password') return 'weak';
      if (error.code === 'same_password') return 'same';
      return 'failed';
    }
    if (fullName && data.user) {
      const { error: profileError } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', data.user.id);
      if (profileError) return 'failed';
    }
    return 'saved';
  } catch {
    return 'failed';
  }
}
