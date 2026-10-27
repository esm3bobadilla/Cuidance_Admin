# Week 10 Step 3: Dashboard / Review Queue screen

The first complete Admin Web screen. It's built from the Team 03 hi-fi reference with **seed data only**: no Supabase, sign-in or live content.

- **Branch:** `feat/admin-web-dashboard-screen`, from `main` at `3c0a7f3` (after PR #7)
- **Date:** Oct 27, 2026
- **Route:** `/` (Dashboard, the landing page)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked PROVISIONAL need a Team 03 decision.

## 1. Source reference

| Source | Use |
| --- | --- |
| `T03_W09_AdminWeb_HiFiScreen_DashboardReviewQueue_Cuidance_v01_ART646.png` | Visual and structural source of truth. Supplied as an image in the session (the file itself isn't in the repository). It's the same Dashboard reference (A1) used in the source reconciliation |
| Week 8 design tokens (`shared/design-tokens/tokens.css`) | Every color, type style, space, radius and stroke. No raw hex values, and no default framework colors |
| Existing component inventory (`admin-web/components/`) | All shared building blocks. No new shared component was added |
| Persistent sidebar (Week 10 Step 2) | Unchanged |
| `docs/Week-10/route-map.md`, CLAUDE.md | Routes, names, scope and content rules |

## 2. What the screen shows

In hi-fi order:

1. **Persistent sidebar**, with Dashboard active (existing).
2. **Page header:** eyebrow "Internal tool", title "Cuidance Admin Web", and the hi-fi description. A sample-data note follows, because nothing is live.
3. **Review Queue panel:** title, description, four counts (Content for review, Safety checks, Partner content, Open questions) and the screen's one primary action, **View review tasks**. It goes to Review Tasks.
4. **Key Areas:** six cards, each a link to its page: Quiz Content, Guidance Content, Product Information, Knowledge Sources, Partner Highlights, Claims & Safety Review.
5. **Needs attention:** title, description, a **View all review tasks** link (to Review Tasks) and a six-column table: Item, Type, Status, Priority, Assigned to, Updated.
6. **Reminder panel:** "Keep guidance accurate, helpful, and safe."

There's no breadcrumb, as in the hi-fi: the Dashboard is the landing page.

## 3. Components used

| Component | Where |
| --- | --- |
| Sidebar (`components/layout/Sidebar.tsx`) | Root layout, unchanged |
| PageHeader | Page header |
| Card | Review Queue panel, Key Areas cards, reminder panel |
| MetricTile | The four Review Queue counts |
| ButtonLink (primary) | View review tasks (the one primary action) |
| ButtonLink (secondary) | The empty state's next step |
| DataTable | Needs attention table (scrolls inside its own panel on narrow screens) |

**Screen-only files (not shared components):**

- `admin-web/app/_dashboard/DashboardContent.tsx`: the screen's sections and states.
- `admin-web/app/_dashboard/DashboardStateFromUrl.tsx`: picks a state for review previews (see section 5).
- `admin-web/app/_dashboard/dashboard.module.css`: layout and the provisional status labels. Tokens only.

## 4. Seed data

**Where it lives:** `shared/content/dashboard-review-queue.ts`, with the screen's wording. It's sample data for the first implementation only.

**Review Queue counts:** fixed seed values, not calculated. No review logic was added.

| Count | Seed value |
| --- | --- |
| Content for review | 3 |
| Safety checks | 1 |
| Partner content | 1 |
| Open questions | 0 |

**Needs attention rows:** the types, statuses and priorities are the hi-fi's five rows, in the same order. The hi-fi shows "—" for item, assignee and date, so these are filled with sample values:

| Item | Type | Status | Priority | Assigned to | Updated |
| --- | --- | --- | --- | --- | --- |
| Understanding sensitive skin | Guidance content | In review | High | Reviewer A | Oct 26, 2026 |
| Review ingredient benefit wording | Claims & safety | Needs changes | High | Reviewer B | Oct 26, 2026 |
| Which care areas would you like guidance on? | Quiz content | In review | Medium | Reviewer A | Oct 25, 2026 |
| Check partner disclosure is visible | Partner content | Pending disclosure | Medium | Reviewer C | Oct 24, 2026 |
| Validate source support for claim | Sources | Needs review | Low | Reviewer B | Oct 23, 2026 |

- **Item titles** come from the other current hi-fi screens: Guidance Content, Claims & Safety Review and Quiz Content.
- **Reviewers** are placeholders, not real people.
- **The page says it's sample data** in a note under the header and in the table caption.

## 5. Empty, loading and error behavior

**Default:** the page always shows the seeded Review Queue, including without JavaScript.

**Previewing the other states:** add `?state=loading`, `?state=empty` or `?state=error` to the Dashboard address. This is a review aid only, for checking the states with seed data. On GitHub Pages, for example, use `/Cuidance_Admin/?state=empty`. Real data will set the state later.

| State | Review Queue counts | Needs attention area | Status |
| --- | --- | --- | --- |
| **Ready** (default) | Seed counts | Seeded table | Built from the hi-fi |
| **Loading** | "…" | Plain panel: "Loading review items…" (`role="status"`, no animation, no skeleton bars) | **PROVISIONAL.** The board marks Loading provisional: "text status · reduced motion" |
| **Empty** | 0 | Dashed panel: "Nothing needs attention right now." plus one next step, **Go to Review Tasks** (secondary) | **PROVISIONAL.** The board marks Empty provisional: "message + one next step". No icon (no approved icon set) |
| **Error** | "…" | Dark Ruby panel with ⚠ and the message "Couldn't load review items. Check your connection, then reload the page." (`role="alert"`) | Follows the approved error rule (Ruby + icon + message). **The wording is provisional.** No retry button: that would be new behavior |

- **Key Areas and the reminder panel** don't change with the state, because they don't depend on data.
- **"…" instead of "—":** the hi-fi shows "—" as a placeholder count. CLAUDE.md doesn't allow em dashes in app copy, so "…" is used, and the state message explains it.

## 6. Known differences from the hi-fi reference

| Hi-fi | Built | Why |
| --- | --- | --- |
| Sidebar labels "Sources", "Guidance Rules", "Claims & Safety", "Metrics" | Full approved names | Team 03 confirmed sidebar labels (Week 10 Step 2) |
| Sidebar "Admin" subtitle under the logo, illustration, tagline | Not shown | No approved assets; logo files unchanged |
| Header search field and profile photo menu | Not built | Search is new functionality; profiles need sign-in |
| Decorative leaf and bottle illustrations | Not built | No approved illustration assets |
| Icons on the counts, Key Areas cards and table types | Not built | No approved icon set. Text labels carry the meaning |
| Key Areas "Sources" and "Claims & Safety" | "Knowledge Sources", "Claims & Safety Review" | Approved screen names |
| Key Areas card titles in the serif display face | Archivo heading style from Card | Shared Card component |
| Arrows (→) on View review tasks and View all review tasks | No arrows | No approved arrow glyph for buttons. The text is unchanged |
| Counts show "—" | Seed counts ("…" while loading or on error) | Seed data; no em dashes in app copy |
| Count tiles without borders, with icons | MetricTile with its border | Shared MetricTile component |
| Needs attention as one panel around the heading and table | Heading above a bordered table with a visible caption | Shared DataTable component (caption required for screen readers) |
| "…" row menu at the end of each row | Not built | New functionality |
| Status and priority pill colors | **PROVISIONAL** mapping (below) | No approved status-to-token mapping |
| Key Areas: three columns | Three columns at 1280 px and up; one column below | Follows the hi-fi at desktop. The column count was an open token decision, so it needs Team 03 confirmation |
| Reminder panel with leaf art | Plain Card | No approved illustration assets |

**PROVISIONAL status treatment.** Every label shows its text. Color is never the only signal.

| Label | Treatment | Reason |
| --- | --- | --- |
| Needs changes | Dark Ruby border and surface, ⚠ icon | Error rule: Ruby + icon + message |
| Pending disclosure | Byzantium Plum border and surface, ◆ icon | Partner and commercial rule: Plum + label |
| Needs review | Warning orange border and surface (`--color-alert`) | Warning role |
| In review | Neutral border | The hi-fi shows blue, but Compass Blue is reserved for selected and action states |
| High, Medium, Low (priority) | Neutral border, text only | No approved priority mapping. Avoids a second red label in a row |

## 7. Deferred: Supabase connection

- **Nothing is connected.** Supabase, tables, sign-in and live data are not started (CLAUDE.md).
- **What changes later:** when Team 03 starts that step, the seed file is replaced by a data source, and the screen's state (ready, loading, empty, error) comes from that request instead of the preview address. The page layout and components don't need to change.
- **Not done in this step:**
  - No new library was added.
  - No review logic was written: counts are fixed, and nothing assigns, sorts or changes items.
- **Approval needed:** Team 03 approval is required before connecting real data or adding a library.

## 8. Test results

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed |
| `npm run build` | Passed. All routes export as static pages, including the GitHub Pages build (`/Cuidance_Admin/`) |
| Page loads | 304 browser loads: 2 builds × 19 pages (the Dashboard in 4 states, every other route, `/dev/` and the 404 page) × 1440, 834, 390 and 320 px × light and dark |
| Dashboard states | Right counts in every run (ready 3, 1, 1, 0; empty 0, 0, 0, 0; loading and error "…"), 5 table rows only when ready, the loading status message, the error alert, 6 Key Areas cards, and exactly one primary action (View review tasks). No em dashes. During this run, a typo in the test script stopped its count check from reading digits. A corrected re-check confirmed the counts in both builds at 1440 and 320 px |
| Light and dark mode | Token backgrounds, matching sidebar and logo, provisional labels readable in both |
| Horizontal overflow | None in any run. At 390 and 320 px the table scrolls inside its own panel |
| 44 px targets | No interactive element under 44 × 44 px. Each Key Areas card is one large link target |
| Keyboard | Tab order: Skip to main content, the sidebar, View review tasks, the six Key Areas cards, View all review tasks, then the table panel. Every stop shows a focus ring. On a card, the ring goes around the whole card |
| Links | Clicking a Key Areas card away from its title (Partner Highlights, bottom-left corner) opens that page. View review tasks and View all review tasks open Review Tasks. Passed in both builds |
| Existing routes | All still load with the right title, sidebar state and back links (13 of 13). Content toggle, Menu and skip link behave as before |
| No JavaScript | The Dashboard shows the seeded Review Queue, and the sidebar is fully visible |
| JavaScript errors | None. The only console entry is the browser's expected 404 notice on the 404 page |
| `npm run dev` | Dashboard in all four states and the other routes load, with no errors, warnings or hydration mismatches |
| Dependencies | None added |

## 9. Evidence

Screenshots in `docs/Week-10/evidence/`. Each is captured at full page height, so the sidebar shows as it does on screen.

| File | What it shows |
| --- | --- |
| `dashboard-ready-1440-light.png`, `dashboard-ready-1440-dark.png` | Seeded screen on desktop, both modes |
| `dashboard-ready-834-light.png` | Tablet: persistent sidebar, Key Areas in one column |
| `dashboard-ready-390-dark.png`, `dashboard-ready-320-light.png` | Narrow widths with the Menu closed |
| `dashboard-loading-1440-light.png` | Loading state (provisional) |
| `dashboard-empty-1440-light.png` | Empty state (provisional) |
| `dashboard-error-1440-dark.png`, `dashboard-error-390-light.png` | Error state |
| `dashboard-focus-keyarea-light.png`, `dashboard-focus-keyarea-dark.png` | Keyboard focus on a Key Areas card |

The older `dashboard-1440-*.png`, `dashboard-834-light.png` and `dashboard-320-dark.png` are the Week 10 Step 1 evidence of the earlier placeholder dashboard. They're kept unchanged.

## 10. Decisions for Team 03

1. **Status and priority colors** (PROVISIONAL mapping in section 6). Approve, or supply the status-to-token mapping.
2. **Key Areas column count:** three at desktop, following the hi-fi. Confirm, and update the open item in `shared/design-tokens/README.md`.
3. **Empty and loading designs** (provisional on the board). Confirm the message-only treatments, or supply the final ones.
4. **Error wording** and whether the error state should offer a retry action.
5. **Icon set** for counts, cards and table types.
6. **Header search and profile menu** from the hi-fi: in scope later, or removed?
7. **"Open questions" count:** what it counts, before real data is connected.
8. **Approval to connect real data** (Supabase) or add any library. Not started.
