/*
 * Profile area (Phase A1): the top-bar profile button, the sidebar Profile card and
 * the Profile / Notifications panel.
 *
 * There's no sign-in yet, so the profile shows neutral placeholder initials ("TM"
 * for team member), not a real person. No avatar artwork: initials only.
 * Appearance moved out of the profile panel to the header theme controls (Phase A1).
 * Sign out opens the sample Sign In screen; nothing is signed out because nothing
 * is signed in.
 */
export const profileCopy = {
  initials: 'TM',
  buttonLabel: 'Profile and notifications',
  // Spoken name starts with the visible initials (WCAG 2.5.3 Label in Name)
  buttonName: (initials: string, extra?: string) => `${initials}, Profile and notifications${extra ? `, ${extra}` : ''}`,
  name: 'Team member',
  role: 'Super Admin (sample)',
  status: "Sample account. Sign-in isn't connected yet.",
  // Distinct from the Profile page's own region, so screen readers don't hear "Profile" twice
  cardLabel: 'Your account',
  signOut: 'Sign out',
};
