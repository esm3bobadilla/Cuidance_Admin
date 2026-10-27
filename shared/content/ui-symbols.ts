/*
 * Approved interface symbols (Week 8 design system board v04).
 *
 * Source: T03_W08_S03_Board_DesignSystem_Cuidance_v04_ART646, Core UI Components
 * ("? Help", "‹ Back", "◆ Partner content", "◆ Sponsored") and the State Key
 * ("□ Default", "◎ Focus", "✓ Selected", "⊘ Disabled", "⚠ Error", "✓ Success",
 * "◌ Empty", "⋯ Loading").
 *
 * These are text symbols, not icon artwork. Always show them with visible text, a
 * label or a message, and hide the symbol itself from screen readers (aria-hidden).
 * Don't add other symbols here without Team 03 approval.
 */

export const uiSymbols = {
  help: '?',
  back: '‹',
  selected: '✓',
  success: '✓',
  error: '⚠',
  partner: '◆',
  empty: '◌',
  loading: '⋯',
  focus: '◎',
  default: '□',
  disabled: '⊘',
} as const;

export type UiSymbol = keyof typeof uiSymbols;
