'use client';

import { useEffect, useState } from 'react';
import {
  themeLabel,
  themeOptions,
  themeStorageKey,
  type ThemePreference as Preference,
} from '../../../shared/content/theme';
import { Select } from '../forms/Select';
import styles from './ThemePreference.module.css';

const isChoice = (value: string | null): value is 'light' | 'dark' => value === 'light' || value === 'dark';

// Applies a choice to the page and remembers it on this device. System clears both.
function applyPreference(preference: Preference) {
  const root = document.documentElement;
  try {
    if (preference === 'system') {
      root.removeAttribute('data-theme');
      localStorage.removeItem(themeStorageKey);
    } else {
      root.setAttribute('data-theme', preference);
      localStorage.setItem(themeStorageKey, preference);
    }
  } catch {
    // Storage can be blocked (private modes): the choice still applies for this page
    if (preference === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', preference);
  }
}

// Light / Dark / System. Defaults to System; the saved choice is applied before
// first paint by the script in the root layout, and shown here once the page loads.
export function ThemePreference({ id }: { id: string }) {
  const [preference, setPreference] = useState<Preference>('system');

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(themeStorageKey);
    } catch {
      saved = null;
    }
    if (isChoice(saved)) setPreference(saved);
  }, []);

  return (
    <div className={styles.theme}>
      <Select
        id={id}
        label={themeLabel}
        options={themeOptions}
        value={preference}
        onChange={(event) => {
          const next = event.target.value as Preference;
          setPreference(next);
          applyPreference(next);
        }}
      />
    </div>
  );
}
