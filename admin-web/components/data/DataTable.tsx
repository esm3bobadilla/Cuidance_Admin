import type { ReactNode } from 'react';
import styles from './DataTable.module.css';

type Column = {
  key: string;
  header: string;
  align?: 'start' | 'end';
};

type Row = {
  id: string;
  cells: Record<string, ReactNode>;
};

type DataTableProps = {
  // Describes the table for screen readers; shown above the table
  caption: string;
  columns: Column[];
  rows: Row[];
  // Selected row: Compass Blue surface plus a 2 px outline and a text marker
  selectedRowId?: string;
  // Inside a panel that already has its own border (for example the Dashboard panels)
  flush?: boolean;
  // Tighter horizontal cell padding (12 px) for wide tables beside a details panel
  compact?: boolean;
};

// Structure only: status color mappings are not part of this component yet.
export function DataTable({ caption, columns, rows, selectedRowId, flush = false, compact = false }: DataTableProps) {
  return (
    // Controlled horizontal scroll on narrow screens (board responsive rule)
    <div className={flush ? `${styles.scroll} ${styles.flush}` : styles.scroll} role="region" aria-label={caption} tabIndex={0}>
      <table className={compact ? `${styles.table} ${styles.compact}` : styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.align === 'end' ? `${styles.header} ${styles.end}` : styles.header}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const selected = row.id === selectedRowId;
            return (
              <tr
                key={row.id}
                className={selected ? `${styles.row} ${styles.selected}` : styles.row}
              >
                {columns.map((column, index) => (
                  <td key={column.key} className={column.align === 'end' ? `${styles.cell} ${styles.end}` : styles.cell}>
                    {index === 0 && selected && <span className={styles.visuallyHidden}>Selected: </span>}
                    {row.cells[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
