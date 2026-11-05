'use client';

import { useSyncExternalStore } from 'react';
import { themeStorageKey, type ThemePreference } from '../../../shared/content/theme';

/*
 * One shared Light / Dark / System preference for the whole page, so the Theme
 * menu and the profile menu's Appearance options always agree.
 *
 * The saved choice is applied before first paint by the script in the root
 * layout. During hydration both controls show System (the server value), then
 * switch to the saved choice. The colors are right the whole time.
 */

const listeners = new Set<() => void>();
let preference: ThemePreference | null = null;

const readSaved = (): ThemePreference => {
  try {
    const saved = localStorage.getItem(themeStorageKey);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getPreference = () => (preference ??= readSaved());

// Applies a choice to the page and remembers it on this device. System clears both.
export function setThemePreference(next: ThemePreference) {
  const root = document.documentElement;
  if (next === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', next);
  try {
    if (next === 'system') localStorage.removeItem(themeStorageKey);
    else localStorage.setItem(themeStorageKey, next);
  } catch {
    // Storage can be blocked (private modes): the choice still applies on this page
  }
  preference = next;
  listeners.forEach((listener) => listener());
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, getPreference, () => 'system');
}

const subscribeDevice = (listener: () => void) => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
};

// Whether the device itself is set to dark, for the "Follows your device (now …)" line
export function useDeviceIsDark(): boolean {
  return useSyncExternalStore(
    subscribeDevice,
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false,
  );
}
