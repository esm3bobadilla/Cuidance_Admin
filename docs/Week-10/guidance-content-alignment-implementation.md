# Prototype alignment, completion sprint Batch 1: Guidance Content

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/content/guidance-content/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Guidance Content (**A3**, attached Nov 6, 2026). The unreadable PDF supplied nothing.

## 1. What changed

The screen was structure-only. It now follows the hi-fi layout, built on the shared list-and-details pattern (`admin-web/app/_listDetail/`: layout styles, `StatusChip`, `NoResults`).

1. **Header:** the eyebrow is "Internal tool". The title and scope note are unchanged.
2. **Toolbar:**
   - **Search guidance content**, with A3's placeholder.
   - **Status**: All statuses, Published, In review, Draft.
3. **List** "Guidance content (sample data)", with A3's columns Title (with a one-line summary under it), Care area, Type, Status, Last updated. All eight A3 items are included.
4. **Guidance details:**
   - The status, title and summary.
   - Care area, Content type, Source, Review status (with "Last updated"), Evidence labels.
   - A Summary section.

**Shared behavior:**
- The selected row has the approved Compass Blue treatment; the item title is a button that selects it (`aria-pressed`).
- A live count follows the list.
- The details panel sits beside the list from 1280 px and below it on smaller screens (D14).
- **States:** loading, empty and error (`?state=`), and no results with a Clear button. Without JavaScript the list and the first item's details show, and the toolbar is hidden.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| **A3's source note and review line left out** ("Based on dermatology-reviewed educational resources and expert input…", "Reviewed by clinical content lead on Apr 10, 2024") | CLAUDE.md rules out medical-review and clinical sign-off workflows. "To be confirmed by Team 03." shows in their place |
| **Evidence labels: "To be confirmed by Team 03."** | Each guidance claim needs its evidence label (Strong, Moderate, Limited, Assumption); A3 doesn't show where |
| **Details for seven of the eight items** | A3 shows details for one item only, so the others show "To be confirmed by Team 03." |
| **Not built:** Add guidance, Edit, the row "…" menus | No create or edit flow |
| "Understanding sensitive skin" is "Published" here and "In review" on the Dashboard | Each follows its own source; the Dashboard is unchanged. Team 03 to confirm |
| Status color mapping (shared `StatusChip`) | No approved mapping. Every chip shows its text, and the success, error and Partner tones also show an approved symbol (✓, ⚠, ◆) |
| State wording, details position below 1280 px | Empty and Loading are provisional on the board; D14 |
| Hi-fi decorative artwork, icons, sidebar items and sort arrows | Not approved (D6, D16); the confirmed sidebar is kept; no sort flow |

## 3. Files

- **New:**
  - `shared/content/guidance-content.ts`
  - `admin-web/app/_guidance/GuidanceContentView.tsx` and `StateFromUrl.tsx`
  - The shared `admin-web/app/_listDetail/` (`StatusChip.tsx`, `NoResults.tsx`, `listDetail.module.css`)
- **Updated:** `admin-web/app/content/guidance-content/page.tsx`.

## 4. Tests

| Check | Result |
| --- | --- |
| Screen tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** 8 rows; the first item's details (editorial-team source, long summary, the evidence-labels placeholder); search "hair" shows 2; Status = Draft shows 2; none of A3's clinical-review wording, Add guidance or Edit. Selecting another item shows its details or "To be confirmed by Team 03.". No results, then Clear returns focus to the search field. No em dashes, no overflow, no console errors |
| States | Loading, empty and error (`?state=`) in both builds and both themes; empty links to Content |
| Keyboard | The search comes before the list; each item is a stop; Enter selects; visible rings on every stop |
| No JavaScript | All rows and the first item's details show at 1440 and 320 px; the toolbar is hidden; no overflow |
| Contrast | At least 4.8:1 in light and 7.3:1 in dark |
| Hydration | No warnings for the ready, loading, empty and error states |
| Batch 1 suite | TypeScript, production and GitHub Pages builds; full suite 352 loads, 0 problems; all earlier screen tests; responsive and 44 px audit at 12 widths in both builds |


## 5. Screenshots

In `docs/Week-10/evidence/`:
- **A3 beside this build:** `guidance-content-compare-hifi-1440-{light,dark}.png`
- **Full screen:** `guidance-content-aligned-{1440,834,390}-{light,dark}.png`
- **No results:** `guidance-content-aligned-no-results-{desktop,mobile}.png`
- **States:** `guidance-content-aligned-{loading,empty}-1440-light.png` and `guidance-content-aligned-error-1440-dark.png`
- **Keyboard:** `guidance-content-aligned-keyboard-dark.png`
