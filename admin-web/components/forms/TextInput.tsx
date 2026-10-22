import type { InputHTMLAttributes } from 'react';
import { Field, describedBy } from './Field';
import styles from './control.module.css';

type TextInputProps = {
  id: string;
  label: string;
  helper?: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'style'>;

export function TextInput({ id, label, helper, error, disabled, type = 'text', ...rest }: TextInputProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error} disabled={disabled}>
      <input
        id={id}
        type={type}
        className={error ? `${styles.control} ${styles.invalid}` : styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error)}
        disabled={disabled}
        {...rest}
      />
    </Field>
  );
}
