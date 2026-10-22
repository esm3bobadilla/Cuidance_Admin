import type { TextareaHTMLAttributes } from 'react';
import { Field, describedBy } from './Field';
import styles from './control.module.css';

type TextareaProps = {
  id: string;
  label: string;
  helper?: string;
  error?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className' | 'style'>;

export function Textarea({ id, label, helper, error, disabled, rows = 4, ...rest }: TextareaProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error} disabled={disabled}>
      <textarea
        id={id}
        rows={rows}
        className={error ? `${styles.control} ${styles.invalid}` : styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error)}
        disabled={disabled}
        {...rest}
      />
    </Field>
  );
}
