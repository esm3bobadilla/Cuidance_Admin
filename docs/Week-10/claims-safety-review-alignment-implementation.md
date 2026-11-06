# Prototype alignment, Slice 5: Claims & Safety Review

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/claims-safety-review/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Claims & Safety Review (**A5**). The unreadable PDF supplied nothing.
- **Scope:** Claims & Safety Review only. Guidance Content and the other screens are unchanged.

## 1. What changed

The screen was structure-only. It now follows A5's layout.

1. **Header:**
   - The eyebrow is **"Internal tool"**, as in A5.
   - The title and the approved scope note are **unchanged**: "… The emergency line stays on every result. No diagnosis or medical review."
   - The breadcrumb is in the shared top bar (Admin / Claims & Safety Review).
2. **Sample-data note**, the same wording as the other built screens.
3. **Tabs: Review Queue, Approved, Needs Changes, All Items.**
   - They're real tabs (`role="tablist"`): one Tab stop, and the arrow keys, Home and End move between them.
   - The selected tab has Compass Blue text, an underline and heavier text.
   - They switch the table and details below.
4. **Filters:**
   - **Content area**: All content areas, or one of the seven areas in the sample data.
   - **Search items**: a visible label and A5's placeholder. It matches the item, content area, review type, status, priority and reviewer.
   - The tabs, filter and search work together.
5. **Review table:**
   - Captioned "Claims and safety review items (sample data)", with A5's columns: Item, Content area, Review type, Status, Priority, Assigned reviewer, Last updated.
   - "Last updated" shows the date, with the time below it.
   - The selected row has the approved Compass Blue selected treatment. The item text is a button that selects the row.
   - A live count follows the table.
6. **Review details panel:**
   - "REVIEW DETAILS" and "Item 1 of 8", with **Previous item** and **Next item** buttons (‹ and ›, approved symbols). They move through the current list and are disabled at its ends.
   - The item as the heading, then "content area | review type | priority".
   - **Flagged statement** and **Required action** are in Dark Ruby with ⚠ on their headings (CLAUDE.md: claims and safety flags are Dark Ruby with an icon and a message).
   - **Context**, **Source reference** and **Reviewer note** are on a quiet surface.
   - **Status** is shown as a read-only label.
   - From 1280 px the panel sits beside the table. Below that it sits under the table.
7. **Educational-guidance banner** from A5, at the bottom: "Cuidance provides educational guidance. It does not diagnose conditions or replace professional medical advice."

**Statuses** (PROVISIONAL mapping, text always shown):
- Needs review: warning orange.
- In review: neutral. Compass Blue is kept for "selected".
- Needs changes: Dark Ruby plus ⚠.
- Approved with notes: success colors plus ✓.

Longer labels may wrap so the table fits beside the details.

**Priority** uses the same neutral label as the Dashboard and Review Tasks. A5's colored dots aren't an approved symbol.

**Assigned reviewer:** initials in a neutral 32 px circle. It isn't interactive, so it doesn't need the 44 px touch-target size. The full placeholder name is read out to screen readers and shown on hover.

## 2. States

| State | What shows | How to preview |
| --- | --- | --- |
| Ready | Tabs, filters, table, details, banner | Default, including without JavaScript |
| Loading | ⋯ "Loading review items…" (`role="status"`); controls disabled | `?state=loading` |
| Empty | ◌ "Nothing to review right now." plus **Go to Dashboard** | `?state=empty` |
| Error | Dark Ruby ⚠ "Couldn't load review items. Check your connection, then reload the page." (`role="alert"`) | `?state=error` |
| **No results** | ◌ "No items match your search or filter." plus **Clear search and filter**. It resets the search and content area (the tab stays) and returns focus to the search field | For example, the Approved tab with Content area = Safety notes |

The banner shows in every state. All state wording is **PROVISIONAL**.

**Without JavaScript:** all 8 items and the first item's details show. The tabs and filters are hidden, because they can't work.

## 3. Sample data and PROVISIONAL items

**Sample items:**
- All eight come from A5: item, content area, review type, status, priority and date and time as shown.
- The first item's details come from A5's panel.
- The wording and data are in `shared/content/claims-safety-review.ts`.

| Item | Why |
| --- | --- |
| **Tab meaning** | A5 shows every item, including "Approved with notes", under Review Queue. So: Review Queue = every item not fully approved; Approved = approved with notes; Needs Changes = needs changes; All Items = everything. Team 03 to confirm |
| **Reviewer initials replaced** (A5's ES, MR, CL and JT become Reviewer A to D, shown as RA to RD) | Placeholders, as on the Dashboard |
| **Source reference shown as text, marked VERIFY** | A5 names a real organization with a web address that can't be confirmed. There's no link. "(VERIFY: sample reference, not checked)" is added |
| **Details for seven of the eight items show "To be confirmed by Team 03."** | A5 shows details for one item only. Nothing is invented |
| **Reviewer note keeps A5's wording**, "Avoid implying guaranteed results." | It's a reviewer's instruction to avoid the banned word, not app copy |
| **Not built:** the Status dropdown, **Add note** and **Mark as in review** | No review workflow is defined. Nothing changes status, and nothing is saved or assigned |
| **Not built:** sortable column headers, row chevrons, the source link icon, the banner's info icon and the artwork | No sort flow, no detail route, no approved icons or artwork (D6, D10, D16) |
| **Sample data differs from the Dashboard's** | Some items appear on both, with different statuses (for example, "Review ingredient benefit wording" is "Needs changes" on the Dashboard and "Needs review" here, as A5 shows). The Dashboard data is unchanged. Team 03 to confirm whether they should match |
| **At 1280 to 1439 px the table scrolls up to 93 px inside its panel** | Same as Product Information: seven columns plus the details panel. It fits from 1440 px |
| **The disabled Previous button is 3.6:1 (light) and 3.4:1 (dark)** | It uses the approved disabled-ink token. Disabled controls are exempt from WCAG contrast; all other text passes |
| A5's top-bar search and notification bell, and sidebar items (Home, Partners, Insights) | Not built (D11); the confirmed sidebar is kept |
| Status color mapping, priority treatment, state wording, details position below 1280 px | No approved mapping; Empty and Loading are provisional on the board; D14 |

## 4. Files

| File | Change |
| --- | --- |
| `shared/content/claims-safety-review.ts` | New: screen wording, tabs and the A5 sample data |
| `admin-web/app/_claims/ClaimsReviewView.tsx` | New: tabs, filters, table, selection, details, pager, states and banner |
| `admin-web/app/_claims/ClaimsStateFromUrl.tsx` | New: `?state=` preview |
| `admin-web/app/_claims/claims.module.css` | New. Tokens only |
| `admin-web/app/claims-safety-review/page.tsx` | Uses the new view in place of the structure-only note |

**Unchanged:** routes, links, navigation, tokens, assets, dependencies, shared components and the other screens.

## 5. Test results

| Check | Result |
| --- | --- |
| TypeScript, production build, GitHub Pages build | All passed |
| Full browser suite | **352 loads, 0 problems** |
| Claims & Safety Review tests | **0 failures.** In both builds, at 1440, 834, 390 and 320 px, in light and dark: <ul><li>8 items, the first selected, and every A5 details section with its wording.</li><li>⚠ on the two flag headings; only Previous and Next as buttons in the panel.</li><li>Next and Previous, with "Item 2 of 8" showing the "To be confirmed" details.</li><li>Tabs: Approved shows 2, Needs Changes 2, All Items 8.</li><li>Content area = Safety notes shows 1; search "reviewer b" shows 2.</li><li>No results, then Clear (the tab stays, focus returns to the search field).</li><li>Scope note and banner kept.</li><li>No web addresses, no A5 initials, no "Add note" or "Mark as in review", no links, no em dashes, no overflow, no console errors.</li></ul> |
| Preview states | Loading, empty and error in both builds and both themes, with the banner |
| Keyboard | The tab list is one Tab stop. Arrow Right, End, Home and Arrow Left move and select tabs. Then Content area, Search, the table, each item, and Next item (Previous is skipped while disabled). A visible ring on every stop |
| No JavaScript | At 1440 and 320 px: 8 rows and the first details shown, tabs and filters hidden, no overflow |
| Theme tests; Quiz Content and Product Information tests | 0 failures each |
| Responsive audit | 12 widths from 1440 to 320 px, both builds. The audit now also covers Product Information and Claims & Safety Review (ready and error). No sideways page scrolling, nothing spilling out of its box, no target under 44 px |
| Contrast | Every Claims & Safety Review text passes; only the disabled Previous button is lower (see section 3) |
| Hydration | No warnings for the ready, loading, empty and error states |

**Found and fixed during testing:** at 390 px the page scrolled sideways by 177 px. The screen-reader-only reviewer names were positioned outside the table's scrolling panel. Each reviewer cell now contains its hidden name.

## 6. Screenshots

In `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `claims-safety-review-compare-a5-1440-light.png`, `claims-safety-review-compare-a5-1440-dark.png` | A5 beside this screen |
| `claims-safety-review-aligned-{1440,834,390}-{light,dark}.png` | This screen, full page |
| `claims-safety-review-needs-changes-tab-1440-light.png` | The Needs Changes tab |
| `claims-safety-review-no-results-desktop.png`, `claims-safety-review-no-results-mobile.png` | No results |
| `claims-safety-review-loading-1440-light.png`, `claims-safety-review-empty-1440-light.png`, `claims-safety-review-error-1440-dark.png` | Preview states |
| `claims-safety-review-keyboard-dark.png` | Tabs moved with the keyboard |
