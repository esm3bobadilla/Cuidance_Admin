# Prototype alignment, Batch 2: Content landing page

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/content/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Source:** no hi-fi or prototype screen shows a Content landing page (C4 is still open). The page uses the approved Dashboard Key Areas panel pattern (Slice 2, following the prototype), with its existing wording and links.

## 1. What changed

1. **Header:** the eyebrow is "Internal tool", as on the hi-fi-aligned screens. The title and scope note are unchanged.
   - **Correction (completion Batch 2):** the "Structure only. Screen content and data are not built yet." note is removed. Every content page it links to now has a built screen. `ScreenPage` has a new `showStructureNote` option, used only here.
2. **Content pages:**
   - The separate cards with "Open …" buttons are now **one panel**, with the "CONTENT PAGES" label and **six link tiles**.
   - Each tile shows the page name and its existing scope note, plus ›. The whole tile is the link.
   - Three across from 1280 px, one column below.
   - The same six pages and links as before, including Commercial Content, whose route still exists (C7).
3. `ScreenPage` has a new `childLayout="panel"` option. Only the Content page uses it, so the other screens are unchanged.
4. **States:** the page has no data, so loading, empty, error and no-results don't apply. Without JavaScript, all six tiles show.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| Keeping a Content landing page at all | C4: no source shows one |
| The tile layout | No source for this page; it follows the approved Dashboard Key Areas panel |
| The "Open …" button wording is gone | The tile name is now the link, as on the Dashboard |
| Commercial Content tile | **C7 resolved (Nov 6, 2026): Commercial Content is approved** and keeps its tile. It stays out of the sidebar (confirmed destinations, D2) |

## 3. Files

- **New:** `admin-web/app/_screens/screenPanel.module.css`.
- **Updated:**
  - `admin-web/app/_screens/ScreenPage.tsx` (`childLayout`)
  - `admin-web/app/content/page.tsx`
  - `shared/content/admin-web-screens.ts` (the "Internal tool" eyebrow wording)

## 4. Tests

| Check | Result |
| --- | --- |
| Content tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** <ul><li>The six tiles with the right links, in order.</li><li>3 columns from 1280 px, 1 below.</li><li>Clicking a tile's corner opens the page.</li><li>No "Open …" buttons, no overflow, no em dashes, no console errors.</li></ul> |
| Keyboard | Each tile link is a stop with a visible ring around the whole tile |
| No JavaScript | Six tiles at 1440 and 320 px, no overflow |
| Contrast | At least 5.4:1 in light and 8.2:1 in dark |
| Hydration | No warnings |

## 5. Screenshots

In `docs/Week-10/evidence/`:
- **Full screen:** `content-aligned-{1440,834,390}-{light,dark}.png`
- **Keyboard:** `content-aligned-keyboard-dark.png`
