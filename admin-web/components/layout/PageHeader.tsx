import type { ReactNode } from 'react';
import { Eyebrow } from '../ui/Eyebrow';
import styles from './PageHeader.module.css';

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  // Breadcrumb or back link shown above the title
  wayfinding?: ReactNode;
  // Page actions. Keep to one primary button per screen.
  actions?: ReactNode;
};

export function PageHeader({ title, eyebrow, description, wayfinding, actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {wayfinding}
      <div className={styles.row}>
        <div className={styles.text}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}
