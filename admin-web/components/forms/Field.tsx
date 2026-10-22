import type { ReactNode } from 'react';
import styles from './Field.module.css';

type FieldProps = {
  id: string;
  // Always visible: never rely on placeholder text alone
  label: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  children: ReactNode;
};

// The error message replaces the helper text, as on the board.
export function describedBy(id: string, helper?: string, error?: string) {
  if (error) return `${id}-error`;
  if (helper) return `${id}-helper`;
  return undefined;
}

export function Field({ id, label, helper, error, disabled, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={disabled ? `${styles.label} ${styles.labelDisabled}` : styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          <span aria-hidden="true">⚠</span> {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className={styles.helper}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}
