/*
 * Admin Web color theme preference: System (follows the device), Light or Dark.
 *
 * System is the default and stores nothing. Light and Dark are saved in the
 * browser on this device only (no accounts yet). The tokens in
 * shared/design-tokens/tokens.css read data-theme on <html>.
 */

export type ThemePreference = 'system' | 'light' | 'dark';

export const themeStorageKey = 'cuidance-admin-theme';

// Phase B1 (Team 03 decision, Nov 16, 2026): one Light / Dark button in the top bar, as in
// the approved prototype. Until someone presses it, the device setting (System) applies.
export const themeToggleCopy = {
  lightMode: 'Light mode',
  darkMode: 'Dark mode',
  switchToDark: 'Switch to dark mode',
  switchToLight: 'Switch to light mode',
};

// Runs in <head> before the page draws, so a saved choice never flashes the wrong colors.
// If storage is blocked or empty, nothing happens and the device setting applies.
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
