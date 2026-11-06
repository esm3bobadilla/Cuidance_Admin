# Prototype alignment, Slice 4: Product Information

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/content/product-information/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Product Information (**A4**). The unreadable PDF supplied nothing.
- **Scope:** Product Information only. Other content screens are unchanged.

## 1. What changed

The screen was structure-only. It now follows A4's layout.

1. **Header:**
   - The eyebrow is **"Internal tool"**, as in A4.
   - The title and the approved scope note are **unchanged**: "Product types for Barcode / Label Lookup. Product lookup only. Availability and retailer information are future scope (VERIFY)."
   - The breadcrumb is in the shared top bar (Admin / Content / Product Information).
2. **Sample-data note**, the same wording as the other built screens.
3. **Toolbar:**
   - **Search products**: a visible label and A4's placeholder, "Search products, brands, or keywords…".
   - It matches the product name, brand, category, disclosure and both statuses.
   - A4 has no filter, so none is added.
4. **Product list:**
   - A table captioned "Product information (sample data)", with A4's columns: Product name, Brand, Category, Information status, Source status, Disclosure, Last updated.
   - The selected row has the approved Compass Blue selected treatment. The product name is a button that selects the row (`aria-pressed`).
   - A live count follows the list, for example "1–4 of 4 products".
5. **Product details panel**, with A4's sections in A4's order:
   - The "Product details" label, the product name as the heading, and the brand plus a category tag.
   - **Disclosure** box:
     - Educational information: A4's wording, on a quiet surface.
     - **Partner content: Byzantium Plum, ◆ and the "Partner content" label** (CLAUDE.md: Partner content is always labeled).
   - **Ingredient notes**, **Educational description**, **Source reference** (the title and "Accessed …").
   - **Information status** and **Source status** side by side, each with its "Last updated" or "Last reviewed" line. They stack on phones.
   - From 1280 px the panel sits beside the list. Below that it sits under the list.

**Statuses** (PROVISIONAL mapping, text always shown):
- Complete and Reviewed: success colors plus ✓.
- Needs update: warning orange (alert tokens).
- In review: neutral.
- Partner content: Plum plus ◆.

**Shared table:** `DataTable` has a new `compact` option, with 12 px side padding in place of 16. It's used only here, so this 7-column table fits beside the details panel at 1440 px. Every other table looks the same as before.

## 2. States

| State | What shows | How to preview |
| --- | --- | --- |
| Ready | Search, list, details | Default, including without JavaScript |
| Loading | ⋯ "Loading product information…" (`role="status"`); search disabled | `?state=loading` |
| Empty | ◌ "No product information yet." plus **Go to Content** | `?state=empty` |
| Error | Dark Ruby ⚠ "Couldn't load product information. Check your connection, then reload the page." (`role="alert"`) | `?state=error` |
| **No results** | ◌ "No products match your search." plus **Clear search**, which returns focus to the search field. The count reads "0 of 4 products" | Type a search with no matches |

All state wording is **PROVISIONAL**.

**Without JavaScript:** the list and the first product's details show. The search is hidden, because it can't work.

## 3. Sample data and PROVISIONAL items

**Sample rows:**
- All four come from A4: product name, category, both statuses, disclosure and date as shown.
- The first product's notes, description, source reference and review dates come from A4's details panel.
- The wording and data are in `shared/content/product-information.ts`.

| Item | Why |
| --- | --- |
| **Brand names replaced by "Brand A" to "Brand D"** | CLAUDE.md allows no real brand names, and A4's brands can't be confirmed as invented. Team 03 to confirm or supply approved invented names |
| **Editor names replaced by "Team member A/B"** | Placeholders, as on the Dashboard and Quiz Content |
| **A4's second educational-description sentence left out** ("A good option for those looking for a gentle, non-drying cleanse.") | It reads as a recommendation. The copy rules use "may fit", and Admin Web makes no recommendations. Team 03 to confirm |
| **Details for three of the four products show "To be confirmed by Team 03."** | A4 shows details for the selected product only. Nothing is invented |
| **Partner disclosure wording: "Partner disclosure wording to be confirmed by Team 03."** | A4 shows no Partner disclosure text. The Partner label and Plum treatment are in place |
| **Source reference is text, not a link** | A4's link has no address. External links are deferred |
| **Not built:** "Add product information", Edit, the close (×) button, sortable column headers, the radio-button selection column | No create, edit or sort flow is defined. The product name selects the row instead of a radio button |
| **Not built:** the disclosure info icon, the leaf illustration and decorative artwork | No approved icons or artwork (D6, D16) |
| **Name** | The screen keeps the approved name "Product Information". A4's sidebar items (Articles, Topics, Collections, Users, Analytics) aren't used; the confirmed sidebar is kept (D8) |
| **At 1280 to 1439 px the table scrolls up to 79 px inside its panel** | Seven columns plus the details panel need more width than our approved 64 px margins and 16 px card padding leave. It fits from 1440 px; below 1280 px the details move under the list (D14) |
| Status color mapping, state wording | No approved mapping; Empty and Loading are provisional on the board |
| Product availability and retailer information | Not built (VERIFY, CLAUDE.md) |

## 4. Files

| File | Change |
| --- | --- |
| `shared/content/product-information.ts` | New: screen wording and the A4 sample data |
| `admin-web/app/_product/ProductInformationView.tsx` | New: search, list, selection, details and states |
| `admin-web/app/_product/ProductStateFromUrl.tsx` | New: `?state=` preview |
| `admin-web/app/_product/product.module.css` | New. Tokens only |
| `admin-web/app/content/product-information/page.tsx` | Uses the new view in place of the structure-only note |
| `admin-web/components/data/DataTable.tsx`, `.module.css` | New `compact` option |

**Unchanged:** routes, links, navigation, tokens, assets, dependencies and the other content screens.

## 5. Test results

| Check | Result |
| --- | --- |
| TypeScript, production build, GitHub Pages build | All passed |
| Full browser suite | **352 loads, 0 problems** |
| Product Information tests | **0 failures.** In both builds, at 1440, 834, 390 and 320 px, in light and dark: <ul><li>4 rows, the first selected, and every A4 details section with its wording.</li><li>The Partner row shows ◆ and its label; choosing it shows the Plum disclosure and "To be confirmed" in place of notes.</li><li>Search by category ("makeup") and brand ("brand c").</li><li>No results, then Clear returns focus to the search field.</li><li>The scope note keeps "(VERIFY)".</li><li>No A4 brand names, no "good option", "best", "perfect" or "guaranteed", no em dashes, no overflow, no console errors.</li></ul> |
| Preview states | Loading, empty and error in both builds and both themes |
| Keyboard | Order: Search, the table, then each product. Enter selects; a visible ring on every stop |
| No JavaScript | At 1440 and 320 px: 4 rows and the first details shown, the search hidden, no overflow |
| Theme tests; Quiz Content tests (after the shared table change) | 0 failures each |
| Responsive audit | 12 widths from 1440 to 320 px, both builds: no sideways page scrolling, nothing spilling out of its box, no target under 44 px |
| Contrast | Every Product Information text at least 4.8:1 in light and 7.5:1 in dark |
| Hydration | No warnings for the ready, loading, empty and error states |

## 6. Screenshots

In `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `product-information-compare-a4-1440-light.png`, `product-information-compare-a4-1440-dark.png` | A4 beside this screen |
| `product-information-aligned-{1440,834,390}-{light,dark}.png` | This screen, full page |
| `product-information-partner-1440-light.png` | The Partner product selected |
| `product-information-no-results-desktop.png`, `product-information-no-results-mobile.png` | No results |
| `product-information-loading-1440-light.png`, `product-information-empty-1440-light.png`, `product-information-error-1440-dark.png` | Preview states |
| `product-information-keyboard-dark.png` | A product selected from the keyboard |
