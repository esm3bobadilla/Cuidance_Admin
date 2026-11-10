/*
 * Account Setup (Week 11, Close the Loop, feature 2): wording.
 *
 * PROTOTYPE ONLY. No account is created and the password is never saved or sent.
 * Password requirements and the email rule are approved by Team 03 (Nov 10, 2026,
 * decisions A6 and A7). All other wording is PROVISIONAL.
 */

export const accountSetupCopy = {
  pageTitle: 'Account Setup · Cuidance Admin Web',
  eyebrow: 'Account setup',
  title: 'Set up your account',
  intro: 'Create your Cuidance Admin Web account to start reviewing.',
  summary: {
    heading: 'Your access',
    workspace: 'Workspace',
    role: 'Role',
    invitedBy: 'Invited by',
  },
  fields: {
    fullName: 'Full name',
    email: 'Work email',
    emailHelper: 'Use the email this invitation was sent to.',
    password: 'Password',
    confirm: 'Confirm password',
  },
  requirements: {
    heading: 'Password requirements',
    met: 'met',
    notMet: 'not met yet',
  },
  errors: {
    fullName: 'Enter your full name.',
    emailMissing: 'Enter your work email.',
    emailInvalid: 'Enter a valid email address, like name@example.com.',
    emailMismatch: (invited: string) => `Use the email this invitation was sent to: ${invited}.`,
    passwordMissing: 'Enter a password.',
    passwordRequirements: 'Use a password that meets all three requirements.',
    confirmMissing: 'Enter your password again.',
    confirmMismatch: 'Passwords don’t match.',
    submit: "Couldn't create your account. Try again.",
  },
  create: 'Create account',
  back: 'Back',
  creating: 'Creating your account…',
  success: {
    title: 'Account created',
    body: (name: string, role: string, workspace: string) => `Welcome, ${name}. Your ${role} access to ${workspace} is ready.`,
    note: 'Prototype only: this account exists in this browser tab only. Nothing was saved or sent.',
    goToReviewTasks: 'Go to Review Tasks',
  },
  missing: {
    title: 'Accept your invitation first',
    body: 'Account setup starts from an accepted invitation.',
    action: 'Go to your invitation',
  },
  reset: 'Reset sample data',
  resetHelp: 'Clears the invitation and account setup in this browser tab.',
  noScript: 'Turn on JavaScript to set up your account.',
  // PROVISIONAL state messages
  states: {
    loading: 'Loading your account details…',
  },
};
