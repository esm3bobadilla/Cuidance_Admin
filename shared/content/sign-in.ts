/*
 * Sign In and Create Account (Phase A1, sample mode): wording.
 *
 * PROTOTYPE ONLY. Sign-in isn't connected: nothing is checked, saved or sent, and the
 * password never leaves the field. Accounts are invitation only: Create Account
 * looks for an invitation; it never creates an account on its own (no public sign-ups).
 * Visual source: the Phase A1 reference pack ("Cuidance Sign-in Entry").
 * All wording is PROVISIONAL until Team 03 reviews it.
 */

export const entryCopy = {
  // Large display line from the Sign-in Entry reference
  headline: 'Support clearer, safer guidance.',
  body: 'Review educational content, sources, claims and partner material in one thoughtful workspace, so Cuidance guidance stays accurate, consistent and safe.',
  notice: 'Prototype only. Sign-in isn’t connected yet: nothing is checked, saved or sent.',
};

export const signInCopy = {
  pageTitle: 'Sign In · Cuidance Admin Web',
  title: 'Sign in to continue',
  email: 'Email',
  emailPlaceholder: 'name@example.com',
  password: 'Password',
  passwordPlaceholder: 'Enter your password',
  submit: 'Sign in',
  createAccount: 'Create an account',
  forgot: 'Forgot password?',
  forgotHelp: 'Password reset isn’t connected yet. Ask an Admin on your team to help you get back in.',
  help: 'Need help? Ask an Admin on your team.',
  signingIn: 'Signing you in…',
  errors: {
    emailMissing: 'Enter your email.',
    emailInvalid: 'Enter a valid email address, like name@example.com.',
    passwordMissing: 'Enter your password.',
    submit: "Couldn't sign you in. Check your email and password, then try again.",
  },
  noScript: 'Turn on JavaScript to sign in.',
};

export const createAccountCopy = {
  pageTitle: 'Create Account · Cuidance Admin Web',
  title: 'Create your account',
  intro: 'Cuidance Admin Web accounts are by invitation only. Enter the work email your invitation was sent to.',
  email: 'Work email',
  submit: 'Find my invitation',
  back: 'Back to sign in',
  searching: 'Looking for your invitation…',
  found: {
    title: 'We found your invitation',
    body: (workspace: string, role: string) => `You’re invited to ${workspace} as a ${role}.`,
    action: 'Go to your invitation',
  },
  notFound: 'No invitation was found for this email. Ask an Admin on your team to invite you.',
  errors: {
    emailMissing: 'Enter your work email.',
    emailInvalid: 'Enter a valid email address, like name@example.com.',
    submit: "Couldn't look up your invitation. Try again.",
  },
  noScript: 'Turn on JavaScript to find your invitation.',
};
