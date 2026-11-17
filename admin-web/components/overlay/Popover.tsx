'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './Popover.module.css';

type PopoverProps = {
  // Visible text of the button that opens it
  trigger: ReactNode;
  // Accessible name for the button when the trigger is icon-only
  triggerLabel?: string;
  // Names the panel for screen readers
  label: string;
  children: ReactNode;
  align?: 'start' | 'end';
};

// Small non-modal panel anchored to a button (help text, quick options).
// Escape or a click outside closes it and returns focus to the button.
export function Popover({ trigger, triggerLabel, label, children, align = 'start' }: PopoverProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrap}
      className={styles.wrap}
      // Closes when focus leaves the button and the panel
      onBlur={(event) => {
        if (!wrap.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        aria-label={triggerLabel}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </button>
      <div id={`${id}-panel`} role="region" aria-label={label} className={styles.panel} data-align={align} hidden={!open}>
        {children}
      </div>
    </div>
  );
}
