import type { InputHTMLAttributes } from 'react';
import { Field, describedBy } from './Field';
import styles from './control.module.css';

type SearchFieldProps = {
  id: string;
  // Visible label, per the board's "visible labels" rule
  label: string;
  helper?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'style' | 'type'>;

export function SearchField({ id, label, helper, disabled, ...rest }: SearchFieldProps) {
  return (
    <div role="search">
      <Field id={id} label={label} helper={helper} disabled={disabled}>
        <input
          id={id}
          type="search"
          className={styles.control}
          aria-describedby={describedBy(id, helper)}
          disabled={disabled}
          {...rest}
        />
      </Field>
    </div>
  );
}
