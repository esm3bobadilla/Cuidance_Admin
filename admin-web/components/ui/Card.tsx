import type { ReactNode } from 'react';
import styles from './Card.module.css';

type CardProps = {
  children: ReactNode;
  // Optional section title; rendered as a heading at the given level
  title?: string;
  headingLevel?: 2 | 3 | 4;
  as?: 'section' | 'div' | 'article' | 'li';
};

// Card and Panel are the same pattern: a bordered surface for grouped content.
export function Card({ children, title, headingLevel = 2, as: Tag = 'section' }: CardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Tag className={styles.card}>
      {title && <Heading className={styles.title}>{title}</Heading>}
      {children}
    </Tag>
  );
}
