# Week 10 Step 2: Admin Web route map

A structural navigation pass. Each approved Admin Web screen now has a Next.js route that shows only its title, its parent (breadcrumb), a short scope note and working links. **No screen content, data, Supabase, authentication or backend logic was built.**

- **Branch:** `feat/admin-web-route-map`, from `main` at `3df35a0`
- **Date:** Oct 27, 2026 (Guidance Content added the same day)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme**, especially the open decisions in `docs/Week-10/admin-web-source-reconciliation.md`.

## Sources

- **The five current Team 03 hi-fi screen images** (Dashboard, Quiz Content, Guidance Content, Product Information, Claims & Safety Review). They are the visual source of truth for those screens.
- **For every other screen,** the approved screen-name list and current CLAUDE.md terminology only.
- **The older wireframe PDF** (`T03_CuidanceAdminWeb_HiFiScreens_v01_ART646.pdf`) **is no longer a source.** The first version of this route map used it. The open questions that came from it are replaced by the reconciliation report.

`docs/Week-10/admin-web-source-reconciliation.md` holds the full comparison, the evidence label for each screen, and the decisions waiting on Team 03.

## 1. Route map

Dashboard is the landing page. Content is the only parent with child pages.

```
/                                  Dashboard
├── /content/                      Content
│   ├── /content/quiz-content/          Quiz Content
│   ├── /content/guidance-content/      Guidance Content
│   ├── /content/product-information/   Product Information
│   ├── /content/knowledge-sources/     Knowledge Sources
│   ├── /content/partner-highlights/    Partner Highlights
│   └── /content/commercial-content/    Commercial Content
├── /guidance-rules-review/        Guidance Rules Review
├── /claims-safety-review/         Claims & Safety Review
├── /content-metrics/              Content Metrics
├── /account-support/              Account Support
├── /review-tasks/                 Review Tasks
└── /settings/                     Settings
```

Unchanged and outside the route map: `/dev/` (internal component preview, reachable by URL only) and the custom 404 page.

On GitHub Pages every path starts with `/Cuidance_Admin` (for example `/Cuidance_Admin/content/quiz-content/`).

## 2. Screens, routes and evidence

Evidence labels come from the reconciliation report: **VERIFIED** (visible in a current hi-fi image), **STRUCTURAL ONLY** (approved name, no current image) and **NEEDS TEAM CONFIRMATION** (the source is missing or conflicts with the route).

| Screen | Route | Parent | File | Evidence |
| --- | --- | --- | --- | --- |
| Dashboard | `/` | (landing page) | `admin-web/app/page.tsx` | VERIFIED |
| Content | `/content/` | Dashboard | `admin-web/app/content/page.tsx` | VERIFIED as the parent (breadcrumbs on the Content screens) |
| Quiz Content | `/content/quiz-content/` | Content | `admin-web/app/content/quiz-content/page.tsx` | VERIFIED |
| Guidance Content | `/content/guidance-content/` | Content | `admin-web/app/content/guidance-content/page.tsx` | VERIFIED. **Added Oct 27, 2026** |
| Product Information | `/content/product-information/` | Content | `admin-web/app/content/product-information/page.tsx` | VERIFIED |
| Knowledge Sources | `/content/knowledge-sources/` | Content | `admin-web/app/content/knowledge-sources/page.tsx` | NEEDS TEAM CONFIRMATION (parent) |
| Partner Highlights | `/content/partner-highlights/` | Content | `admin-web/app/content/partner-highlights/page.tsx` | NEEDS TEAM CONFIRMATION (parent) |
| Commercial Content | `/content/commercial-content/` | Content | `admin-web/app/content/commercial-content/page.tsx` | NEEDS TEAM CONFIRMATION (not in the current source) |
| Guidance Rules Review | `/guidance-rules-review/` | Dashboard | `admin-web/app/guidance-rules-review/page.tsx` | STRUCTURAL ONLY |
| Claims & Safety Review | `/claims-safety-review/` | Dashboard | `admin-web/app/claims-safety-review/page.tsx` | VERIFIED (breadcrumb wording waits on a Team 03 decision) |
| Content Metrics | `/content-metrics/` | Dashboard | `admin-web/app/content-metrics/page.tsx` | STRUCTURAL ONLY |
| Account Support | `/account-support/` | Dashboard | `admin-web/app/account-support/page.tsx` | STRUCTURAL ONLY |
| Review Tasks | `/review-tasks/` | Dashboard | `admin-web/app/review-tasks/page.tsx` | STRUCTURAL ONLY |
| Settings | `/settings/` | Dashboard | `admin-web/app/settings/page.tsx` | STRUCTURAL ONLY. No Team Access route |

### Guidance Content against its hi-fi reference

| Element | Hi-fi reference | Built | Note |
| --- | --- | --- | --- |
| Title | Guidance Content | Guidance Content | Matches |
| Parent | Content (breadcrumb "Admin / Content / Guidance Content") | Content | Matches |
| Order under Content | After Quiz Content (Quiz Content sidebar and Dashboard Key Areas) | Second, after Quiz Content | Matches |
| Description | "Review educational articles, care guidance, and explanations that help people make better-informed choices." | Same text, as the scope note | Matches |
| Breadcrumb root | Admin | Dashboard | Kept the same as every other screen. Breadcrumb wording isn't changed for one screen (decision C2) |
| Eyebrow | INTERNAL TOOL | Content | Same pattern as the other Content pages (screen-build step) |
| Back link | None shown | ‹ Back to Content | Kept the same as every other screen (decision C3) |
| Search, status filter, "Add guidance", table, detail panel | Shown | Not built | Data, editing and detail views are out of scope for this pass |

Names, parents and scope notes are defined once in `shared/content/admin-web-screens.ts`. Every route file renders the same structure through `admin-web/app/_screens/ScreenPage.tsx`, which only combines the existing PageHeader, Breadcrumb, Card and ButtonLink components. The `_screens` folder is private, so Next.js doesn't treat it as a route.

## 3. Sidebar, parents, children and back links

**Persistent sidebar: CONFIRMED by Team 03 (Oct 27, 2026)** and implemented in `admin-web/components/layout/Sidebar.tsx`, used by the root layout. The full implementation notes are in "Persistent sidebar" in `docs/Week-10/admin-web-source-reconciliation.md`.

**Sidebar items, in order:**

1. Dashboard (landing page)
2. Content (opens and closes with its toggle)
   - Quiz Content
   - Guidance Content
   - Product Information
   - Knowledge Sources
   - Partner Highlights
3. Guidance Rules Review
4. Claims & Safety Review
5. Content Metrics
6. Account Support
7. Review Tasks
8. Settings

Commercial Content keeps its route and stays a Content page, but it isn't in the sidebar until Team 03 confirms it.

| Behavior | Desktop and tablet (768 px and up) | Narrow (under 768 px) |
| --- | --- | --- |
| Sidebar | Always visible, 240 px, beside the page | Top bar with the logo and a Menu button. Menu shows the same list |
| Active page | Blue pill, bolder label, `aria-current="page"` | Same, inside the Menu list |
| Content | Open on Content pages, closed elsewhere. The toggle opens and closes it | Same |
| Without JavaScript | Everything visible | Everything visible, with no Menu button |

The Dashboard's section links, the breadcrumbs and the back links all stay as they were.

**Parent pages and their children:**

| Parent | Children |
| --- | --- |
| Dashboard | Content, Guidance Rules Review, Claims & Safety Review, Content Metrics, Account Support, Review Tasks, Settings |
| Content | Quiz Content, Guidance Content, Product Information, Knowledge Sources, Partner Highlights, Commercial Content |

**What each screen shows:**

| Screen | Breadcrumb | Eyebrow | Back link | Other links |
| --- | --- | --- | --- | --- |
| Dashboard | (none) | Internal tool | (none) | Open link to each top-level section |
| Content | Dashboard / Content | (none) | ‹ Back to Dashboard | Open link to each child page |
| Content child pages (6) | Dashboard / Content / *page* | Content | ‹ Back to Content | Quiz Content also links to Review Tasks |
| Other top-level pages (6) | Dashboard / *page* | (none) | ‹ Back to Dashboard | (none) |

The last breadcrumb item is the current page (`aria-current="page"`, not a link). Back links use the ghost button style, and Open and Go to links use the secondary style. No structural page has a primary button.

## 4. Critical path

The sidebar now reaches every page directly. The critical path below uses the page links and back links, and still works.


**Dashboard → Content → Quiz Content → Review Tasks → Dashboard**

1. **Dashboard:** select **Open Content**.
2. **Content:** select **Open Quiz Content**.
3. **Quiz Content:** select **Go to Review Tasks** (under "Related").
4. **Review Tasks:** select **‹ Back to Dashboard**.

Tested by clicking through in both builds (site root and `/Cuidance_Admin/`). Every step lands on the expected page.

## 5. Open decisions for Team 03

The open questions from the first version came from the older wireframe PDF, so they've been removed. The current open decisions (C1 to C9) are in `docs/Week-10/admin-web-source-reconciliation.md`. Resolved: the sidebar items (C1, CONFIRMED) and the Knowledge Sources and Partner Highlights parents (C6, CONFIRMED through the sidebar). Still open: breadcrumb root and labels, back links, the Content landing page, Commercial Content, Team Access, and any other Content children.

## Verification

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed |
| `npm run build` | Passed. 14 route-map screens (13 at first, plus Guidance Content), `/dev` and `/_not-found` exported as static pages |
| GitHub Pages build (`GITHUB_PAGES=true`) | Passed. Every link includes `/Cuidance_Admin/` |
| Every route loads | 240 browser loads: 2 builds × 15 pages × 4 widths × 2 modes. Every route returned 200 (the 404 page returned 404) with the right title |
| `npm run dev` | All 15 paths load with the right title. No console errors in light or dark mode |
| Breadcrumbs | Correct trail and current page on every screen |
| Back links | All 12 back links land on the right parent, in both builds |
| Breadcrumb links | "Content" and "Dashboard" crumbs land on the right pages |
| Critical path | Passed in both builds (see section 4) |
| Keyboard | Logical Tab order with a visible focus ring on the Dashboard (7 stops), Content (7) and Quiz Content (4) |
| Horizontal overflow | None at 1440, 834, 390 or 320 px |
| Light and dark mode | Token backgrounds and the matching logo on every page |
| Touch targets | No link or button under 44 × 44 px |
| Primary buttons | At most one per page (none on the structural pages) |
| JavaScript errors | None |
| Wording | No banned words, em dashes or `#` links. "Diagnosis" appears only in the boundary note "No diagnosis or medical review" and the existing `/dev/` helper text |
| Guidance Content (added Oct 27, 2026) | 16 loads: 2 builds × 4 widths (1440, 834, 390, 320) × light and dark. Right title, breadcrumb and back link, no overflow, no target under 44 px, no errors. Click-through Dashboard → Content → Guidance Content → Back to Content works in both builds. Content lists it second, after Quiz Content. Keyboard: Dashboard, Content, Back to Content, each with the focus ring |
| Persistent sidebar (added Oct 27, 2026) | 256 loads: 2 builds × 16 pages (every route, `/dev/` and the 404 page) × 4 widths × light and dark. **0 problems.** Right sidebar items, one highlighted item on each sidebar page (none on Commercial Content, `/dev/` and 404), right Content state, 240 px and sticky at 1440 and 834, Menu at 390 and 320, logo in the sidebar, no overflow, nothing under 44 px, active pill contrast and sidebar text contrast above 4.5 : 1, no errors |
| Sidebar interactions | Content toggle opens and closes on the Dashboard and on a Content page. Sidebar links (Knowledge Sources, Review Tasks) land on the right page and highlight it. Menu opens and closes at 320 px, with no overflow, and its links work. All 13 back links still land on the right parent. Passed in both builds |
| Sidebar keyboard | Tab order: Skip to main content, the sidebar items in order (with the toggle after Content), then the page. The focus ring shows on every sidebar stop in both modes. Skip link moves focus to the page. Enter and Space work the toggle. Enter works Menu |
| No JavaScript | Sidebar fully visible at 1440 and 320 px (13 links). Menu and toggle hidden. No overflow |
| `npm run dev` | All 16 paths load. No console errors, warnings or hydration mismatches in light or dark mode |
| Dependencies | None added. `package.json` and the lockfile are unchanged |
| Tokens, logo, favicon, components | Unchanged |

## Evidence

Screenshots in `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `routes-dashboard-1440-light.png` | Dashboard with links to each section |
| `routes-content-1440-light.png`, `routes-content-1440-dark.png` | Content parent page with all six children, both modes |
| `routes-guidance-content-1440-light.png`, `routes-guidance-content-1440-dark.png` | Guidance Content on desktop, both modes |
| `routes-guidance-content-320-dark.png` | Guidance Content at 320 px |
| `routes-quiz-content-320-dark.png` | Quiz Content child page at 320 px |
| `routes-review-tasks-1440-light.png` | Review Tasks top-level page |
| `routes-claims-safety-review-320-dark.png` | Claims & Safety Review at 320 px |
| `routes-focus-quiz-content-dark.png` | Focus ring on the first breadcrumb link (before the sidebar) |
| `sidebar-quiz-content-1440-light.png`, `sidebar-quiz-content-1440-dark.png` | Sidebar with Content open and Quiz Content active, both modes |
| `sidebar-claims-safety-review-834-light.png` | Sidebar at tablet width, Content closed, Claims & Safety Review active |
| `sidebar-dashboard-390-menu-closed-light.png` | Narrow width with the Menu closed |
| `sidebar-quiz-content-320-menu-open-dark.png` | Menu open at 320 px, dark mode |
| `sidebar-dashboard-content-expanded-light.png` | Dashboard with Content opened from the toggle |
| `sidebar-focus-toggle-light.png` | Focus ring on the Content toggle |
| `sidebar-commercial-content-1440-light.png` | Commercial Content: route kept, not in the sidebar, nothing highlighted |
