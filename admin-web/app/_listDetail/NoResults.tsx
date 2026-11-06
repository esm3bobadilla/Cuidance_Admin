'use client';

import { uiSymbols } from '../../../shared/content/ui-symbols';
import { Button } from '../../components/ui/Button';
import styles from './listDetail.module.css';

// No results for the current search or filter: ◌, a message and one next step.
// The Clear button goes away once used, so focus returns to the search field.
export function NoResults({ message, clearLabel, onClear, searchId }: { message: string; clearLabel: string; onClear: () => void; searchId: string }) {
  return (
    <div className={styles.noResults}>
      <p className={styles.noResultsMessage}>
        <span className={styles.noResultsSymbol} aria-hidden="true">
          {uiSymbols.empty}
        </span>
        {message}
      </p>
      <div>
        <Button
          variant="secondary"
          onClick={() => {
            onClear();
            document.getElementById(searchId)?.focus();
          }}
        >
          {clearLabel}
        </Button>
      </div>
    </div>
  );
}
