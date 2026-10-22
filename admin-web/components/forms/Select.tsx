import type { SelectHTMLAttributes } from 'react';
import { Field, describedBy } from './Field';
import styles from './control.module.css';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id: string;
  label: string;
  options: SelectOption[];
  helper?: string;
  error?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className' | 'style' | 'children'>;

export function Select({ id, label, options, helper, error, disabled, ...rest }: SelectProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error} disabled={disabled}>
      <select
        id={id}
        className={error ? `${styles.control} ${styles.invalid}` : styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error)}
        disabled={disabled}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
