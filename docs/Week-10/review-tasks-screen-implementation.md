# Week 10: Review Tasks screen

> **Update (Nov 6, 2026):** Review Tasks now follows the approved Week 9 hi-fi (Batch 1). See `review-tasks-alignment-implementation.md`. The structure-only build described below is the earlier version; its sample data and states are unchanged.

The second built Admin Web screen, after the Dashboard / Review Queue. It uses **seed data only**: no Supabase, sign-in or live content.

- **Branch:** `feat/admin-web-review-tasks`, from `main` at `c99a393` (after PR #8)
- **Date:** Oct 28, 2026
- **Route:** `/review-tasks/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked PROVISIONAL need a Team 03 decision.

## 1. Sources

| Source | Use |
| --- | --- |
| Week 8 design system board (`T03_W08_S03_Board_DesignSystem_Cuidance_v04_ART646`) | Tokens, component rules, and the approved state symbols (⋯ Loading, ◌ Empty, ⚠ Error, ◆ Partner) |
| Existing Admin Web components | Sidebar, PageHeader, Breadcrumb, ButtonLink, DataTable |
| Route map (`docs/Week-10/route-map.md`) | Route `/review-tasks/`, parent Dashboard, breadcrumb and back-link treatment |
| Dashboard sample items (`shared/content/dashboard-review-queue.ts`) | The seeded rows, reused unchanged |
| **Hi-fi reference** | **None.** None of the five current hi-fi images shows a Review Tasks screen. The older wireframe PDF wasn't used. So the layout beyond what's listed in section 2 is **PROVISIONAL** |

## 2. What the screen shows

1. **Persistent sidebar**, with Review Tasks active (existing).
2. **Header:** breadcrumb "Dashboard / Review Tasks", title "Review Tasks", the approved scope note, and the "‹ Back to Dashboard" link. This is the same treatment as every other screen. Breadcrumb wording and back links are still open decisions (C2, C3 in the source reconciliation), and nothing about them changed.
3. **Sample-data note:** "Sample data. Nothing here is connected to live content, and these screens are not part of participant testing."
4. **Review task table** (DataTable), captioned "Review tasks (sample data)", with the columns **Item, Type, Status, Priority, Assigned to, Updated**.

**No primary button:** none is shown in any source for this screen. **No search or filter controls:** see section 6.

## 3. Components and files

| Piece | Where |
| --- | --- |
| Screen shell, breadcrumb and back link | `admin-web/app/_screens/ScreenPage.tsx`. It now accepts page content in place of its "Structure only" note. Other structural screens are unchanged |
| Review Tasks content | `admin-web/app/_reviewTasks/ReviewTasksContent.tsx` |
| State preview | `admin-web/app/_reviewTasks/ReviewTasksStateFromUrl.tsx` |
| Route | `admin-web/app/review-tasks/page.tsx` |
| Status and priority labels, table columns and rows, state panels | `admin-web/app/_review/ReviewShared.tsx` and `review.module.css`. **Moved out of the Dashboard and shared** by both screens, so review items look the same everywhere. The Dashboard looks the same as before |
| Screen wording and seed | `shared/content/review-tasks.ts` |
| Symbols | `shared/content/ui-symbols.ts` (unchanged) |

## 4. Seed data

`reviewTasksSeed` is the Dashboard's `needsAttentionSeed`: the same five sample items, not copied, so the two screens can't drift apart.

| Item | Type | Status | Priority | Assigned to | Updated |
| --- | --- | --- | --- | --- | --- |
| Understanding sensitive skin | Guidance content | In review | High | Reviewer A | Oct 26, 2026 |
| Review ingredient benefit wording | Claims & safety | Needs changes | High | Reviewer B | Oct 26, 2026 |
| Which care areas would you like guidance on? | Quiz content | In review | Medium | Reviewer A | Oct 25, 2026 |
| Check partner disclosure is visible | Partner content | Pending disclosure | Medium | Reviewer C | Oct 24, 2026 |
| Validate source support for claim | Sources | Needs review | Low | Reviewer B | Oct 23, 2026 |

- **Reviewers** are placeholders, not real people.
- **No review logic:** nothing sorts, assigns, filters or changes items.

## 5. Loading, empty and error states

**Default:** the page always shows the seeded table, including without JavaScript.

**Previewing the other states:** add `?state=loading`, `?state=empty` or `?state=error` to the address, for example `/Cuidance_Admin/review-tasks/?state=empty`. This is a review aid only. Real data will set the state later.

| State | What shows | Status |
| --- | --- | --- |
| **Ready** | Seeded table | Built |
| **Loading** | ⋯ "Loading review tasks…" (`role="status"`, no animation) | **PROVISIONAL.** The board marks Loading provisional. Uses the approved ⋯ symbol |
| **Empty** | Dashed panel: ◌ "No review tasks right now." plus one next step, **Go to Dashboard** (secondary) | **PROVISIONAL.** The board marks Empty provisional ("message + one next step"). Uses the approved ◌ symbol |
| **Error** | Dark Ruby panel: ⚠ "Couldn't load review tasks. Check your connection, then reload the page." (`role="alert"`) | Follows the approved error rule (Ruby + icon + message). **The wording is provisional.** No retry button |

Each symbol sits beside its message and is hidden from screen readers. Status labels keep the Dashboard's **PROVISIONAL** mapping:
- Needs changes: ⚠ Dark Ruby.
- Pending disclosure: ◆ Plum.
- Needs review: warning orange.
- In review: neutral.
- Priority: neutral text.

## 6. Provisional and unresolved

| Item | Status | Why |
| --- | --- | --- |
| Screen layout | **PROVISIONAL** | No Review Tasks hi-fi exists. Only the title, breadcrumb, back link, table and states are built |
| Search and filter controls | **Not added** | SearchField and Select are in the component inventory, but no source shows them on this screen, and filtering would need behavior that isn't defined (which fields, how matching works). The search-label question is also still open (`shared/design-tokens/README.md`) |
| Row actions, task detail and opening a task | **Not added** | Not in any source. Detail screens are deferred |
| Sorting, paging and task counts | **Not added** | Not in any source |
| Status and priority colors | **PROVISIONAL** | Same mapping as the Dashboard; no approved status-to-token mapping |
| Empty and loading designs, error wording | **PROVISIONAL** | Same as the Dashboard |
| Breadcrumb root and back links | **Open** (C2, C3) | Unchanged from the route map |

## 7. Layout fix found during testing

At narrow widths (under 768 px), when a page is shorter than the screen, such as this screen's empty state at 390 px, the sidebar's top bar stretched to fill the spare height. The page grid has a minimum height of one screen and was sharing the spare space between its two rows.

**The fix:** on narrow screens, the top bar takes its own height and the page fills the rest (`grid-template-rows: auto 1fr` in `admin-web/app/globals.css`). Desktop and tablet are unchanged. The Dashboard never showed the problem, because it's always taller than the screen.

## 8. Deferred: Supabase

Nothing is connected. When Team 03 starts that step:
- The seed is replaced by a data source.
- The state comes from that request instead of the preview address.

No library was added. Connecting data or adding a library needs Team 03 approval.

## 9. Test results

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed |
| `npm run build` | Passed. The GitHub Pages build (`/Cuidance_Admin/`) also passed |
| Page loads | **352 browser loads, 0 problems:** 2 builds × 22 pages (Review Tasks in 4 states, the Dashboard in 4 states, every other route, `/dev/` and the 404 page) × 1440, 834, 390 and 320 px × light and dark |
| Review Tasks content | Ready: 5 rows, the six columns in order, the caption, and the sample-data note (no "Structure only" note). Loading: ⋯ with the status message. Empty: ◌ with the message, and Go to Dashboard linking to the Dashboard. Error: ⚠ with the alert. No primary button. Symbols hidden from screen readers. No em dashes |
| Breadcrumb and back link | "Dashboard / Review Tasks" in every run. "‹ Back to Dashboard" lands on the Dashboard in both builds, from all four states |
| Sidebar | Review Tasks highlighted, Content closed, persistent at 1440 and 834, Menu at 390 and 320 |
| Light and dark mode | Token backgrounds and the matching sidebar and logo in every run |
| Horizontal overflow | None. At 390 and 320 px the table scrolls inside its own panel |
| 44 px targets | No interactive element under 44 × 44 px |
| Keyboard | Skip link, then the sidebar, the breadcrumb's Dashboard link, Back to Dashboard, then the table panel. Every stop has a visible focus ring, in both modes |
| No JavaScript | Review Tasks shows all 5 rows at 320 px, with no overflow |
| JavaScript errors | None |
| Dashboard after the refactor | All Dashboard checks still pass. Its 9 state and width screenshots are byte-for-byte identical to the merged ones |
| Other routes | All load with the right title and sidebar state. 16 of 16 back links land on the right parent |
| Dependencies | None added. No tokens, logo assets or icon artwork changed |

## 10. Evidence

Screenshots in `docs/Week-10/evidence/`, captured at full page height:

| File | What it shows |
| --- | --- |
| `review-tasks-ready-1440-light.png`, `review-tasks-ready-1440-dark.png` | Seeded table on desktop, both modes |
| `review-tasks-ready-834-light.png` | Tablet |
| `review-tasks-ready-390-dark.png`, `review-tasks-ready-320-light.png` | Narrow widths (the table scrolls inside its panel) |
| `review-tasks-loading-1440-light.png` | Loading state |
| `review-tasks-empty-1440-light.png`, `review-tasks-empty-390-dark.png` | Empty state (the 390 px one also shows the top-bar fix) |
| `review-tasks-error-1440-dark.png` | Error state |
