'use client';

import { themeMenuCopy as copy, themeOptions } from '../../../shared/content/theme';
import { Button } from '../ui/Button';
import { MenuButton } from './MenuButton';
import styles from './ThemeMenu.module.css';
import { setThemePreference, useDeviceIsDark, useThemePreference } from './themeStore';

// Light / Dark / System menu beside the profile area. System is the default.
// Shares one saved choice with the profile menu's Appearance options.
export function ThemeMenu({ id }: { id: string }) {
  const preference = useThemePreference();
  const deviceIsDark = useDeviceIsDark();
  const current = themeOptions.find((option) => option.value === preference) ?? themeOptions[2];

  return (
    <MenuButton
      id={id}
      renderButton={(props) => (
        <Button variant="secondary" data-preference={preference} {...props}>
          {copy.buttonLabel(current.label)}
        </Button>
      )}
    >
      {({ menuId, close }) => (
        <>
          <p className={styles.heading} id={`${id}-heading`}>
            {copy.heading}
          </p>
          <div id={menuId} role="menu" aria-labelledby={`${id}-heading`} className={styles.list}>
            {themeOptions.map((option) => {
              const checked = option.value === preference;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={checked}
                  tabIndex={-1}
                  className={styles.item}
                  onClick={() => {
                    setThemePreference(option.value);
                    close(true);
                  }}
                >
                  <span className={styles.text}>
                    <span className={styles.label}>{option.label}</span>
                    <span className={styles.description}>{option.description(deviceIsDark)}</span>
                  </span>
                  <span className={styles.check} aria-hidden="true">
                    {checked ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
          <p className={styles.saved}>{copy.savedNote}</p>
        </>
      )}
    </MenuButton>
  );
}
