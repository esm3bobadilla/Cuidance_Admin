/*
 * Week 11, Close the Loop, feature 2: invitation and account setup rules.
 *
 * The one place these rules live. No React and no browser code here.
 * PROTOTYPE ONLY: nothing here signs anyone in, creates an account or checks
 * permissions. The password is checked on screen and never stored.
 *
 * Approved by Team 03 (Nov 10, 2026):
 * - A6 Password: at least 12 characters, at least one letter, at least one number.
 * - A7 Work email: a valid email that matches the invitation.
 */
import type { Invitation } from '../content/invitation';

export type PasswordRequirement = { id: 'length' | 'letter' | 'number'; label: string; test: (password: string) => boolean };

export const passwordRequirements: PasswordRequirement[] = [
  { id: 'length', label: 'At least 12 characters', test: (password) => password.length >= 12 },
  { id: 'letter', label: 'At least one letter', test: (password) => /[A-Za-z]/.test(password) },
  { id: 'number', label: 'At least one number', test: (password) => /[0-9]/.test(password) },
];

export const meetsPasswordRequirements = (password: string) => passwordRequirements.every((rule) => rule.test(password));

// A plain format check: something@something.something, no spaces
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const sameEmail = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

// Phase A1 sample Sign In: both fields filled and the email well formed. Nothing is checked
// against an account: sign-in isn't connected yet.
export type SignInErrors = Partial<{ email: 'missing' | 'invalid'; password: 'missing' }>;

export function validateSignIn(email: string, password: string): SignInErrors {
  const errors: SignInErrors = {};
  if (!email.trim()) errors.email = 'missing';
  else if (!isValidEmail(email)) errors.email = 'invalid';
  if (!password) errors.password = 'missing';
  return errors;
}

// Phase A1 sample Create Account: an invitation is found only for its exact email.
// It never creates an account (accounts are invitation only).
export function findInvitationByEmail(email: string, invitation: Invitation): Invitation | undefined {
  return !invitation.expired && sameEmail(email, invitation.invitedEmail) ? invitation : undefined;
}

export type SetupFields = { fullName: string; email: string; password: string; confirm: string };

export type SetupErrors = Partial<{
  fullName: 'missing';
  email: 'missing' | 'invalid' | 'mismatch';
  password: 'missing' | 'requirements';
  confirm: 'missing' | 'mismatch';
}>;

// Field order matches the form, so the first error is the first field to focus
export const setupFieldOrder = ['fullName', 'email', 'password', 'confirm'] as const;

export function validateSetup(fields: SetupFields, invitation: Invitation): SetupErrors {
  const errors: SetupErrors = {};
  if (!fields.fullName.trim()) errors.fullName = 'missing';
  if (!fields.email.trim()) errors.email = 'missing';
  else if (!isValidEmail(fields.email)) errors.email = 'invalid';
  else if (!sameEmail(fields.email, invitation.invitedEmail)) errors.email = 'mismatch';
  if (!fields.password) errors.password = 'missing';
  else if (!meetsPasswordRequirements(fields.password)) errors.password = 'requirements';
  if (!fields.confirm) errors.confirm = 'missing';
  else if (fields.confirm !== fields.password) errors.confirm = 'mismatch';
  return errors;
}

// What this browser tab remembers. Never a password.
export type OnboardingSession = {
  // The sample invitation's answer in this tab
  invitation: 'accepted' | 'declined' | null;
  account: { fullName: string; email: string } | null;
  // "Request a new invitation" was chosen (nothing is sent)
  requested: boolean;
};

export const emptyOnboardingSession: OnboardingSession = { invitation: null, account: null, requested: false };

export type InvitationView = 'valid' | 'expired' | 'declined' | 'accepted' | 'not-found';

// Which Accept Invitation state to show
export function invitationView(invitation: Invitation | undefined, session: OnboardingSession): InvitationView {
  if (!invitation) return 'not-found';
  if (invitation.expired) return 'expired';
  if (session.invitation === 'declined') return 'declined';
  if (session.invitation === 'accepted') return 'accepted';
  return 'valid';
}

export type SetupView = 'missing' | 'form' | 'created';

// Which Account Setup state to show
export function setupView(session: OnboardingSession): SetupView {
  if (session.account) return 'created';
  if (session.invitation === 'accepted') return 'form';
  return 'missing';
}

// Reads what was saved in the browser. Anything unexpected is dropped, and a
// saved password (which should never exist) is never read back.
export function parseOnboardingSession(raw: unknown): OnboardingSession {
  const record = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const invitation = record.invitation === 'accepted' || record.invitation === 'declined' ? record.invitation : null;
  const account = record.account as Record<string, unknown> | null | undefined;
  const validAccount =
    invitation === 'accepted' && account && typeof account.fullName === 'string' && account.fullName.trim() && typeof account.email === 'string'
      ? { fullName: account.fullName, email: account.email }
      : null;
  return { invitation, account: validAccount, requested: record.requested === true };
}
