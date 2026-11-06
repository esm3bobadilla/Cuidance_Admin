# Week 10 Step 3: Dashboard / Review Queue screen

> **Update (Nov 6, 2026):** the Dashboard's layout now follows the responsive prototype (Slice 2). Its content, sample data and links are unchanged. See `dashboard-alignment-implementation.md`. The layout described below is the earlier build.

The first complete Admin Web screen. It's built from the Team 03 hi-fi reference with **seed data only**: no Supabase, sign-in or live content.

- **Branch:** `feat/admin-web-dashboard-screen`, from `main` at `3c0a7f3` (after PR #7)
- **Date:** Oct 27, 2026 (updated the same day for the Team 03 approvals in sections 11 and 13)
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

**Review Queue counts:**

| Count | Value | How it's set |
| --- | --- | --- |
| Content for review | 3 | Fixed seed value |
| Safety checks | 1 | Fixed seed value |
| Partner content | 1 | Fixed seed value |
| Open questions | 0 | **Counted from the seed** (rule below) |

**Open questions counting rule** (Team 03 approved the count, Oct 27, 2026):

1. Every seed item has an explicit `openQuestion` field, `true` or `false`.
2. **Open questions = the number of seed items with `openQuestion: true`.** Nothing else counts: not the item's type, status, priority or wording.
3. When no item is marked, the count is **0**. That's the case today: all five seed items are `openQuestion: false`.
4. The empty state still shows 0. Loading shows ⋯ and error shows ⚠ (section 12).

The rule is in `openQuestionCount()` in `shared/content/dashboard-review-queue.ts`. It was checked with the shipped seed (0), no items (0), two items marked (2) and all five marked (5). No other review logic was added.

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
| **Loading** | ⋯ (approved Loading symbol) | Plain panel: ⋯ "Loading review items…" (`role="status"`, no animation, no skeleton bars) | **PROVISIONAL.** The board marks Loading provisional: "text status · reduced motion" |
| **Empty** | 0 | Dashed panel: ◌ (approved Empty symbol) "Nothing needs attention right now." plus one next step, **Go to Review Tasks** (secondary) | **PROVISIONAL.** The board marks Empty provisional: "message + one next step" |
| **Error** | ⚠ (approved Error symbol) | Dark Ruby panel with ⚠ and the message "Couldn't load review items. Check your connection, then reload the page." (`role="alert"`) | Follows the approved error rule (Ruby + icon + message). **The wording is provisional.** No retry button: that would be new behavior |

- **Key Areas and the reminder panel** don't change with the state, because they don't depend on data.
- **⋯ and ⚠ instead of "—":** the hi-fi shows "—" as a placeholder count. CLAUDE.md doesn't allow em dashes in app copy, so the counts use the approved state symbols, and the state message below explains them.

## 6. Known differences from the hi-fi reference

| Hi-fi | Built | Why |
| --- | --- | --- |
| Sidebar labels "Sources", "Guidance Rules", "Claims & Safety", "Metrics" | Full approved names | Team 03 confirmed sidebar labels (Week 10 Step 2) |
| Sidebar "Admin" subtitle under the logo, illustration, tagline | Not shown | No approved assets; logo files unchanged |
| Header search field and profile photo menu | Not built | **Approved by Team 03, blocked by missing assets and specs** (section 13): no approved search icon, avatar artwork or menu specification exists in the repository |
| Decorative leaf and bottle illustrations | Not built | No approved illustration assets |
| Icons on the counts, Key Areas cards and table types | Not built | These are pictorial icons (document, warning triangle, people, speech bubble, leaf, book, link, shield). They aren't among the design system's approved symbols (section 12), and no approved icon files exist. Text labels carry the meaning |
| Key Areas "Sources" and "Claims & Safety" | "Knowledge Sources", "Claims & Safety Review" | Approved screen names |
| Key Areas card titles in the serif display face | Archivo heading style from Card | Shared Card component |
| Arrows (→) on View review tasks and View all review tasks | No arrows | No approved arrow glyph for buttons. The text is unchanged |
| Counts show "—" | Seed counts (⋯ while loading, ⚠ on error) | Seed data; approved state symbols; no em dashes in app copy |
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
| Dashboard states | Right counts in every run (ready 3, 1, 1, 0; empty 0, 0, 0, 0; loading and error "…"), 5 table rows only when ready, the loading status message, the error alert, 6 Key Areas cards, and exactly one primary action (View review tasks). No em dashes. **Re-run after the Open questions change: 304 loads, 0 problems.** Open questions showed 0 in every ready and empty view, in both builds, all four widths and both modes |
| Open questions rule | `openQuestionCount()` checked directly: shipped seed 0, no items 0, two items marked 2, all five marked 5 |
| Approved symbols (Oct 27, 2026) | Full run after the change: **304 loads, 0 problems** (2 builds × 19 pages × 4 widths × 2 modes). Checked: ⋯ on the loading counts and the loading message; ⚠ on the error counts and alert; ◌ only in the empty state; every panel and label symbol hidden from screen readers. After a spacing fix to the empty-state message, the Dashboard's 4 states and Review Tasks were re-run: **80 loads, 0 problems**. Keyboard order, links and back links unchanged |
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

Screenshots in `docs/Week-10/evidence/`. Each is captured at full page height, so the sidebar shows as it does on screen. They were recaptured after the Open questions change and came out byte-for-byte identical, because the visible value is still 0.

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
5. ~~Icon set~~ **Resolved for state symbols** (section 12): the design system's approved symbols are used. Pictorial icons from the hi-fi still have no approved source.
6. ~~Header search and profile menu~~ **Approved for implementation by Team 03.** Blocked until the assets and specs in section 13 are supplied.
7. ~~"Open questions" count~~ **Approved and implemented** (section 4).
8. **Approval to connect real data** (Supabase) or add any library. Not started.
10. ~~`›` chevron~~ **Approved by Team 03** for the Key Areas cards and the sidebar Content toggle (section 13).
9. **Header search label** (dependency for search, section 13). SearchField always shows a visible label (board rule). The hi-fi field shows only placeholder text. Confirm whether the header search may hide its label (an open item in `shared/design-tokens/README.md`).

## 11. Team 03 approvals (Oct 27, 2026) and blocked assets

Team 03 approved the final Cuidance icon set, the header search, the profile menu and the Open Questions count.

| Approval | Status | What's needed |
| --- | --- | --- |
| Open Questions count | **Implemented** (section 4) | Nothing |
| Icon set | **Resolved for state symbols (section 12).** Pictorial icons still have no approved source | The design system's approved symbols are now used. Pictorial icons from the hi-fi (count, Key Areas and table-type icons, the reminder leaf) would need approved artwork files |
| Header search | **Approved; blocked by missing assets** (section 13) | The approved search icon, the visible-label decision and the intended behavior. No search route exists |
| Profile menu | **Approved; blocked by missing assets and spec** (section 13) | The approved avatar treatment and artwork, the menu contents and behavior, and an avatar component. No sign-in |

**Where I searched:** the working tree, every remote branch (`main`, `feat/admin-web-dashboard-screen`, `feat/admin-web-route-map`, `feat/admin-web-scaffold`, `deploy-github-pages`, `claude/clever-goldberg-vgmhex`) and the files uploaded in this session. The only icon-like files are the logo package in `shared/brand/logo/` (lockups, app icon, favicons). Those are brand marks, not interface icons. No icons were drawn, borrowed from a library, or made from the logo.

## 12. Approved interface symbols (Week 8 design system)

Team 03 confirmed that the Week 8 design system board is the authority for interface symbols. It approves these text symbols through its **Core UI Components** and **State Key** sections:

| Symbol | Meaning | Board source |
| --- | --- | --- |
| ? | Help | Core UI Components: "? Help" |
| ‹ | Back | Core UI Components: "‹ Back" |
| ✓ | Selected, Success | State Key: "✓ Selected", "✓ Success" |
| ⚠ | Error | State Key: "⚠ Error". Form errors: "⚠ Enter a full email address…" |
| ◆ | Partner, Sponsored | Core UI Components: "◆ Partner content", "◆ Sponsored" |
| ◌ | Empty | State Key: "◌ Empty" |
| ⋯ | Loading | State Key: "⋯ Loading" |
| ◎ | Focus | State Key: "◎ Focus" |
| □ | Default | State Key: "□ Default" |
| ⊘ | Disabled | State Key: "⊘ Disabled" |

They're defined once in `shared/content/ui-symbols.ts`. They're text symbols, not icon artwork, so **no SVG files or icon library are needed**, and none were added.

**Rules applied:**
- Every symbol sits beside visible text, a label or a message.
- The symbol itself is hidden from screen readers (`aria-hidden`), so it's never the only signal and isn't read out as a character name.
- No symbol is a control on its own, so the 44 px targets are unchanged.

**On the Dashboard:**

| Symbol | Where | Status |
| --- | --- | --- |
| ⋯ Loading | Loading panel ("⋯ Loading review items…") and the four counts while loading | **Implemented.** Replaces "…" |
| ◌ Empty | Empty panel ("◌ Nothing needs attention right now.") | **Implemented** |
| ⚠ Error | Error panel, the four counts on error, and the "Needs changes" status label | **Implemented.** The counts used "…" before |
| ◆ Partner | "Pending disclosure" status label | **Implemented** (already in place, now from the shared file) |
| ? Help | Not used: the Dashboard hi-fi has no help control | Not applicable. Adding one would be a new feature. `/dev/` already shows "?" on its Help example |
| ‹ Back | Not used: the Dashboard is the landing page and has no back link | Not applicable. The other screens' "‹ Back to …" links already use it |
| ✓ Selected | Not used: the Dashboard has no selectable item. The sidebar's active page follows the active-tab rule (pill + blue + label), which has no check mark | Not applicable |
| ✓ Success | Not used: the Dashboard has no success message | Not applicable |
| ◎ Focus, □ Default, ⊘ Disabled | Not used on the Dashboard: focus shows as the 2 px ring, and the Dashboard has no disabled controls | Not applicable |

**Shared components that already use these symbols** (unchanged): Toast (✓, ⚠), Field and Checkbox errors (⚠, ✓), DisclosureLabel (◆) and the back links (‹).

**Font note:** Archivo and Newsreader don't include ◌ or ⋯, so the browser draws them with a system fallback font. ◌ looks a little small as a result. Nothing was redrawn.

**Chevron "›": APPROVED by Team 03 (Oct 27, 2026)** for the Key Areas cards and the sidebar Content toggle. It follows the Week 8 board's Core UI Components treatment: the text symbol "›" placed with a link label, as on the board's result-card links ("Why this fits you ›", "View product ›"). It stays a text symbol, hidden from screen readers, beside a visible label (the card title, or the toggle's "Content pages" name). No code change was needed. See section 13.

**Search and profile** (approved since: see section 13)

| Item | Status | Why |
| --- | --- | --- |
| Header search | **Approved, not implemented: assets missing** (section 13) | The hi-fi shows a search field with a magnifier icon and the placeholder "Search content, sources, or tasks…". No approved search icon exists. Also needed: the visible-label decision and the intended behavior |
| Profile/avatar | **Approved, not implemented: assets missing** (section 13) | The hi-fi shows a photo and a menu arrow. No approved avatar artwork or treatment specification exists, and there's no avatar component |
| Profile menu contents | **Approved, not implemented: spec missing** (section 13) | The menu's items and behavior aren't shown in any supplied source |

## 13. Team 03 decisions (Oct 27, 2026): search, profile and chevron

| Decision | Status | Can implementation proceed? |
| --- | --- | --- |
| 1. Header search is approved | **APPROVED.** Not implemented | **No, blocked by a missing asset and two decisions** (below) |
| 2. Profile/avatar treatment and profile-menu behavior are approved for implementation | **APPROVED.** Not implemented | **No, blocked by missing artwork and a missing specification** (below) |
| 3. The `›` chevron is approved for the Key Areas cards and the Content sidebar toggle | **APPROVED and already in place.** Uses the Week 8 board's text-symbol treatment | Done. No code change needed |

**Asset check (Oct 27, 2026).** I searched every remote branch (`main`, `feat/admin-web-dashboard-screen`, `feat/admin-web-route-map`, `feat/admin-web-scaffold`, `deploy-github-pages`, `claude/clever-goldberg-vgmhex`) and the session uploads. There are **no search, magnifier, avatar, profile, person or user assets**, and no `shared/brand/icons/` folder. Nothing was invented or traced. The rejected logo package isn't a source.

**Implementation dependencies: search**

1. **Search icon file:** the approved magnifier shown in the Dashboard hi-fi, as artwork (SVG with real vector paths preferred), for example in `shared/brand/icons/`. It isn't one of the board's approved text symbols, so it needs an artwork file.
2. **Label decision:** the board requires visible labels, and SearchField always shows one, but the hi-fi field shows only placeholder text. Confirm whether the header search keeps a visible label or uses a hidden accessible label. This is still an open item in `shared/design-tokens/README.md`.
3. **Behavior:** what happens on submit. No search route or search data exists, so today the field could only be presentation. Confirm "presentation only" or supply the target route or behavior.

**Implementation dependencies: profile/avatar and menu**

1. **Avatar treatment and artwork:** photo, initials or a generic person icon, with the artwork file if it's an image or icon, plus its size and shape (the hi-fi shows a round photo about 48 px wide).
2. **Whose details show:** without sign-in there's no real user. Confirm the placeholder (for example a generic "Team member" with a person icon) so no name or photo is invented.
3. **Menu contents and behavior:** the items (labels and where each goes) and how it opens and closes. The hi-fi shows only the closed control with a "⌄" arrow, which isn't one of the board's approved symbols either.
4. **Component:** there's no avatar or menu component in the inventory, and the Week 9 Step 5 review listed "avatar" as not on the board. Once the above is supplied, one shared component would be added with a 44 px target, a visible or accessible label, and keyboard support (open, close, Escape, focus return).

**No authentication or account management** comes with these decisions. The profile control stays presentation only until sign-in is a separate, approved step.

