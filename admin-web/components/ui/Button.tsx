import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  // One primary button per screen. Other actions use secondary or ghost.
  variant?: 'primary' | 'secondary' | 'ghost';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

export function Button({ children, variant = 'secondary', type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]}`} {...rest}>
      {children}
    </button>
  );
}
