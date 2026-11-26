import type { CuIconName } from '../../../shared/brand/icons/cu-icons';
import { CuIcon } from './CuIcon';
import styles from './StatusBadge.module.css';

export type StatusTone = 'neutral' | 'info' | 'alert' | 'error' | 'success' | 'muted';

// Workflow status label (Phase 2 PR 1: Product Library, Email, Live). Text plus an icon,
// with a semantic surface and border: never color alone. Same look as the review labels.
// icon is optional only for the Live preview label, whose signal moved to the page header
// (Visual Package 01). Every other status label keeps its icon beside the text.
export function StatusBadge({ label, tone, icon }: { label: string; tone: StatusTone; icon?: CuIconName }) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          <CuIcon name={icon} size={14} />
        </span>
      )}
      {label}
    </span>
  );
}
