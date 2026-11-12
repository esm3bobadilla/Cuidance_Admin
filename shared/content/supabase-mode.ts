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
  },

  createAccount: {
    // Accounts are invitation only (no public sign-ups): the invitation email has the link
    unavailable:
      'Accounts are by invitation only. Ask an Admin on your team to invite you, then use the link in your invitation email.',
  },

  // Phase A3: links from emails (invitation, sign-in, password reset)
  link: {
    checking: 'Checking your link…',
    // Expired, already used or changed: the same message, so nothing about the account leaks
    invalid: {
      title: 'This link has expired or was already used',
      body: 'Links in invitation emails work once and expire after an hour. Ask the person who invited you to resend the invitation.',
      resetBody: 'Password links work once and expire after an hour. Ask for a new link from the Sign In page.',
    },
    signInNeeded: {
      title: 'Open the link in your invitation email',
      body: 'To answer this invitation, use the link in your invitation email, or sign in with the email it was sent to.',
      action: 'Sign in',
    },
  },

  invitation: {
    expires: (date: string) => `This invitation expires on ${date}.`,
    accepting: 'Accepting your invitation…',
    declining: 'Declining your invitation…',
    revoked: {
      title: 'This invitation was withdrawn',
      body: 'It can’t be used any more. If you still need access, ask an Admin on your team to send a new invitation.',
    },
    accepted: {
      // New accounts set a password next; existing accounts go straight in
      setupBody: 'Next, set up your account.',
      memberBody: 'You’re now a member of this workspace.',
    },
    errors: {
      answer: "Couldn't save your answer. Check your connection, then try again.",
      changed: 'This invitation changed since you opened it. Reload the page to see its current status.',
    },
  },

  setup: {
    title: 'Set up your account',
    intro: 'Choose your name and a password. You’ll use them to sign in.',
    resetTitle: 'Choose a new password',
    resetIntro: 'Choose a new password for your account.',
    emailHelper: 'This is the email your invitation was sent to.',
    save: 'Save and continue',
    saveReset: 'Save new password',
    saving: 'Saving…',
    done: {
      title: 'Your account is ready',
      body: (name: string) => `Welcome, ${name}. You can now sign in with your email and password.`,
      resetTitle: 'Password changed',
      resetBody: 'Use your new password the next time you sign in.',
      action: 'Go to Review Tasks',
    },
    errors: {
      // Supabase Auth refused the password (it checks the same rules)
      weak: 'Use a password that meets all three requirements.',
      same: 'Choose a password you haven’t used for this account before.',
      save: "Couldn't save your password. Check your connection, then try again.",
    },
    signedOut: {
      title: 'Open the link in your email',
      body: 'Setting up or resetting a password starts from the link in your invitation or password email.',
    },
  },

  forgot: {
    intro: 'Enter your email above, then ask for a link to choose a new password.',
    send: 'Send reset link',
    sending: 'Sending…',
    // Always the same, so it never says whether an account exists
    sent: 'If an account uses that email, we sent a link to choose a new password. It expires in 1 hour.',
    errors: {
      email: 'Enter your email above first.',
      tooSoon: 'Please wait a minute before asking for another link.',
      failed: "Couldn't send the link. Check your connection, then try again.",
    },
  },

  // Phase A3: Team Access (Settings) invitations
  team: {
    membersCaption: 'Team members',
    invitationsHeading: 'Invitations',
    invitationsCaption: 'Invitations',
    noInvitations: 'No invitations yet.',
    inviteHeading: 'Invite a team member',
    inviteIntro: 'They get an email with a link to accept. The invitation stays open for 7 days.',
    email: 'Email',
    role: 'Role',
    send: 'Send invitation',
    sending: 'Sending invitation…',
    sent: (email: string) => `Invitation sent to ${email}.`,
    resend: 'Resend invitation link',
    resent: (email: string) => `A new link was sent to ${email}. The invitation still expires on the same date.`,
    revoke: 'Withdraw invitation',
    revoked: (email: string) => `The invitation for ${email} was withdrawn.`,
    columns: { email: 'Email', role: 'Role', status: 'Status', expires: 'Expires', actions: 'Actions', joined: 'Joined' },
    states: { pending: 'Pending', expired: 'Expired', accepted: 'Accepted', declined: 'Declined', revoked: 'Withdrawn' } as Record<string, string>,
    reviewerNote: 'Only Owners and Admins can invite team members.',
    errors: {
      email: 'Enter a valid email address, like name@example.com.',
      role: 'Choose a role.',
      alreadyMember: 'That person is already a member of this workspace.',
      alreadyPending: 'That email already has an open invitation. Resend it from the list below.',
      notAllowed: 'Your role can’t invite or manage this kind of invitation.',
      expired: 'This invitation has expired. Send a new invitation instead.',
      notPending: 'This invitation was already answered or withdrawn.',
      tooSoon: (seconds: number) => `Please wait ${seconds} seconds before resending.`,
      sendFailed: "The invitation email couldn't be sent. Try again in a few minutes.",
      generic: "Something went wrong. Check your connection, then try again.",
    },
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
