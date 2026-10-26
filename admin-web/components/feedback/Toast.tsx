import styles from './Toast.module.css';

type ToastProps = {
  tone: 'success' | 'error';
  message: string;
  action?: {
    label: string;
    // Leave out when there's no real route yet; the label then shows as plain text
    href?: string;
  };
};

// Static message only. Positioning, timing and overlay behavior are not built yet.
export function Toast({ tone, message, action }: ToastProps) {
  return (
    <div className={`${styles.toast} ${styles[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      <span className={styles.icon} aria-hidden="true">
        {tone === 'success' ? '✓' : '⚠'}
      </span>
      <p className={styles.message}>{message}</p>
      {action?.href && (
        <a className={styles.action} href={action.href}>
          {action.label}
        </a>
      )}
      {action && !action.href && <span className={styles.actionStatic}>{action.label}</span>}
    </div>
  );
}
