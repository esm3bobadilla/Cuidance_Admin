'use client';

import { profileCopy as copy } from '../../../shared/content/profile';
import { themeMenuCopy, themeOptions } from '../../../shared/content/theme';
import { MenuButton } from './MenuButton';
import styles from './ProfileMenu.module.css';
import { setThemePreference, useThemePreference } from './themeStore';

// Appearance follows the prototype's order: Light, Dark, System
const appearanceOrder = ['light', 'dark', 'system'] as const;

// Profile menu (prototype F13): placeholder identity and the Appearance choice.
// Appearance shares one saved preference with the Theme menu.
export function ProfileMenu({ id }: { id: string }) {
  const preference = useThemePreference();

  return (
    <MenuButton
      id={id}
      renderButton={(props) => (
        <button type="button" className={styles.button} aria-label={copy.buttonLabel} {...props}>
          <span aria-hidden="true">{copy.initials}</span>
        </button>
      )}
    >
      {({ menuId, close }) => (
        <>
          <div className={styles.identity}>
            <span className={styles.initials} aria-hidden="true">
              {copy.initials}
            </span>
            <p className={styles.status}>
              <strong className={styles.name}>{copy.name}</strong> · {copy.status}
            </p>
          </div>
          <div className={styles.appearance}>
            <p className={styles.heading} id={`${id}-appearance`}>
              {copy.appearanceHeading}
            </p>
            <div id={menuId} role="menu" aria-labelledby={`${id}-appearance`} className={styles.segments}>
              {appearanceOrder.map((value) => {
                const option = themeOptions.find((item) => item.value === value)!;
                const checked = value === preference;
                return (
                  <button
                    key={value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={checked}
                    tabIndex={-1}
                    className={styles.segment}
                    onClick={() => {
                      setThemePreference(value);
                      close(true);
                    }}
                  >
                    {checked && (
                      <span className={styles.check} aria-hidden="true">
                        ✓
                      </span>
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className={styles.saved}>{themeMenuCopy.savedNote}</p>
          </div>
        </>
      )}
    </MenuButton>
  );
}
