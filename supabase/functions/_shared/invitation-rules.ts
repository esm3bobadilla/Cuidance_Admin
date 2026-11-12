/*
 * Phase A3: invitation rules used by the invitations Edge Function.
 *
 * Plain functions, no database or network, so they're easy to test. The database
 * enforces the same limits again (CHECK constraints, the unique pending index and
 * the 7-day default from the Phase 2.1 migrations), so a mistake here can't
 * create an Owner invitation or a second pending one.
 *
 * Approved by Team 03 (Phase 2.0):
 *   D5  Owners invite Admins and Reviewers; Admins invite Reviewers; Reviewers invite no one.
 *   D3  Content Editor is reserved and can't be invited yet. No one invites an Owner.
 *   D7  An invitation lasts 7 days. Resending sends a fresh link; it never extends the 7 days.
 */

export type WorkspaceRole = 'owner' | 'admin' | 'reviewer' | 'content_editor';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'revoked';
// What the screens show: "expired" is a pending invitation past its 7 days
export type InvitationState = InvitationStatus | 'expired';

// D5
const invitable: Record<WorkspaceRole, WorkspaceRole[]> = {
  owner: ['admin', 'reviewer'],
  admin: ['reviewer'],
  reviewer: [],
  content_editor: [],
};

export const rolesCallerMayInvite = (caller: WorkspaceRole | null): WorkspaceRole[] => (caller ? invitable[caller] ?? [] : []);

export const mayInvite = (caller: WorkspaceRole | null, role: string): boolean =>
  rolesCallerMayInvite(caller).includes(role as WorkspaceRole);

// Revoking and resending follow the same rule as inviting: you manage what you could invite
export const mayManage = mayInvite;

// Resend cooldown per invitation (prototype-scale rate limit). Supabase Auth also
// rate-limits emails per project.
export const resendCooldownSeconds = 60;

export const normalizeEmail = (email: unknown): string => (typeof email === 'string' ? email.trim().toLowerCase() : '');

// The same simple check as the database CHECK constraint and the app's form
export const isValidEmail = (email: string): boolean => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length <= 254;

export function invitationState(status: InvitationStatus, expiresAt: string | Date, now: Date = new Date()): InvitationState {
  return status === 'pending' && new Date(expiresAt).getTime() <= now.getTime() ? 'expired' : status;
}

// Seconds left before another resend is allowed (0 = allowed now)
export function resendWaitSeconds(lastSentAt: string | Date, now: Date = new Date()): number {
  const elapsed = (now.getTime() - new Date(lastSentAt).getTime()) / 1000;
  return elapsed >= resendCooldownSeconds ? 0 : Math.ceil(resendCooldownSeconds - elapsed);
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string => typeof value === 'string' && uuidPattern.test(value);

// The link in the email: the site's Accept Invitation page for this invitation.
// Supabase Auth adds the single-use token (see supabase/templates/).
export function acceptUrl(siteUrl: string, invitationId: string): string {
  return `${siteUrl.replace(/\/+$/, '')}/accept-invitation/?invitation=${encodeURIComponent(invitationId)}`;
}

// Error codes the app turns into plain-language messages. Nothing here says whether
// an email has an account, and "not-found" covers "not yours" too, so nothing leaks.
export type ErrorCode =
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
  | 'server';

export const errorStatus: Record<ErrorCode, number> = {
  'bad-request': 400,
  'not-signed-in': 401,
  'not-allowed': 403,
  'invalid-email': 400,
  'invalid-role': 400,
  'already-member': 409,
  'already-pending': 409,
  'not-found': 404,
  expired: 410,
  'not-pending': 409,
  'too-soon': 429,
  'send-failed': 502,
  server: 500,
};
