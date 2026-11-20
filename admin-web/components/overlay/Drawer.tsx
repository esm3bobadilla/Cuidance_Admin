'use client';

import { useId, type ReactNode } from 'react';
import { CuIcon } from '../ui/CuIcon';
import { useNativeDialog } from '../ui/useNativeDialog';
import styles from './overlay.module.css';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  // Small label above the title, e.g. the workspace the drawer belongs to
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  // Buttons pinned to the bottom (one primary at most)
  footer?: ReactNode;
  closeLabel?: string;
};

// Side drawer (approved prototype: filters, editors, "Assign a review task").
// A modal <dialog> on the right: focus stays inside, Escape or the backdrop closes it,
// and focus returns to the control that opened it.
export function Drawer({ open, onClose, title, eyebrow, description, children, footer, closeLabel = 'Close' }: DrawerProps) {
  const ref = useNativeDialog(open, onClose);
  const id = useId();
  return (
    <dialog ref={ref} className={styles.drawer} aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined}>
      {open && (
        <div className={styles.frame}>
          <header className={styles.header}>
            <div className={styles.heading}>
              {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
              <h2 id={`${id}-title`} className={styles.title}>
                {title}
              </h2>
              {description && (
                <p id={`${id}-description`} className={styles.description}>
                  {description}
                </p>
              )}
            </div>
            <button type="button" className={styles.close} aria-label={closeLabel} title={closeLabel} onClick={onClose}>
              <CuIcon name="close" size={18} />
            </button>
          </header>
          {/* Scrolls on its own, so it can take keyboard focus: arrow keys scroll even when the
              drawer holds only text (read-only details) */}
          <div className={styles.body} tabIndex={0} role="region" aria-labelledby={`${id}-title`}>
            {children}
          </div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
