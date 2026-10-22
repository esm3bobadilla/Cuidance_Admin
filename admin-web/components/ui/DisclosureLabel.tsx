import styles from './DisclosureLabel.module.css';

// The board approves two disclosure labels: Partner and Sponsored.
type DisclosureLabelProps = {
  kind: 'partner' | 'sponsored';
};

const LABELS: Record<DisclosureLabelProps['kind'], string> = {
  partner: 'Partner content',
  sponsored: 'Sponsored',
};

// Commercial content is always labeled in words, never by color alone.
export function DisclosureLabel({ kind }: DisclosureLabelProps) {
  return (
    <span className={styles.label}>
      <span aria-hidden="true">◆</span>
      {LABELS[kind]}
    </span>
  );
}
