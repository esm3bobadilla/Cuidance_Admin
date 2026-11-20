'use client';

import { useId, type ReactNode } from 'react';
import { useNativeDialog } from '../ui/useNativeDialog';
import styles from './overlay.module.css';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  // Cancel first, then the one primary action
  actions: ReactNode;
  // alert: asks someone to confirm something that can't be undone easily
  tone?: 'default' | 'alert';
  // wide: a large view such as the full-size Live preview (Phase 2 PR 2)
  size?: 'default' | 'wide';
};

// Centered modal dialog. Same behavior as Drawer: focus is kept inside, Escape and the
// backdrop close it, and focus returns to the control that opened it.
export function Dialog({ open, onClose, title, children, actions, tone = 'default', size = 'default' }: DialogProps) {
  const ref = useNativeDialog(open, onClose);
  const id = useId();
  return (
    <dialog
      ref={ref}
      className={size === 'wide' ? `${styles.dialog} ${styles.dialogWide}` : styles.dialog}
      role={tone === 'alert' ? 'alertdialog' : undefined}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-body`}
    >
      {open && (
        <div className={styles.dialogFrame}>
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
          <div id={`${id}-body`} className={styles.dialogBody}>
            {children}
          </div>
          <div className={styles.actions}>{actions}</div>
        </div>
      )}
    </dialog>
  );
}
