# Admin Web prototype alignment map

- **Branch:** `feat/admin-web-prototype-alignment`, from `main` at `9764127` (after PR #11)
- **Date:** Nov 5, 2026
- **Status:** Reviewed by Team 03 on Nov 5, 2026. **D1 is resolved** (section 0), and the sprint may start in the order in section 9. Nothing is implemented yet.
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.**

## 0. Decisions recorded (Nov 5, 2026)

**D1. Sources: RESOLVED by Team 03.**
1. **The Cuidance Admin Responsive Prototype (P) is the source of truth for:**
   - The Admin Web shell.
   - Responsive behavior.
   - Team Access and the role-management flow.
   - Account and invitation states.
   - Profile controls.
   - Light, Dark and System theme behavior.
2. **The approved Week 9 hi-fi screenshots (A1 to A5) are the visual source for the existing content screens.**
3. **The unreadable Week 9 PDF (B) is supporting layout reference only.** No wording or requirements are taken from text that can't be read.

**Constraints confirmed for this sprint.** These settle D2, D3, D6 (for the theme control), D7 and D16, and override where P differs:
- **Sidebar:** keep the current destinations unless a later Team 03 decision changes them (D2). Keep the approved **blue active treatment** (D3). Keep the approved **dark-mode sidebar** (D7).
- **Theme:** System stays the default. Light, Dark and System stay saved on the device. The **text-based Theme control** stays unless an icon set is formally approved (D6, for the theme control).
- **Roles:** the approved role definitions stay **exactly as written**.
- **Not built:** Supabase, authentication enforcement, invitations, account creation and onboarding logic.
- **Not added:** illustrations, icons, dependencies or brand assets that aren't approved (D16).
- **Quality:** accessible responsive behavior at desktop, tablet and mobile widths. Loading, empty, error and no-results states are preserved.
- **Content:** no invented content. Unresolved items are marked **PROVISIONAL** in each implementation note.

**Sprint order:**
1. Shared shell.
2. Dashboard.
3. Existing content screens, one at a time.
4. Static Team Access and roles presentation, using the approved four-role wording.
5. Detail screens, only after the shared patterns are stable.

**Note on the A1 to A5 screenshots:** only their written record (`admin-web-source-reconciliation.md`) is available in this session, not the image files. They need to be re-supplied before step 3.

**Quiz Content (Nov 6, 2026):** approved as a provisional implementation. Accepted as PROVISIONAL decisions:
- The five Cuidance-relevant questions.
- No "Emotional Wellbeing" or "Practical Support" care areas.
- Answer options "To be confirmed by Team 03."
- No invented care areas or question data.

See `quiz-content-alignment-implementation.md`.

**Product Information (Nov 6, 2026):** approved as a provisional implementation. Accepted as PROVISIONAL decisions:
- Brand A to Brand D until brands are approved.
- Partner content labeled in Byzantium Plum.
- No recommendation-style wording.
- "To be confirmed by Team 03." for unavailable details and Partner disclosure wording.
- Table scrolling inside its panel at 1280 to 1439 px.

See `product-information-alignment-implementation.md`.

**Batch 1 (Nov 6, 2026):**
- **Done:** Claims & Safety Review (Slice 5, re-tested), Review Tasks, Settings / Team Access.
- **Blocked by missing source material:**
  - Guidance Content: A3 isn't available.
  - Knowledge Sources and Partner Highlights: only the unreadable PDF.
- **Combined results:** TypeScript, production and GitHub Pages builds, and the full suite (352 loads, 0 problems). Each screen's tests passed: theme, Quiz Content, Product Information, Claims & Safety Review, Review Tasks and Settings. The responsive and 44 px audit passed at 12 widths in both builds. Contrast, keyboard and focus, no JavaScript and hydration all passed.

**Batch 2 (Nov 6, 2026):**
- **Done:** Content landing page.
- **Blocked:**
  - Guidance Rules Review: no source; D9.
  - Content Metrics: only the unreadable PDF; D13.
  - Account Support: only the unreadable PDF; D12.
- **Skipped:** Commercial Content (C7 not confirmed).
- **Detail screens:** none built, because none is approved yet (D10).
- **Combined results:** TypeScript, production and GitHub Pages builds, and the full suite (352 loads, 0 problems). All eight per-screen test suites passed. The responsive and 44 px audit passed at 12 widths in both builds. Contrast, keyboard and focus, no JavaScript and hydration all passed.

**Completion sprint Batch 1 (Nov 6, 2026):**
- **Done:** Guidance Content (A3), Knowledge Sources and Partner Highlights, from the hi-fi screenshots attached Nov 6.
- **Combined results:** TypeScript, production and GitHub Pages builds, and the full suite (352 loads, 0 problems). All screen tests passed. The responsive and 44 px audit passed at 12 widths in both builds. Contrast, keyboard and focus, no JavaScript and hydration all passed.

## 1. Sources compared

| Code | Source | What it gives | Limits |
| --- | --- | --- | --- |
| **P** (source of truth for the shell, per D1) | Cuidance Admin Responsive Prototype (Standalone), received Nov 5, 2026. Screens F01 to F18 | Shell, Dashboard by role, Team Access, Roles and permissions, Access denied, Profile menu, Theme menu, at desktop, tablet and phone widths, light and dark | **No content screens.** Its own index says the 20 hi-fi content screens are in sections 01 to 06 of a separate board. Uses the Material Symbols icon font and 11 colors that aren't tokens |
| **B** (supporting layout reference only, per D1) | `T03_CuidanceAdminWeb_HiFiScreens_v01_ART646.pdf` ("Cuidance Admin Web Hi-Fi Screens", Week 9). 5 titled sections, 18 screens | Layout of every content screen (lists, detail panels, filters) | **Small text can't be read.** The PDF draws it as broken glyph fragments at any zoom, so only headings, screen titles and layout are usable. It shows **5 sections and 18 screens**, while P mentions **sections 01 to 06 and 20 screens**. Under D1 it is layout reference only |
| **A** (visual source for content screens, per D1) | The approved Week 9 hi-fi screenshots A1 to A5 (Dashboard, Quiz Content, Guidance Content, Product Information, Claims & Safety Review), recorded in `admin-web-source-reconciliation.md` | Screen titles, breadcrumbs, detail panels | Five screens only |
| **R** | Approved role wording (`shared/content/admin-roles.ts`) | Four roles, Can and Cannot lists, publishing rule | Wording only. There's no approved permission grid (see section 6) |
| **T** | Approved Light / Dark / System behavior (merged in PR #11) | Theme menu beside the profile area. System default, saved on the device, applied before first paint | None |

The three visual sources disagree with each other on the shell. Section 3 compares them. **Under D1, P decides the shell, except where the confirmed constraints in section 0 say otherwise.**

## 2. Screen-to-route map

**Status key:**
- **Built:** content exists now.
- **Structural:** title and links only.
- **Missing:** no route yet.
- **Deferred:** out of scope until Team 03 reopens it.
- **Out of scope:** not part of Admin Web.

### 2a. Existing routes

| Route | Screen | Built today | Source screens | Visual update needed | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | Dashboard | **Built** (follows A1): Review Queue panel, Key Areas, Needs attention table | A1; B §01 "Review Queue" (6 tiles, filter chips, table with a right detail panel); P F08 (role-based: welcome, role tiles, Your work, Your access) | **Done (Slice 2).** Prototype F08 layout with the current content | D5 resolved |
| `/content/` | Content | **Built (Batch 2)**: one panel of six link tiles (Dashboard Key Areas pattern) | No source shows this page | **Done** (`content-landing-alignment-implementation.md`) | C4 still open; layout PROVISIONAL |
| `/content/quiz-content/` | Quiz Content | **Built (Slice 3a)**: search, status filter, list, details panel, states | A2 (visual source) | **Done** (`quiz-content-alignment-implementation.md`) | Detail routes in 2b; three A2 rows and the answer options left out for Team 03 to confirm |
| `/content/guidance-content/` | Guidance Content | **Built (completion Batch 1)**: search, status filter, list with summaries, details | A3 (attached Nov 6) | **Done** (`guidance-content-alignment-implementation.md`) | Clinical-review wording left out; evidence labels and other details "To be confirmed" |
| `/content/product-information/` | Product Information | **Built (Slice 4)**: search, list, details panel with disclosure and source sections, states | A4 (visual source) | **Done** (`product-information-alignment-implementation.md`) | Brands shown as placeholders, one A4 sentence left out, and details for three products "To be confirmed" (all PROVISIONAL). Availability stays VERIFY |
| `/content/knowledge-sources/` | Knowledge Sources | **Built (completion Batch 1)**: search, list, source details | Knowledge Sources hi-fi (attached Nov 6) | **Done** (`knowledge-sources-alignment-implementation.md`) | Owner placeholders; Open and Add source not built |
| `/content/partner-highlights/` | Partner Highlights | **Built (completion Batch 1)**: banner, search, labeled list, details with plum preview | Partner Highlights hi-fi (attached Nov 6) | **Done** (`partner-highlights-alignment-implementation.md`) | Partner A to D; artwork and actions not built |
| `/content/commercial-content/` | Commercial Content | Structural, **not in the sidebar** (C7) | B §04 "Content Management" (unreadable) | **SKIPPED (Batch 2):** still needs Team 03 confirmation in the route map (C7) | Still listed on the Content page, as before |
| `/guidance-rules-review/` | Guidance Rules Review | Structural | **None.** B's sidebar shows "Guidance Rules" but no screen; B §02 "Branch & Routing Rules" may be it (D9) | **BLOCKED (Batch 2):** needs an approved source and the D9 decision | |
| `/claims-safety-review/` | Claims & Safety Review | **Built (Slice 5)**: tabs, content-area filter, search, review table, details panel with pager, banner, states | A5 (visual source) | **Done** (`claims-safety-review-alignment-implementation.md`) | Tab meaning, reviewer placeholders, VERIFY source, unbuilt review actions, and details for seven items "To be confirmed" (all PROVISIONAL) |
| `/content-metrics/` | Content Metrics | Structural | Only B §01 "Metrics" (unreadable, layout only under D1) | **BLOCKED (Batch 2):** needs an approved hi-fi screenshot; charts also need D13 | Stays a limited internal view (CLAUDE.md) |
| `/account-support/` | Account Support | Structural | Only B §05 "Account Support" (unreadable, layout only under D1) | **BLOCKED (Batch 2):** needs an approved hi-fi screenshot; scope check D12 | Must stay limited internal support |
| `/review-tasks/` | Review Tasks | **Built (Batch 1)**: search, selectable table, task panel with the hi-fi checklist, states | Review Tasks hi-fi screenshot | **Done** (`review-tasks-alignment-implementation.md`) | Dashboard sample data kept; hi-fi context, tabs, due dates and actions left out (PROVISIONAL) |
| `/settings/` | Settings | **Built (Batch 1)**: static Team Access (prototype F09) and the approved roles card | P F09 | **Done** (`settings-team-access-implementation.md`) | No new route (D10); invites, actions and access denied not built (PROVISIONAL) |
| `/dev/` | Component Preview | Built | None | Yes: add new shared patterns | Internal only |
| 404 | Page not found | Built | None | Shell only | |

### 2b. Missing screens or routes

All of these would be **new routes**, so each needs Team 03 approval (D10). The proposed routes are only suggestions.

| Source screen | Proposed route | Parent | Notes |
| --- | --- | --- | --- |
| B §01 App Activity Detail | `/content-metrics/app-activity/` | Content Metrics | **D12:** may go past "limited Content Metrics" (analytics expansion) |
| B §02 Quiz Question Detail | `/content/quiz-content/question/` (one sample) | Quiz Content | Static sample. No editing saved |
| B §02 Branch & Routing Rules | `/content/quiz-content/routing-rules/` or `/guidance-rules-review/` | Quiz Content or top level | **D9** |
| B §02 Quiz Progression & Uncertainty Routing | `/content/quiz-content/progression/` | Quiz Content | Rules must match `shared/quiz-rules/` once that's defined |
| B §02 result outcome detail ("… Hair + Skin starting point"; title partly unreadable) | `/content/quiz-content/result/` | Quiz Content | Result wording must keep evidence labels and the emergency line |
| B §02 Guest + Account States | `/content/quiz-content/account-states/` | Quiz Content | **D12:** must not become public account management |
| B §02 Guidance Connection Detail ("Hair + Skin sample path") | `/content/guidance-content/connection/` | Guidance Content | **D9** |
| B §05 Review Task Detail | `/review-tasks/task/` (one sample) | Review Tasks | Static sample. No assigning or approving |
| P F09 and B §05 Team Access | `/settings/team-access/` | Settings | **Static sample table only.** No invite, edit role or deactivate actions (deferred). C8 |
| P F05 Roles and permissions | `/settings/team-access/roles/`, or keep it as the Settings card | Team Access | Uses **R** wording only (section 6) |
| P F12 Access denied | A preview state, not a route (`?state=denied`) | Team Access | No sign-in, so it can only be previewed |

**Not planned (deferred or out of scope):**
- P F01 Main Admin account creation; F02 Create workspace; F03 Onboarding (7 steps); F04 Invite team members; F06 Invitation management; F07 Accept invitation; F10 Edit role; F11 Deactivate member; F16 Expired invitation; F17 Declined invitation. These are **deferred**: authentication, invitations and account creation.
- P F18 Cuidance Mobile Settings: **out of scope**.
- P F15 Prototype screens index: a prototype tool, not a screen.

## 3. Shared shell changes

| Part | Now (`main`) | P (prototype) | B (Week 9 board) | Proposed | Decision |
| --- | --- | --- | --- | --- | --- |
| Top bar | Theme menu and "TM" placeholder, right-aligned | Breadcrumb on the left; "PROTOTYPE · SAMPLE DATA"; theme icon button; initials | Logo on the left; breadcrumb; search icon button; initials | Move the breadcrumb into the top bar. Keep the Theme menu and profile on the right | D4, D11 |
| Breadcrumb | Starts with "Dashboard", in the page header | Starts with "Admin" | Starts with "Admin" | "Admin" (both sources agree) | **C2** |
| Back links | "‹ Back to …" on every page | None, except "Back to Team Access" | None | Remove them, now that the sidebar and breadcrumb exist | **C3** |
| Sidebar style | Grounded Green, logo, 13 confirmed items, blue pill for the active item | Grounded Green; workspace card; icons; 5 items; green fill and accent bar; user card | **Light** sidebar; groups that open (Dashboard: Review Queue, Review Tasks, Metrics; Content: …; Settings: Accounts, Team Access); dark green active pill; user card | **Keep the 13 confirmed items** (D2 resolved) | Resolved |
| Active item | Compass Blue pill (CLAUDE.md rule) | `#2E4A3A` fill, not a token | Dark green pill | Keep the blue pill (D3 resolved) | Resolved |
| Icons | Approved Week 8 symbols only | Material Symbols font | Small outline icons (source unknown) | No icon library until approved | D6 (open) |
| Profile | "TM" placeholder, opens nothing | Menu: name, email, role, Appearance, Team Access, Prototype screens, Sign out | Initials circle | Menu with Appearance and Team Access only. No Sign out (no sign-in) | **D11** |
| Search | None | None | Search icon button in the top bar | Earlier Team 03 note: search approved, waiting on an icon | D6, D11 |
| Dark mode sidebar | Light green (Team 03 decision, Oct 27) | Stays Grounded Green | Not shown | Keep the Oct 27 decision (D7 resolved) | Resolved |
| Detail panel pattern | None | Not shown | Right-side panel beside most lists (B §02 to §05, A2 to A5) | New shared `DetailPanel`. Stacks under the list below 1280 px | D14 |
| Filters | None | Pill filter chips (Team Access) | Pill filter chips, tabs, search field | Shared FilterChips and Tabs. SearchField already exists | D11 |
| Status chips | Text, plus a symbol for Needs changes and Pending disclosure | Icon and text chips with tinted fills | Outlined chips with tinted fills | Keep text plus approved symbols. Map colors to existing tokens only | D6 |
| Shadows | None | Menus have shadows | Not clear | None (no token) | Open item already listed |

## 4. Responsive requirements

| Width | Now | P | Proposed (to confirm) |
| --- | --- | --- | --- |
| 1280 px and up | 240 px sidebar, content beside it | Same | Same. List and detail panel side by side |
| 768 to 1279 px | 240 px sidebar | Icon-only sidebar strip with a menu button | Keep the 240 px sidebar unless icons are approved (an icon strip needs icons). The detail panel moves under the list |
| Under 768 px | Logo and a "Menu" button; the list opens in place | Top bar with a menu button, logo, theme and initials; slide-in menu | Single top bar with Menu, logo, Theme and profile. The list still opens in place (no slide-in, to keep the no-JavaScript fallback simple) |
| Every width | No sideways scrolling, 44 px targets, tables scroll inside their panels, works down to 320 px | Same aims | Keep all of them, plus light, dark and the no-JavaScript fallback |

Tiles: 4 across from 1280 px, 2 across below 768 px (as P). Lists in P move their chips under the title on phones.

## 5. Loading, empty, error and success states

The approved state rules apply:
- **Loading:** ⋯, provisional.
- **Empty:** ◌, a message and one next step, provisional.
- **Error:** Dark Ruby, ⚠ and a message.
- **Success:** the existing Toast.

Every state can be previewed with `?state=` until real data exists.

| Screen | Loading | Empty | Error | Success | Extra states |
| --- | --- | --- | --- | --- | --- |
| Dashboard | Exists | Exists | Exists | None | None: D5 keeps no role-based views, so no "Limited access" banner |
| Review Tasks and Task Detail | Exists (list) | Exists (list) | Exists (list) | Toast after a static action, such as "Saved as a draft (sample)" | Task not found |
| Content lists (Quiz, Guidance, Product, Sources, Partner, Commercial) | New | New, including "No matches for these filters" | New | None | Detail panel with nothing selected |
| Detail screens (2b) | New | Not applicable | New, including "Item not found" | Toast for static actions | Partner content always shows "Partner" |
| Claims & Safety Review | New | New ("Nothing to review") | New | Toast: Approve or Request changes (sample, nothing saved) | |
| Content Metrics | New | New ("No data for this range") | New | None | |
| Account Support | New | New | New | None | |
| Team Access | New | New ("No members match") | New | None (invitations deferred) | Access denied (P F12) as a preview state |
| Settings | Not needed | Not needed | Not needed | Not needed | Roles card is static |

P's wording for these states is readable and could be reused. B's state wording can't be read.

## 6. Roles and permissions

**R is the only approved role model.** P's F05 permission grid differs from it:

| Item | R (approved) | P F05 grid | Gap |
| --- | --- | --- | --- |
| Main Admin / Owner | Publishes approved content | Full access, including workspace settings and ownership; one per workspace | P adds workspace settings and ownership |
| Admin | Publishes approved content | Manages team access and every content area; invites and deactivates members, except the Owner; assigns roles, except the Owner; publishes | P adds team-management permissions not in R |
| Content Editor | Can: create and edit content; manage sources, product information and partner content; submit for review. Cannot: approve, publish independently, manage team members, assign roles | "Creates and edits drafts. Cannot approve or publish." Grid: create and edit content Yes; view metrics Yes; everything else No | P has no rows for "manage sources …" or "submit for review", and adds "view metrics" |
| Reviewer | Can: review assigned content, add notes, approve items, request changes. Cannot: publish independently, manage team members, assign roles, edit core content | Matches, and adds "review claims, safety language, sources and disclosures" and "view metrics" | P adds two permissions |

**Proposal:** build P's grid layout, filled only from R's wording, until Team 03 approves the extra rows (**D15**). No permission is enforced.

## 7. Theme behavior

**T is merged and stays as is:**
- The Theme menu sits beside the profile area.
- System is the default.
- The choice is saved on the device and applied before first paint.
- Token values are unchanged.

| P difference | Proposal |
| --- | --- |
| Sun and moon icon button | Keep the text button unless an icon set is formally approved (D6) |
| Falls back to Light when nothing is saved | Keep System (approved) |
| Appearance control also in the profile menu (F13) | Add it if D11 approves the profile menu. Both controls would share one saved choice |
| Sidebar stays green in dark mode | Keep the Oct 27 decision (D7 resolved) |

## 8. Unresolved decisions

| # | Decision |
| --- | --- |
| D1 | **RESOLVED (Nov 5):** P for the shell and Team Access flows; A1 to A5 for content screens; B for layout reference only (section 0) |
| D2 | **RESOLVED for this sprint:** keep the current sidebar destinations |
| D3 | **RESOLVED:** keep the blue active treatment |
| D4 | **RESOLVED (Nov 5):** the breadcrumb is in the top bar, starts with "Admin", and the back links are removed. This settles C2 and C3. Built in Slice 1 (`shell-alignment-implementation.md`) |
| D5 | **RESOLVED (Nov 6):** follow the prototype's Dashboard layout and hierarchy, keeping the current approved content and behavior. No role-based Dashboard. Built in Slice 2 (`dashboard-alignment-implementation.md`) |
| D6 | **Partly resolved:** no icons unless an icon set is formally approved, and the theme control stays text-based. **Still open:** whether to approve an icon set at all (it would affect the tablet icon strip, search and status chips) |
| D7 | **RESOLVED:** keep the approved dark-mode sidebar |
| D8 | Names: "Product Catalog" vs "Product Information"; "Content Management" vs "Commercial Content" |
| D9 | Where Branch & Routing Rules and Guidance Connection Detail belong, and what Guidance Rules Review should show |
| D10 | Approve the new routes in section 2b |
| D11 | **Partly resolved (Nov 5):** the profile menu has the identity line and Appearance only; no Sign out, Team Access, workspace or role switching. **Still open:** top-bar search |
| D12 | Scope checks: App Activity Detail (analytics), Guest + Account States and Account Support must stay within the approved limited views |
| D13 | Charts on Content Metrics: CSS-only bars with token colors (no library), or leave them out |
| D14 | Detail panel below 1280 px: under the list, or as its own page |
| D15 | Permission grid: approve P's extra rows, or show R only |
| D16 | **Partly resolved:** no unapproved illustrations. **Still open:** the "View as" role switcher, the "PROTOTYPE · SAMPLE DATA" label and the workspace card |

## 9. Suggested build order (after review)

Each step would be its own reviewed commit or pull request on this branch.

1. **Shell:**
   - Breadcrumb in the top bar.
   - Back links removed.
   - Profile menu with Appearance.
   - Sidebar kept as decided (D2, D3, D7): current destinations, blue active item, approved dark-mode sidebar.
   - Responsive top bar.
2. **Shared patterns:** detail panel, filter chips, tabs, status chips. Previewed on `/dev/`.
3. **Existing screens:** Dashboard (D5), Review Tasks, then the content lists, one at a time.
4. **Team Access and Roles** (static), with the access denied preview state.
5. **Detail routes** from section 2b, once approved.

**Unchanged at every step:**
- No Supabase, sign-in, live permissions, invitations or account creation.
- No new dependencies unless approved.
- No token value changes.
- No logo or artwork changes.
- No Cuidance Mobile work.
