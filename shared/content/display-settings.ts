/*
 * Admin Web display settings (Settings > Accessibility & display).
 *
 * Saved in the browser on this device only. The boot script applies them to
 * <html> before the page draws, and shared/design-tokens/tokens.css plus
 * admin-web/app/globals.css read the data attributes.
 */

export type TextSize = 'default' | 'large' | 'larger';
export type Density = 'comfortable' | 'compact';
// "system" follows the device setting (Increase contrast, Reduce motion)
export type ContrastPreference = 'system' | 'more' | 'standard';
export type MotionPreference = 'system' | 'reduce' | 'standard';

export type DisplaySettings = {
  textSize: TextSize;
  density: Density;
  contrast: ContrastPreference;
  motion: MotionPreference;
  alwaysShowFocus: boolean;
};

export const defaultDisplaySettings: DisplaySettings = {
  textSize: 'default',
  density: 'comfortable',
  contrast: 'system',
  motion: 'system',
  alwaysShowFocus: false,
};

export const displayStorageKey = 'cuidance-admin-display';

// Data attribute on <html> for each setting. A default value removes the attribute.
export const displayAttributes = {
  textSize: 'data-text-size',
  density: 'data-density',
  contrast: 'data-contrast',
  motion: 'data-motion',
  alwaysShowFocus: 'data-focus',
} as const;

export const displaySettingsCopy = {
  sectionTitle: 'Accessibility & display',
  sectionIntro: 'These settings are saved in this browser on this device only.',
  textSize: {
    legend: 'Text size',
    options: { default: 'Default', large: 'Large', larger: 'Larger' } satisfies Record<TextSize, string>,
  },
  density: {
    legend: 'Density',
    options: { comfortable: 'Comfortable', compact: 'Compact' } satisfies Record<Density, string>,
  },
  contrast: {
    legend: 'Contrast',
    options: { system: 'Follow my device', more: 'High contrast', standard: 'Standard' } satisfies Record<ContrastPreference, string>,
  },
  motion: {
    legend: 'Motion',
    options: { system: 'Follow my device', reduce: 'Reduce motion', standard: 'Standard' } satisfies Record<MotionPreference, string>,
  },
  alwaysShowFocus: {
    label: 'Always show focus indicators',
    hint: 'Shows the focus outline after mouse and touch too, not only the keyboard.',
  },
  reset: 'Reset display settings',
  saved: 'Display settings saved on this device.',
};

const keys = JSON.stringify(displayAttributes);
// Runs in <head> before the page draws. Unknown or missing values are ignored.
export const displayBootScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(displayStorageKey)})||'{}');var a=${keys};var ok={textSize:['large','larger'],density:['compact'],contrast:['more','standard'],motion:['reduce','standard']};var r=document.documentElement;for(var k in ok){if(ok[k].indexOf(s[k])>-1)r.setAttribute(a[k],s[k]);}if(s.alwaysShowFocus===true)r.setAttribute(a.alwaysShowFocus,'always');}catch(e){}})();`;
