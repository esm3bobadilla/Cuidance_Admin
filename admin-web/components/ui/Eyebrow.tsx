import type { ReactNode } from 'react';
import styles from './Eyebrow.module.css';

type EyebrowProps = {
  children: ReactNode;
};

// Short category label above a title. Decorative, so it isn't a heading.
export function Eyebrow({ children }: EyebrowProps) {
  return <p className={styles.eyebrow}>{children}</p>;
}
