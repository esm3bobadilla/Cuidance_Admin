/*
 * Admin Web color theme preference: System (follows the device), Light or Dark.
 *
 * System is the default and stores nothing. Light and Dark are saved in the
 * browser on this device only (no accounts yet). The tokens in
 * shared/design-tokens/tokens.css read data-theme on <html>.
 */

export type ThemePreference = 'system' | 'light' | 'dark';

export const themeStorageKey = 'cuidance-admin-theme';

export const themeLabel = 'Theme';

// Wording for the Theme menu beside the profile area, in the prototype's order
export const themeMenuCopy = {
  heading: 'Theme',
  savedNote: 'Saved on this device.',
  // The button reads "Theme: System" and so on
  buttonLabel: (current: string) => `${themeLabel}: ${current}`,
};

export const themeOptions: { value: ThemePreference; label: string; description: (deviceIsDark: boolean) => string }[] = [
  { value: 'light', label: 'Light', description: () => 'Always use the light theme' },
  { value: 'dark', label: 'Dark', description: () => 'Always use the dark theme' },
  {
    value: 'system',
    label: 'System',
    description: (deviceIsDark) => `Follows your device (now ${deviceIsDark ? 'dark' : 'light'})`,
  },
];

// Runs in <head> before the page draws, so a saved choice never flashes the wrong colors.
// If storage is blocked or empty, nothing happens and the device setting applies.
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
