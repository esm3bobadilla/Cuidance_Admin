import type { ButtonHTMLAttributes } from 'react';
import { CuIcon } from './CuIcon';
import styles from './Chip.module.css';

type ChipProps = {
  label: string;
  selected: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children' | 'aria-pressed'>;

// Filter chip: a toggle button. Selected shows Compass Blue plus a check mark (not color alone).
export function Chip({ label, selected, type = 'button', ...rest }: ChipProps) {
  return (
    <button type={type} className={styles.chip} aria-pressed={selected} {...rest}>
      {selected && <CuIcon name="check" size={14} />}
      {label}
    </button>
  );
}
