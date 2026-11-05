'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  themeMenuCopy as copy,
  themeOptions,
  themeStorageKey,
  type ThemePreference,
} from '../../../shared/content/theme';
import { Button } from '../ui/Button';
import styles from './ThemeMenu.module.css';

const isChoice = (value: string | null): value is 'light' | 'dark' => value === 'light' || value === 'dark';

// Applies a choice to the page and remembers it on this device. System clears both.
function applyPreference(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', preference);
  try {
    if (preference === 'system') localStorage.removeItem(themeStorageKey);
    else localStorage.setItem(themeStorageKey, preference);
  } catch {
    // Storage can be blocked (private modes): the choice still applies on this page
  }
}

// Light / Dark / System menu beside the profile area. System is the default.
// The saved choice is applied before first paint by the script in the root layout;
// this control shows it once the page has loaded.
export function ThemeMenu({ id }: { id: string }) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [deviceIsDark, setDeviceIsDark] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(themeStorageKey);
    } catch {
      saved = null;
    }
    if (isChoice(saved)) setPreference(saved);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setDeviceIsDark(media.matches);
    const onChange = (event: MediaQueryListEvent) => setDeviceIsDark(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const items = () => [...(wrapRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])];

  // Opening moves focus to the current choice; a click outside closes the menu
  useEffect(() => {
    if (!open) return;
    (items().find((item) => item.getAttribute('aria-checked') === 'true') ?? items()[0])?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) document.getElementById(buttonId)?.focus();
  };

  const choose = (next: ThemePreference) => {
    setPreference(next);
    applyPreference(next);
    close(true);
  };

  const onMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const move = (to: number) => {
      event.preventDefault();
      list[(to + list.length) % list.length]?.focus();
    };
    if (event.key === 'ArrowDown') move(index + 1);
    else if (event.key === 'ArrowUp') move(index - 1);
    else if (event.key === 'Home') move(0);
    else if (event.key === 'End') move(list.length - 1);
    else if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Tab') close(false);
  };

  const current = themeOptions.find((option) => option.value === preference) ?? themeOptions[2];

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <Button
        id={buttonId}
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        data-preference={preference}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {copy.buttonLabel(current.label)}
      </Button>

      <div className={styles.panel} hidden={!open} onKeyDown={onMenuKey}>
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
                onClick={() => choose(option.value)}
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
      </div>
    </div>
  );
}
