/*
 * Phase A2: wording used only in Supabase mode (real sign-in and data).
 *
 * Sample mode stays the default (D9) and never shows any of this. All wording is
 * PROVISIONAL until Team 03 reviews it. No em dashes in app copy.
 */

export const supabaseModeCopy = {
  // Replaces the "Prototype only" notice on Sign In and Create Account
  entryNotice: 'Development workspace. Use the test account your team gave you.',

  signIn: {
    // Shown when the email or password is wrong (Supabase doesn't say which)
    invalid: "That email and password don't match an account. Check them, then try again.",
    // Network or service problem
    unavailable: "Couldn't reach the sign-in service. Check your connection, then try again.",
    forgotHelp: 'Password reset isn’t available yet. Ask an Admin on your team to help you get back in.',
  },

  createAccount: {
    // Invitations arrive in Phase 2.5 (Edge Functions). Until then there's nothing to look up.
    unavailable:
      'Invitations aren’t connected yet. Ask an Admin on your team to set up your account, then sign in.',
  },

  session: {
    checking: 'Checking your sign-in…',
    noAccess: {
      title: 'No workspace access',
      body: 'You’re signed in, but you aren’t an active member of a workspace yet. Ask an Admin on your team to add you.',
    },
    error: "Couldn't check your sign-in. Check your connection, then reload the page.",
    signOut: 'Sign out',
    signingOut: 'Signing you out…',
    signOutError: "Couldn't sign you out. Try again.",
  },

  profile: {
    roleLabels: { owner: 'Owner', admin: 'Admin', reviewer: 'Reviewer', content_editor: 'Content Editor' } as Record<string, string>,
    status: (workspace: string) => `Signed in to ${workspace}.`,
  },

  // Replaces the sample-data notes on the review screens
  dataNote: 'Development data from the Cuidance Admin Web workspace. These screens are not part of participant testing.',
  tableCaption: 'Review tasks',
  needsAttentionCaption: 'Items that need attention',

  detail: {
    reviewingAs: (name: string) => `Reviewing as ${name}.`,
    // D4: only the assigned Reviewer records a decision
    notAssigned: 'Only the Reviewer assigned to this task can record a decision.',
    approved: 'This task is approved. Approved tasks can’t be decided again.',
    // D12: a task can be decided again after Needs changes, until it's Approved
    decideAgain: 'Record another decision',
    decideAgainHelp: 'Use this after the requested changes are made.',
    historyEmpty: 'No decisions recorded yet.',
    missingId: 'This task address is incomplete. Open the task from Review Tasks.',
    // Decisions are saved for the whole team and can't be undone
    saved: 'Saved for your team. Decisions can’t be changed or deleted.',
    errors: {
      save: "Couldn't save your decision. Check your connection, then try again.",
      // The database refused it (for example, someone else decided first)
      refused: "This decision wasn't accepted. Reload the page to see the task's current status.",
    },
  },
};
