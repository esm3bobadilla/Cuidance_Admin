import type { ReactNode } from 'react';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import styles from './StateMessage.module.css';

type StateMessageProps = {
  kind: 'loading' | 'empty' | 'error' | 'unavailable';
  title: string;
  body?: string;
  // An optional button or link (for example "Try again")
  action?: ReactNode;
  // Optional illustration for the empty state (decorative)
  image?: { src: string; width: number; height: number };
};

// Loading, empty, error and unavailable states (Phase 2 PR 1), with the approved Week 8
// symbols beside the message (⋯ loading, ◌ empty, ⚠ error). Loading is announced politely,
// errors as alerts. Empty and Loading stay PROVISIONAL until Team 03 confirms them.
export function StateMessage({ kind, title, body, action, image }: StateMessageProps) {
  const symbol = kind === 'loading' ? uiSymbols.loading : kind === 'error' ? uiSymbols.error : uiSymbols.empty;
  return (
    <div
      className={`${styles.panel} ${styles[kind]}`}
      role={kind === 'error' ? 'alert' : kind === 'loading' ? 'status' : undefined}
      aria-live={kind === 'loading' ? 'polite' : undefined}
    >
      {image ? (
        <img src={image.src} width={image.width} height={image.height} alt="" className={styles.image} />
      ) : (
        <span className={styles.symbol} aria-hidden="true">
          {symbol}
        </span>
      )}
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {body && <p className={styles.body}>{body}</p>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
}
