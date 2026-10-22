import styles from './MetricTile.module.css';

type MetricTileProps = {
  label: string;
  value: string;
  // Short supporting note, for example "in the last 30 days"
  note?: string;
};

// Number only for now: sparklines wait on data-visualization tokens.
export function MetricTile({ label, value, note }: MetricTileProps) {
  return (
    <div className={styles.tile}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
