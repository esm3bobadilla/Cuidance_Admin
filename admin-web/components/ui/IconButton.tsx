import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './IconButton.module.css';

type IconButtonProps = {
  // Visible icon or glyph; hidden from screen readers
  icon: ReactNode;
  // Required: every icon button needs an accessible name
  label: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children' | 'aria-label'>;

export function IconButton({ icon, label, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={styles.iconButton} aria-label={label} title={label} {...rest}>
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
