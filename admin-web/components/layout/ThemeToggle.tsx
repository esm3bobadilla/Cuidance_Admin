'use client';

import { themeToggleCopy as copy } from '../../../shared/content/theme';
import { CuIcon } from '../ui/CuIcon';
import { setThemePreference, useDeviceIsDark, useThemePreference } from './themeStore';
import styles from './ThemeToggle.module.css';

// One Light / Dark button (approved prototype). The label shows the current mode; the
// accessible name says what pressing it does. With no saved choice, it follows the device.
export function ThemeToggle() {
  const preference = useThemePreference();
  const deviceDark = useDeviceIsDark();
  const dark = preference === 'dark' || (preference === 'system' && deviceDark);
  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={dark ? copy.buttonName(copy.darkMode, copy.switchToLight) : copy.buttonName(copy.lightMode, copy.switchToDark)}
      title={dark ? copy.switchToLight : copy.switchToDark}
      onClick={() => setThemePreference(dark ? 'light' : 'dark')}
    >
      <CuIcon name={dark ? 'moon' : 'sun'} size={20} />
      <span className={styles.label}>{dark ? copy.darkMode : copy.lightMode}</span>
    </button>
  );
}
