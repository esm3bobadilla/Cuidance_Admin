import { useId } from 'react';
import styles from './Toggle.module.css';

type ToggleProps = {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  // Words shown inside the track, so the state never relies on color
  onText?: string;
  offText?: string;
};

// On / off switch (role="switch"). The whole row is the 44 px target.
export function Toggle({ label, hint, checked, onChange, disabled, onText = 'On', offText = 'Off' }: ToggleProps) {
  const id = useId();
  return (
    <div className={styles.row}>
      <span className={styles.text}>
        <span id={`${id}-label`} className={styles.label}>
          {label}
        </span>
        {hint && (
          <span id={`${id}-hint`} className={styles.hint}>
            {hint}
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        disabled={disabled}
        className={styles.switch}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.state} aria-hidden="true">
          {checked ? onText : offText}
        </span>
        <span className={styles.thumb} aria-hidden="true" />
      </button>
    </div>
  );
}
