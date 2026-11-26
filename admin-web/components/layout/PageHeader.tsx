import type { ReactNode } from 'react';
import { Eyebrow } from '../ui/Eyebrow';
import styles from './PageHeader.module.css';

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  // Page actions. Keep to one primary button per screen.
  actions?: ReactNode;
  // Optional decorative mark in the upper-right, beside the title (never wraps below it)
  mark?: ReactNode;
};

// The breadcrumb is in the shared top bar (TopBar.tsx), not here.
export function PageHeader({ title, eyebrow, description, actions, mark }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={mark ? `${styles.row} ${styles.rowWithMark}` : styles.row}>
        <div className={styles.text}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
        {mark && (
          <div className={styles.mark} aria-hidden="true">
            {mark}
          </div>
        )}
      </div>
    </header>
  );
}
