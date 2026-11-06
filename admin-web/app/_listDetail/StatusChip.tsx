import { uiSymbols } from '../../../shared/content/ui-symbols';
import styles from './listDetail.module.css';

// Shared status and label chips for the list-and-details screens.
// PROVISIONAL tone mapping (no approved status-to-token mapping yet). Text always shows,
// and every tone except neutral and draft also shows an approved symbol.
export type ChipTone = 'success' | 'neutral' | 'draft' | 'alert' | 'error' | 'partner';

const toneClass: Record<ChipTone, string> = {
  success: styles.chipSuccess,
  neutral: styles.chipNeutral,
  draft: styles.chipDraft,
  alert: styles.chipAlert,
  error: styles.chipError,
  partner: styles.chipPartner,
};

const toneSymbol: Partial<Record<ChipTone, string>> = {
  success: uiSymbols.selected,
  error: uiSymbols.error,
  partner: uiSymbols.partner,
};

export function StatusChip({ tone, children }: { tone: ChipTone; children: string }) {
  const symbol = toneSymbol[tone];
  return (
    <span className={`${styles.chip} ${toneClass[tone]}`}>
      {symbol && (
        <span className={styles.chipSymbol} aria-hidden="true">
          {symbol}
        </span>
      )}
      {children}
    </span>
  );
}
