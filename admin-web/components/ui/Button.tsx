import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

// One primary button per screen. Other actions use secondary or ghost.
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

export function Button({ children, variant = 'secondary', type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]}`} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style' | 'href'>;

// Same look as Button, for actions that go to another page
export function ButtonLink({ children, href, variant = 'secondary', ...rest }: ButtonLinkProps) {
  return (
    <a href={href} className={`${styles.button} ${styles[variant]}`} {...rest}>
      {children}
    </a>
  );
}
