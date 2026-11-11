'use client';

import { useRef, type KeyboardEvent } from 'react';
import { themeSwitchCopy as copy, type ThemePreference } from '../../../shared/content/theme';
import symbolMark from '../../../shared/brand/logo/png/cuidance-logo-symbol-mark.png';
import styles from './ThemeSwitch.module.css';
import { setThemePreference, useThemePreference } from './themeStore';

const order: ThemePreference[] = ['light', 'dark', 'system'];

// Phase A1: icon-only Light, Dark and System controls in the header (replaces "Theme: Light").
// A radio group: one Tab stop, arrow keys, Home and End move and choose. Each control has an
// accessible name and a visible tooltip. The choice is saved on this device (themeStore).
// System shows the approved Cuidance symbol mark in one color (the current text color).
export function ThemeSwitch() {
  const preference = useThemePreference();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const choose = (index: number) => {
    const next = order[(index + order.length) % order.length];
    setThemePreference(next);
    refs.current[order.indexOf(next)]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: order.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      choose(moves[event.key]);
    }
  };

  return (
    <div role="radiogroup" aria-label={copy.groupLabel} className={styles.group}>
      {order.map((value, index) => {
        const checked = value === preference;
        return (
          <button
            key={value}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={copy.options[value].label}
            tabIndex={checked ? 0 : -1}
            className={styles.option}
            onClick={() => setThemePreference(value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {value === 'light' && <SunIcon />}
            {value === 'dark' && <MoonIcon />}
            {value === 'system' && (
              <span className={styles.mark} style={{ maskImage: `url(${symbolMark.src})`, WebkitMaskImage: `url(${symbolMark.src})` }} aria-hidden="true" />
            )}
            <span className={styles.tooltip} aria-hidden="true">
              {copy.options[value].tooltip}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SunIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
