import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

type BaseProps = {
  id: string;
  label: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'style' | 'type' | 'defaultChecked' | 'checked'>;

// Consent checkboxes always start unchecked, so they can't take a starting value.
type CheckboxProps = BaseProps &
  ({ consent: true; defaultChecked?: never } | { consent?: false; defaultChecked?: boolean });

export function Checkbox({ id, label, error, disabled, consent, defaultChecked, ...rest }: CheckboxProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <input
          id={id}
          type="checkbox"
          className={error ? `${styles.box} ${styles.invalid}` : styles.box}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          disabled={disabled}
          defaultChecked={consent ? false : defaultChecked}
          {...rest}
        />
        <label htmlFor={id} className={disabled ? `${styles.label} ${styles.labelDisabled}` : styles.label}>
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
