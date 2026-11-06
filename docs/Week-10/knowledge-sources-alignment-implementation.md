# Prototype alignment, completion sprint Batch 1: Knowledge Sources

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/content/knowledge-sources/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Knowledge Sources (attached Nov 6, 2026). The unreadable PDF supplied nothing.

## 1. What changed

The screen was structure-only. It now follows the hi-fi layout, built on the shared list-and-details pattern (`admin-web/app/_listDetail/`: layout styles, `StatusChip`, `NoResults`).

1. **Header:** the eyebrow is "Internal tool". The title and scope note are unchanged.
2. **Toolbar:** **Search sources**, with the hi-fi's placeholder. The hi-fi has no filter.
3. **List** "Knowledge sources (sample data)", with the hi-fi's columns Title, Source type, Content areas, Review status, Last reviewed, Owner. All eight hi-fi sources are included.
4. **Source details:**
   - The title and status.
   - Source type, Description, Content areas (tags), Review notes, Last reviewed, Owner.
5. **Statuses:** Published (success plus ✓), In review (neutral), Needs review (warning orange), Archived (neutral, dashed).

**Shared behavior:**
- The selected row has the approved Compass Blue treatment; the item title is a button that selects it (`aria-pressed`).
- A live count follows the list.
- The details panel sits beside the list from 1280 px and below it on smaller screens (D14).
- **States:** loading, empty and error (`?state=`), and no results with a Clear button. Without JavaScript the list and the first item's details show, and the toolbar is hidden.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| **Owner names replaced** by "Team member A" to "E" | The hi-fi's people names are sample people |
| **Details for seven of the eight sources** | The hi-fi shows details for one source only, so the others show "To be confirmed by Team 03." |
| **Not built:** Open source, Add source, the close (×) button | No source addresses and no create flow |
| "Partner disclosure document" carries no Partner label | It's a source document about partners, not partner content. Team 03 to confirm |
| Status color mapping (shared `StatusChip`) | No approved mapping. Every chip shows its text, and the success, error and Partner tones also show an approved symbol (✓, ⚠, ◆) |
| State wording, details position below 1280 px | Empty and Loading are provisional on the board; D14 |
| Hi-fi decorative artwork, icons, sidebar items and sort arrows | Not approved (D6, D16); the confirmed sidebar is kept; no sort flow |

## 3. Files

- **New:**
  - `shared/content/knowledge-sources.ts`
  - `admin-web/app/_sources/KnowledgeSourcesView.tsx` and `StateFromUrl.tsx`
- **Updated:** `admin-web/app/content/knowledge-sources/page.tsx`.

## 4. Tests

| Check | Result |
| --- | --- |
| Screen tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** 8 rows; the first source's description, review notes, content areas and owner; search "claims" shows 3; none of the hi-fi owner names, Open source or Add source. Selecting another item shows its details or "To be confirmed by Team 03.". No results, then Clear returns focus to the search field. No em dashes, no overflow, no console errors |
| States | Loading, empty and error (`?state=`) in both builds and both themes; empty links to Content |
| Keyboard | The search comes before the list; each item is a stop; Enter selects; visible rings on every stop |
| No JavaScript | All rows and the first item's details show at 1440 and 320 px; the toolbar is hidden; no overflow |
| Contrast | At least 4.8:1 in light and 8.2:1 in dark |
| Hydration | No warnings for the ready, loading, empty and error states |
| Batch 1 suite | TypeScript, production and GitHub Pages builds; full suite 352 loads, 0 problems; all earlier screen tests; responsive and 44 px audit at 12 widths in both builds |


## 5. Screenshots

In `docs/Week-10/evidence/`:
- **Hi-fi beside this build:** `knowledge-sources-compare-hifi-1440-{light,dark}.png`
- **Full screen:** `knowledge-sources-aligned-{1440,834,390}-{light,dark}.png`
- **No results:** `knowledge-sources-aligned-no-results-{desktop,mobile}.png`
- **States:** `knowledge-sources-aligned-{loading,empty}-1440-light.png` and `knowledge-sources-aligned-error-1440-dark.png`
- **Keyboard:** `knowledge-sources-aligned-keyboard-dark.png`
