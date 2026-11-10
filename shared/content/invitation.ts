/*
 * Accept Invitation (Week 11, Close the Loop, feature 2): sample invitations and wording.
 *
 * PROTOTYPE ONLY. There are no invitation tokens, no email and no server. The page
 * picks a sample invitation from the address (?invite=), and what the person does is
 * kept in this browser tab only.
 *
 * Approved by Team 03 (Nov 10, 2026, decisions A1 to A5, A11, A13):
 * - The invited person is the placeholder "Reviewer B", role Reviewer, so the person
 *   lines up with the Review Task Decision Loop.
 * - The email is on example.com, which is reserved for samples: it's no one's real address.
 * - Workspace "Cuidance Content Team" (Team Access prototype wording).
 * - Invited by "Team member A (Main Admin / Owner)".
 * - Fixed sample expiry dates.
 * All other wording here is PROVISIONAL until Team 03 reviews it.
 */
import type { AdminRole } from './admin-roles';

export type InvitationId = 'sample' | 'expired';

export type Invitation = {
  id: InvitationId;
  workspace: string;
  invitedName: string;
  invitedEmail: string;
  role: AdminRole['id'];
  invitedBy: string;
  // Shown as written, in the seed's date style
  expires: string;
  expired: boolean;
};

const shared = {
  workspace: 'Cuidance Content Team',
  invitedName: 'Reviewer B',
  invitedEmail: 'reviewer.b@example.com',
  role: 'reviewer' as const,
  invitedBy: 'Team member A (Main Admin / Owner)',
};

export const invitationsSeed: Record<InvitationId, Invitation> = {
  sample: { id: 'sample', ...shared, expires: 'Nov 24, 2026', expired: false },
  expired: { id: 'expired', ...shared, expires: 'Nov 3, 2026', expired: true },
};

// The invitation the setup flow uses when the address doesn't name one
export const defaultInvitationId: InvitationId = 'sample';

// Reads ?invite=. No value means the sample invitation; an unknown value means "not found".
export function invitationFromParam(value: string | null): Invitation | undefined {
  if (value === null || value === '') return invitationsSeed[defaultInvitationId];
  return value in invitationsSeed ? invitationsSeed[value as InvitationId] : undefined;
}

export const prototypeNotice = 'Prototype only. No account is created, and your password is not saved or sent.';

export const invitationCopy = {
  pageTitle: 'Accept Invitation · Cuidance Admin Web',
  eyebrow: 'Invitation',
  welcome: {
    heading: 'Cuidance Admin Web',
    body: 'An internal tool for the Cuidance team to review and maintain content before it reaches the app.',
    steps: ['Accept your invitation', 'Set up your account', 'Start reviewing tasks'],
    stepsLabel: 'Getting started',
  },
  valid: {
    title: 'You’re invited to Cuidance Admin Web',
    intro: 'Check the details below, then accept or decline this invitation.',
    accept: 'Accept invitation',
    decline: 'Decline invitation',
  },
  fields: {
    workspace: 'Workspace',
    invitedPerson: 'Invited person',
    invitedEmail: 'Invited email',
    role: 'Assigned role',
    invitedBy: 'Invited by',
    expires: 'Invitation expires',
  },
  accepted: {
    title: 'Invitation accepted',
    body: 'Next, set up your account.',
    continue: 'Continue to account setup',
  },
  alreadyAccepted: {
    title: 'This invitation has already been accepted',
    body: 'Continue where you left off.',
    continueSetup: 'Continue to account setup',
    goToReviewTasks: 'Go to Review Tasks',
  },
  expired: {
    title: 'This invitation has expired',
    body: (date: string) => `It expired on ${date}. Ask an Admin to send a new invitation.`,
  },
  declined: {
    title: 'Invitation declined',
    body: 'You won’t be added to this workspace. If this was a mistake, ask an Admin to send a new invitation.',
  },
  notFound: {
    title: 'Invitation not found',
    body: 'This invitation link isn’t valid. Ask an Admin to send a new invitation.',
  },
  request: {
    action: 'Request a new invitation',
    // A11: nothing is sent in the prototype
    done: 'Ask an Admin to send a new invitation. No email is sent from this prototype.',
  },
  reset: 'Reset sample data',
  resetHelp: 'Clears the invitation and account setup in this browser tab.',
  noScript: 'Turn on JavaScript to accept or decline this invitation.',
  // PROVISIONAL state messages
  states: {
    loading: 'Checking your invitation…',
    error: "Couldn't save your answer. Try again.",
  },
};
