# Prototype alignment, completion sprint Batch 1: Partner Highlights

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/content/partner-highlights/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Partner Highlights (attached Nov 6, 2026). The unreadable PDF supplied nothing.

## 1. What changed

The screen was structure-only. It now follows the hi-fi layout, built on the shared list-and-details pattern (`admin-web/app/_listDetail/`: layout styles, `StatusChip`, `NoResults`).

1. **Header:** the eyebrow is "Internal tool". The title and scope note are unchanged ("Partner content, always labeled \"Partner\" and kept separate from guidance.").
2. **Separation banner** from the hi-fi: "Partner content must remain visibly separate from neutral guidance. Use clear labels (Partner content or Sponsored) and follow placement and disclosure guidelines." It has a Byzantium Plum edge.
3. **Toolbar:** **Search partner content**. The hi-fi's search sits in its top bar, so it's placed above the list here.
4. **List** "Partner highlights (sample data)", with the hi-fi's columns Content title, Partner, Placement, Disclosure type, Review status, Last updated.
   - **Every item shows its "Partner content" or "Sponsored" label**: Byzantium Plum, ◆ and text (CLAUDE.md).
5. **Partner content details:**
   - The title, label and status.
   - Partner, Placement, Disclosure type, Source / approval, Last updated.
   - A **Content preview** in its own plum panel with the Partner label, so it stays visibly separate from neutral guidance.

**Shared behavior:**
- The selected row has the approved Compass Blue treatment; the item title is a button that selects it (`aria-pressed`).
- A live count follows the list.
- The details panel sits beside the list from 1280 px and below it on smaller screens (D14).
- **States:** loading, empty and error (`?state=`), and no results with a Clear button. Without JavaScript the list and the first item's details show, and the toolbar is hidden.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| **Partner brand names replaced** by "Partner A" to "D" (Willow & Sage, Luma Care, Rivermere, Orchard Health) | CLAUDE.md allows no real brand names; same decision as Product Information's Brand A to D |
| **Editor name replaced** by "Team member A" | Placeholder |
| **Thumbnails and the preview image not built** | No approved artwork |
| **Not built:** Add partner content, Edit content, View full content, row "…" menus, pagination arrows, the banner's info icon | No create, edit or publishing flow; no approved icon |
| **Details for four of the five items** | The hi-fi shows details for one item only, so the others show "To be confirmed by Team 03." |
| The preview's "may be right for you" wording is kept | It's partner content shown under the Partner label, not Cuidance guidance. Team 03 to confirm |
| Status color mapping (shared `StatusChip`) | No approved mapping. Every chip shows its text, and the success, error and Partner tones also show an approved symbol (✓, ⚠, ◆) |
| State wording, details position below 1280 px | Empty and Loading are provisional on the board; D14 |
| Hi-fi decorative artwork, icons, sidebar items and sort arrows | Not approved (D6, D16); the confirmed sidebar is kept; no sort flow |

## 3. Files

- **New:**
  - `shared/content/partner-highlights.ts`
  - `admin-web/app/_partners/PartnerHighlightsView.tsx` and `StateFromUrl.tsx`
- **Updated:** `admin-web/app/content/partner-highlights/page.tsx`.

## 4. Tests

| Check | Result |
| --- | --- |
| Screen tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** 5 rows, each with its plum Partner or Sponsored label and ◆; the banner; the first item's details and plum preview; search "sponsored" shows 2; none of the hi-fi brand names, the editor name, or Add, Edit or View full content. Selecting another item shows its details or "To be confirmed by Team 03.". No results, then Clear returns focus to the search field. No em dashes, no overflow, no console errors |
| States | Loading, empty and error (`?state=`) in both builds and both themes; empty links to Content |
| Keyboard | The search comes before the list; each item is a stop; Enter selects; visible rings on every stop |
| No JavaScript | All rows and the first item's details show at 1440 and 320 px; the toolbar is hidden; no overflow |
| Contrast | At least 4.8:1 in light and 7.5:1 in dark |
| Hydration | No warnings for the ready, loading, empty and error states |
| Batch 1 suite | TypeScript, production and GitHub Pages builds; full suite 352 loads, 0 problems; all earlier screen tests; responsive and 44 px audit at 12 widths in both builds |


## 5. Screenshots

In `docs/Week-10/evidence/`:
- **Hi-fi beside this build:** `partner-highlights-compare-hifi-1440-{light,dark}.png`
- **Full screen:** `partner-highlights-aligned-{1440,834,390}-{light,dark}.png`
- **No results:** `partner-highlights-aligned-no-results-{desktop,mobile}.png`
- **States:** `partner-highlights-aligned-{loading,empty}-1440-light.png` and `partner-highlights-aligned-error-1440-dark.png`
- **Keyboard:** `partner-highlights-aligned-keyboard-dark.png`
