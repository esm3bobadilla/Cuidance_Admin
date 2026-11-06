# Prototype alignment, final batch: Content Metrics

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/content-metrics/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Content Metrics (attached Nov 6, 2026). The unreadable PDF supplied nothing.

## 1. What changed

The screen was structure-only. It now follows the hi-fi.

1. **Header:**
   - The eyebrow is "Internal tool".
   - The title and the approved scope note are unchanged: "A limited internal view of content activity. No analytics expansion."
2. **Date range:** "Last 90 days", shown as text.
3. **Totals:** Published content 156, In review 28, Needs changes 14, Sources reviewed 198. These are the existing MetricTile component, 4 across, 2 by 2 on phones.
4. **"Content by care area" chart: CSS only, no chart library or new dependency.**
   - Four bars per care area: Published, In review, Needs changes, Remaining (not published).
   - **Every bar shows its number**, so color is never the only signal.
   - There's a text legend, and the bars are hidden from screen readers. The chart region has a label pointing to the table, which holds the same values.
   - Remaining = total − published − in review − needs changes, which matches the hi-fi chart.
   - On narrow screens the chart scrolls inside its panel, like the tables.
5. **"Content details by care area" table:** the hi-fi's five care areas, with Total items, Published, In review and Needs changes.
6. **Banner** (hi-fi): "These are internal content-management metrics. They do not represent participant analytics, user behavior, outcomes, or performance claims."
7. **States:** loading (⋯ in the tiles plus a message), empty (0 plus Go to Dashboard), error (⚠ plus the Dark Ruby alert), with the banner shown in each. **No results** doesn't apply: there's no search or filter.

**Internal metrics only:** content counts by review status and care area. No participant analytics, behavior, outcomes or performance claims.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| **The hi-fi's totals don't match its table** | The In review tile says 28 but the table adds up to 34; Needs changes says 14 but the table adds up to 26. Published (156) matches. Both are shown as the hi-fi has them. **Team 03 to confirm** |
| **Filters not built** (Date range, Care area, Content type) | The hi-fi shows only one range ("Last 90 days", shown as text) and has no content-type breakdown |
| **Chart colors**: Published uses the brand token, In review the accent token, Needs changes the alert token, Remaining the strong border token | No data-visualization tokens are approved yet (open item). Numbers and the legend carry the meaning |
| Tile icons, decorative artwork | Not approved (D6, D16) |
| State wording | Empty and Loading are provisional on the board |

## 3. Files

- **New:**
  - `shared/content/content-metrics.ts`
  - `admin-web/app/_metrics/ContentMetricsView.tsx`, `StateFromUrl.tsx` and `metrics.module.css`
- **Updated:** `admin-web/app/content-metrics/page.tsx`.

## 4. Tests

| Check | Result |
| --- | --- |
| Screen tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** <ul><li>The four totals.</li><li>All 20 bar values (for example Hair care 45/10/8/17), bar heights to scale (45 of 60 = 75%), bars hidden from screen readers.</li><li>The legend, the table rows, both headings, the date range and the banner.</li><li>No filters or participant-analytics wording.</li><li>No em dashes, no overflow, no console errors.</li></ul> |
| States | Loading, empty and error in both builds and both themes (tiles ⋯, 0 or ⚠; the state panel; the banner kept) |
| Keyboard | The chart and table regions are focusable (they can scroll) with visible rings |
| No JavaScript | Table and all 20 bar values at 1440 and 320 px, no overflow |
| Contrast | At least 5.4:1 in light and 9.2:1 in dark |
| Hydration | No warnings |
| Final batch suite | TypeScript, production and GitHub Pages builds; full suite 352 loads, 0 problems; every earlier screen's tests; responsive and 44 px audit at 12 widths in both builds |

## 5. Screenshots

In `docs/Week-10/evidence/`:
- **Hi-fi beside this build:** `content-metrics-compare-hifi-1440-{light,dark}.png`
- **Full screen:** `content-metrics-aligned-{1440,834,390}-{light,dark}.png`
- **States:** `content-metrics-aligned-{loading,empty}-1440-light.png` and `content-metrics-aligned-error-1440-dark.png`
- **Keyboard:** `content-metrics-aligned-keyboard-dark.png`
