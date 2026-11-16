'use client';

import { useSyncExternalStore } from 'react';
import {
  defaultDisplaySettings,
  displayAttributes,
  displayStorageKey,
  type DisplaySettings,
} from '../../../shared/content/display-settings';

/*
 * Display settings for the whole page (text size, density, contrast, motion, focus).
 * Applied before first paint by displayBootScript in the root layout; this store
 * keeps the Settings controls and <html> in step after that.
 */

const listeners = new Set<() => void>();
let current: DisplaySettings | null = null;

const readSaved = (): DisplaySettings => {
  try {
    const saved = JSON.parse(localStorage.getItem(displayStorageKey) ?? '{}') as Partial<DisplaySettings>;
    return { ...defaultDisplaySettings, ...saved };
  } catch {
    return defaultDisplaySettings;
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const get = () => (current ??= readSaved());

function apply(settings: DisplaySettings) {
  const root = document.documentElement;
  const set = (name: string, value: string | null) => (value ? root.setAttribute(name, value) : root.removeAttribute(name));
  set(displayAttributes.textSize, settings.textSize === 'default' ? null : settings.textSize);
  set(displayAttributes.density, settings.density === 'comfortable' ? null : settings.density);
  set(displayAttributes.contrast, settings.contrast === 'system' ? null : settings.contrast);
  set(displayAttributes.motion, settings.motion === 'system' ? null : settings.motion);
  set(displayAttributes.alwaysShowFocus, settings.alwaysShowFocus ? 'always' : null);
}

export function updateDisplaySettings(change: Partial<DisplaySettings>) {
  const next = { ...get(), ...change };
  apply(next);
  try {
    localStorage.setItem(displayStorageKey, JSON.stringify(next));
  } catch {
    // Storage can be blocked: the change still applies on this page
  }
  current = next;
  listeners.forEach((listener) => listener());
}

export function resetDisplaySettings() {
  apply(defaultDisplaySettings);
  try {
    localStorage.removeItem(displayStorageKey);
  } catch {
    // ignore
  }
  current = defaultDisplaySettings;
  listeners.forEach((listener) => listener());
}

export function useDisplaySettings(): DisplaySettings {
  return useSyncExternalStore(subscribe, get, () => defaultDisplaySettings);
}
