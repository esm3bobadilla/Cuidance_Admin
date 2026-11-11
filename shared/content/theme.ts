/*
 * Admin Web color theme preference: System (follows the device), Light or Dark.
 *
 * System is the default and stores nothing. Light and Dark are saved in the
 * browser on this device only (no accounts yet). The tokens in
 * shared/design-tokens/tokens.css read data-theme on <html>.
 */

export type ThemePreference = 'system' | 'light' | 'dark';

export const themeStorageKey = 'cuidance-admin-theme';

// Phase A1: icon-only header controls (Light, Dark, System). Each has an accessible
// name and a visible tooltip. System shows the approved Cuidance symbol mark in one color.
export const themeSwitchCopy = {
  groupLabel: 'Theme',
  options: {
    light: { label: 'Light theme', tooltip: 'Light' },
    dark: { label: 'Dark theme', tooltip: 'Dark' },
    system: { label: 'System theme, follows your device', tooltip: 'System' },
  },
};

// Runs in <head> before the page draws, so a saved choice never flashes the wrong colors.
// If storage is blocked or empty, nothing happens and the device setting applies.
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
