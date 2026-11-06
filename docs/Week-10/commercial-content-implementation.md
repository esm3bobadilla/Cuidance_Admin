# Completion sprint Batch 2: Commercial Content

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/content/commercial-content/` (unchanged)
- **Decision:** **C7 resolved: Commercial Content is approved by Team 03** (Nov 6, 2026).
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.**
- **Source:** **no hi-fi exists for this screen, so THE LAYOUT IS PROVISIONAL.** It isn't final visual approval. It reuses the approved list-and-details pattern from the hi-fi-aligned content screens. The unreadable PDF supplied nothing.

## 1. What it shows

**Nothing is invented.** The list is every commercially labeled item that already exists in approved sample data:
- the five **Partner Highlights** items (hi-fi): three "Partner content" and two "Sponsored";
- the **Product Information** product with the "Partner content" disclosure (hi-fi A4): Lightweight moisturizer.

The data is built from those two files (`shared/content/commercial-content.ts`), so the screens can't drift apart.

1. **Header:** the eyebrow is "Internal tool". The title and the approved scope note are unchanged: "Commercial labels and disclosures (Partner, Sponsored), kept separate from guidance."
2. **Rule banner** (Byzantium Plum edge). Approved wording only:
   - "Partner content must remain visibly separate from neutral guidance." (Partner Highlights hi-fi)
   - "Commercial content must be clearly labeled and kept separate from guidance." (CLAUDE.md)
   - "Use clear labels (Partner content or Sponsored) and follow placement and disclosure guidelines." (Partner Highlights hi-fi)
3. **Toolbar:** **Search commercial content**, and a **Label** filter (All labels, Partner content, Sponsored).
4. **List** "Commercially labeled content (sample data)", with the columns Content title, Label, Appears on, Disclosure, Status, Last updated.
   - **Every row's label** is Byzantium Plum, ◆ and the text "Partner content" or "Sponsored".
   - Statuses keep the names used on their own screens: Approved, In review and Draft from Partner Highlights, and Complete from Product Information.
5. **Commercial details:**
   - The title and label.
   - **Appears on**, with a **"Go to Partner Highlights"** or **"Go to Product Information"** link to the existing route.
   - Partner and Placement, where the source has them.
   - Disclosure.
   - **Disclosure wording: "To be confirmed by Team 03."** No source supplies it.
   - The status (named as on its own screen) and Last updated.
6. **States:** loading, empty and error (`?state=`), and no results with **Clear search and filter**. Without JavaScript the full list and the first item's details show, and the toolbar is hidden.

**Commercial stays separate from guidance:**
- Every item is labeled.
- The banner states the rule.
- The screen lists only commercial items; neutral guidance never appears in it.
- Disclosure requirements are shown for every item, and missing disclosure wording is marked rather than written.

**Not built** (no approved flow): create, edit, publish, approve, or change labels or disclosures.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| **The whole layout** | No hi-fi; it reuses the approved list-and-details pattern |
| **Content: an overview of existing commercially labeled items** | It's the only approved data. A dedicated commercial content set, if Team 03 wants one, needs its own source |
| **Disclosure wording "To be confirmed by Team 03."** | No source supplies it |
| **"Commercial" as a label** | No item in the approved data uses it; the approved labels are "Partner content" and "Sponsored" |
| **Partner and brand names: Partner A to D, Brand B** | The earlier placeholder decisions |
| **Sidebar** | Commercial Content stays out of the sidebar. The confirmed destinations are kept (D2), and it's reached from its Content landing tile. Team 03 to confirm whether it should join the sidebar |
| **At 1280 px the table scrolls 13 px inside its panel** | It fits from 1366 px |
| Status color mapping, state wording, details position below 1280 px | As on the other screens (shared `StatusChip`; D14) |

## 3. Files

- **New:**
  - `shared/content/commercial-content.ts`
  - `admin-web/app/_commercial/CommercialContentView.tsx` and `StateFromUrl.tsx`
- **Updated:** `admin-web/app/content/commercial-content/page.tsx`.
- **Uses:** the shared `admin-web/app/_listDetail/`.

## 4. Tests

| Check | Result |
| --- | --- |
| Screen tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** <ul><li>6 rows, each with a plum label and ◆; the banner.</li><li>The first item's details, with "Go to Partner Highlights" and "Disclosure wording: To be confirmed by Team 03."</li><li>Selecting an item shows its details.</li><li>Search "product information" shows 2; Label = Sponsored shows 2.</li><li>No results, then Clear returns focus to the search field.</li><li>No brand names; no Publish, Approve, Edit or Add.</li><li>No em dashes, no overflow, no console errors.</li></ul> |
| Links | "Go to Partner Highlights" and "Go to Product Information" land on those screens, in both builds |
| States | Loading, empty and error in both builds and both themes |
| Keyboard | Search, the Label filter, then the list; Enter selects; visible rings |
| No JavaScript | 6 rows and the first details at 1440 and 320 px; the toolbar hidden; no overflow |
| Contrast | At least 4.8:1 in light and 7.5:1 in dark |
| Hydration | No warnings for the ready, loading, empty and error states |

## 5. Screenshots

In `docs/Week-10/evidence/`:
- **Full screen:** `commercial-content-aligned-{1440,834,390}-{light,dark}.png`
- **The Product Information item:** `commercial-content-product-item-1440-light.png`
- **No results:** `commercial-content-aligned-no-results-{desktop,mobile}.png`
- **States:** `commercial-content-aligned-{loading,empty}-1440-light.png` and `commercial-content-aligned-error-1440-dark.png`
- **Keyboard:** `commercial-content-aligned-keyboard-dark.png`
