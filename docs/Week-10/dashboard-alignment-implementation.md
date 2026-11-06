# Prototype alignment, Slice 2: Dashboard

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Plan:** `docs/Week-10/prototype-alignment-map.md`, step 2.

## 1. D5 decision (Team 03, Nov 6, 2026)

- **Layout and hierarchy:** follow the readable prototype's Dashboard (F08).
- **Content and behavior:** keep the current approved Dashboard content and behavior.
- **Content source:** the current Dashboard and its existing evidence.
- **Not used:** the unreadable PDF supplies no wording.
- **Not added:** role-based Dashboard behavior and the prototype's own data (welcome line, invitation tiles, Your access list).

## 2. What changed

| Part | Before | Now (following F08) |
| --- | --- | --- |
| Page header | Eyebrow, title, description, sample-data note | Unchanged |
| Review Queue | One large card holding the heading, the four counts and the button side by side | **A header row:** "REVIEW QUEUE" label and its description on the left, **View review tasks** on the right. **Then four standalone count tiles in a row**, as in the prototype. Counts unchanged: 3, 1, 1 and 0 |
| Needs attention | A large serif heading, a link, then the table panel | **One panel:** a header bar ("NEEDS ATTENTION", its description, and **View all review tasks** on the right), then the table inside it. The table is unchanged: same caption, columns, rows and labels |
| Key Areas | A large serif heading, then six separate cards | **One panel:** a header bar ("KEY AREAS" and its description), then six link tiles. Same names, descriptions and links; the whole tile is still the link |
| Reminder card | Unchanged | Unchanged |
| Spacing | 48 px between sections | One gutter between blocks (24 px on desktop and tablet, 16 px on phones), and 16 px between tiles, as in the prototype |
| Order | Review Queue, Key Areas, Needs attention, reminder | Review Queue, **Needs attention**, **Key Areas**, reminder. The prototype puts the work list right after the counts |

**States are unchanged:**
- **Loading:** ⋯ in the tiles plus the status message.
- **Empty:** 0 in the tiles plus ◌ and Go to Review Tasks.
- **Error:** ⚠ in the tiles plus the Dark Ruby alert.

The empty, error and loading panels now sit inside the Needs attention panel.

**Responsive:**

| Width | Tiles | Key Areas | Header rows |
| --- | --- | --- | --- |
| 1280 px and up | 4 across | 3 across | Action on the right |
| 768 to 1279 px | 4 across | 1 column | Action on the right, or under the description when narrow |
| Under 768 px | 2 by 2 | 1 column | Action under the description |

The table scrolls inside its panel when narrow.

**Shared component:** `DataTable` has a new `flush` option, so a table can sit inside a panel that draws its own border. Everywhere else it looks the same as before.

## 3. PROVISIONAL

| Item | Why |
| --- | --- |
| Section order (Needs attention before Key Areas) | Follows the prototype's hierarchy. The earlier order came from hi-fi image A1 |
| Panel and tile corners stay 16 px | The prototype uses about 8 px, but the board's card token is `--radius-medium` (16 px) |
| Count tiles keep the board's 32 px number style | The prototype uses about 28 px |
| Page side margins stay 64 px (desktop) | The prototype uses about 32 px. The margins are a layout token shared by every screen |
| Key Areas tiles are bordered link tiles inside the panel | The prototype has no Key Areas. They follow its "Your access" action list |
| No icons in the tiles or panel headers | The prototype's icons come from an unapproved icon library (D6) |
| Empty and Loading designs | Still provisional on the board |

## 4. Files

| File | Change |
| --- | --- |
| `admin-web/app/_dashboard/DashboardContent.tsx` | New structure: Review Queue header and tiles, Needs attention panel, Key Areas panel |
| `admin-web/app/_dashboard/dashboard.module.css` | Rewritten for the prototype hierarchy. Tokens only |
| `admin-web/components/data/DataTable.tsx`, `.module.css` | New `flush` option |

**Unchanged:** wording (`shared/content/dashboard-review-queue.ts`), sample data, links, routes, tokens, assets and dependencies.

## 5. Test results

| Check | Result |
| --- | --- |
| TypeScript, production build, GitHub Pages build | All passed |
| Full browser suite | **352 loads, 0 problems** (2 builds × 22 pages × 4 widths × light and dark). Dashboard checks include: counts in all four states; 5 rows when ready and 0 otherwise; the six Key Areas; exactly one primary button (View review tasks); the state symbols hidden from screen readers; no em dashes |
| Dashboard links | View review tasks, View all review tasks, and a click on the corner of a Key Area tile all land on the right page, in both builds. All 18 breadcrumb links work |
| Theme tests | 0 failures: System, manual Light and Dark against the device, persistence, the profile Appearance choice |
| Keyboard and focus | Order: skip link, top bar, sidebar, View review tasks, View all review tasks, the table, the six Key Areas. A visible ring on every stop, in light and dark |
| Responsive audit | 12 widths from 1440 to 320 px, both builds: no sideways scrolling, nothing spilling out of its box, no target under 44 px |
| Contrast | Every Dashboard text at least 5.4:1 in light and 7.5:1 in dark, at 1440 and 390 px |
| No JavaScript | The seeded Dashboard shows (counts 3, 1, 1 and 0; 5 rows; Key Areas) at 1440 and 320 px, with no overflow |
| Hydration | No warnings in the dev server for all four Dashboard states, or for the other main pages, in each theme setting |

## 6. Screenshots

In `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `dashboard-compare-1440-light.png`, `dashboard-compare-1440-dark.png` | Prototype F08 beside this Dashboard, desktop |
| `dashboard-compare-834-light.png`, `dashboard-compare-834-dark.png` | Tablet |
| `dashboard-compare-390-light.png`, `dashboard-compare-390-dark.png` | Phone |
| `dashboard-aligned-{1440,834,390}-{light,dark}.png` | This Dashboard, full page |
| `dashboard-aligned-empty-1440-light.png`, `dashboard-aligned-loading-1440-light.png`, `dashboard-aligned-error-1440-dark.png` | Preview states |

**Differences from the prototype that remain on purpose:**
- The approved content (no welcome line, role badge, invitations or role-based lists).
- The blue active sidebar item and the light dark-mode sidebar.
- No icons.
- The token sizes listed in section 3.
