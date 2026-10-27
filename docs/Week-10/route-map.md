# Week 10 Step 2: Admin Web route map

A structural navigation pass. Each approved Admin Web screen now has a Next.js route that shows only its title, its parent (breadcrumb), a short scope note and working links. **No screen content, data, Supabase, authentication or backend logic was built.**

- **Branch:** `feat/admin-web-route-map`, from `main` at `3df35a0`
- **Date:** Oct 27, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme**, especially the open questions at the end.

## Sources

- The screen list and names in the Week 10 Step 2 request, which match the terms in CLAUDE.md (Product Information, Partner Highlights, Commercial Content, Account Support, Content Metrics).
- The Admin Web hi-fi wireframes (`T03_CuidanceAdminWeb_HiFiScreens_v01_ART646.pdf`), checked for names and hierarchy. **The PDF has no text layer, and its small text is pixelated in the file itself**, so wireframe names below are best readings and are marked "(best reading)" where unsure. Where the request and the wireframes differ, the request was followed and the difference is listed under "Open questions for Team 03".

## 1. Route map

Dashboard is the landing page. Content is the only parent with child pages.

```
/                                  Dashboard
├── /content/                      Content
│   ├── /content/quiz-content/          Quiz Content
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

## 2. Wireframe screens and routes

| Screen (route name) | Route | Parent | File | Wireframe name or group |
| --- | --- | --- | --- | --- |
| Dashboard | `/` | (landing page) | `admin-web/app/page.tsx` | Dashboard group: Review Queue (default view) |
| Content | `/content/` | Dashboard | `admin-web/app/content/page.tsx` | "Content" in the sidebar (parent item) |
| Quiz Content | `/content/quiz-content/` | Content | `admin-web/app/content/quiz-content/page.tsx` | Quiz Content |
| Product Information | `/content/product-information/` | Content | `admin-web/app/content/product-information/page.tsx` | **Product Catalog** |
| Knowledge Sources | `/content/knowledge-sources/` | Content | `admin-web/app/content/knowledge-sources/page.tsx` | Knowledge Sources |
| Partner Highlights | `/content/partner-highlights/` | Content | `admin-web/app/content/partner-highlights/page.tsx` | **Partner & Commercial Content: Highlights** |
| Commercial Content | `/content/commercial-content/` | Content | `admin-web/app/content/commercial-content/page.tsx` | **Partner & Commercial Content: Management** |
| Guidance Rules Review | `/guidance-rules-review/` | Dashboard | `admin-web/app/guidance-rules-review/page.tsx` | **Guidance Rules** (sidebar); Guidance Correction Detail (best reading) |
| Claims & Safety Review | `/claims-safety-review/` | Dashboard | `admin-web/app/claims-safety-review/page.tsx` | **Claims & Safety** (sidebar); Claim Review Detail |
| Content Metrics | `/content-metrics/` | Dashboard | `admin-web/app/content-metrics/page.tsx` | **Metrics**, under Dashboard; App Activity Report (best reading) |
| Account Support | `/account-support/` | Dashboard | `admin-web/app/account-support/page.tsx` | **Accounts**, under Settings ("Support page · internal only", best reading) |
| Review Tasks | `/review-tasks/` | Dashboard | `admin-web/app/review-tasks/page.tsx` | **Review Tasks**, under Dashboard; Review Task Detail |
| Settings | `/settings/` | Dashboard | `admin-web/app/settings/page.tsx` | Settings (parent of Accounts and Team Access) |

Names, parents and scope notes are defined once in `shared/content/admin-web-screens.ts`. Every route file renders the same structure through `admin-web/app/_screens/ScreenPage.tsx`, which only combines the existing PageHeader, Breadcrumb, Card and ButtonLink components. The `_screens` folder is private, so Next.js doesn't treat it as a route.

## 3. Tabs, parents, children and back links

No sidebar or tab bar was built: navigation components aren't in the approved component inventory yet. The top-level items below are the future navigation tabs. For now, the Dashboard links to each one.

**Top-level navigation items (future tabs), in order:**

1. Dashboard (landing page)
2. Content
3. Guidance Rules Review
4. Claims & Safety Review
5. Content Metrics
6. Account Support
7. Review Tasks
8. Settings

**Parent pages and their children:**

| Parent | Children |
| --- | --- |
| Dashboard | Content, Guidance Rules Review, Claims & Safety Review, Content Metrics, Account Support, Review Tasks, Settings |
| Content | Quiz Content, Product Information, Knowledge Sources, Partner Highlights, Commercial Content |

**What each screen shows:**

| Screen | Breadcrumb | Eyebrow | Back link | Other links |
| --- | --- | --- | --- | --- |
| Dashboard | (none) | Internal tool | (none) | Open link to each top-level section |
| Content | Dashboard / Content | (none) | ‹ Back to Dashboard | Open link to each child page |
| Content child pages (5) | Dashboard / Content / *page* | Content | ‹ Back to Content | Quiz Content also links to Review Tasks |
| Other top-level pages (6) | Dashboard / *page* | (none) | ‹ Back to Dashboard | (none) |

The last breadcrumb item is the current page (`aria-current="page"`, not a link). Back links use the ghost button style, and Open and Go to links use the secondary style. No structural page has a primary button.

## 4. Critical path

**Dashboard → Content → Quiz Content → Review Tasks → Dashboard**

1. **Dashboard:** select **Open Content**.
2. **Content:** select **Open Quiz Content**.
3. **Quiz Content:** select **Go to Review Tasks** (under "Related").
4. **Review Tasks:** select **‹ Back to Dashboard**.

Tested by clicking through in both builds (site root and `/Cuidance_Admin/`). Every step lands on the expected page.

## 5. Open questions for Team 03

Each one is an ambiguity between the wireframes and the requested route list. The routes follow the request until Team 03 decides.

1. **Product Information or Product Catalog.** The wireframe names the screen "Product Catalog". The route uses "Product Information" (CLAUDE.md and the request).
2. **Partner Highlights and Commercial Content: one item or two.** The wireframe has one sidebar item, "Partner & Commercial Content", with two views (Highlights and Management). The routes are two separate Content children, as requested.
3. **The "Review" suffix.** The wireframe sidebar says "Guidance Rules" and "Claims & Safety". The routes say "Guidance Rules Review" and "Claims & Safety Review".
4. **Where Review Tasks and Content Metrics sit.** In the wireframe, Review Tasks and Metrics are under Dashboard (Dashboard > Review Queue, Review Tasks, Metrics). The routes make them top-level items, and the metrics screen is named "Content Metrics".
5. **Where Account Support sits.** In the wireframe, "Accounts" is under Settings. The route is a top-level "Account Support" item.
6. **Team Access.** The wireframe has a Team Access screen under Settings. It isn't in the requested list, so no route was made. Confirm whether it's in scope, and that it's internal team access only, not public account management.
7. **Review Queue.** The wireframe shows Review Queue as the Dashboard's default view. The route map treats it as the Dashboard (`/`), with no separate route.
8. **Detail and sub-screens.** The wireframes include detail and sub-screens with no route yet: Quiz Question Detail, Branch & Routing Rules, Quiz Configuration, Result Content Record, a guest and account status screen (best reading), Guidance Correction Detail, Claim Review Detail, Review Task Detail and App Activity Report. They need routes when their screens are built. Names need the source file, because the PDF text is unreadable at that size.
9. **Breadcrumb root label.** The wireframe top bar appears to start with "Admin". The routes start with "Dashboard", because it's the landing page. `/dev/` still starts with "Admin". Pick one.
10. **Navigation component.** The wireframes show a persistent sidebar. It isn't in the approved component inventory, so it wasn't built. Navigation works through the Dashboard and Content links and the back links for now.

## Verification

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed |
| `npm run build` | Passed. 13 route-map screens plus `/dev` and `/_not-found` exported as static pages |
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
| Dependencies | None added. `package.json` and the lockfile are unchanged |
| Tokens, logo, favicon, components | Unchanged |

## Evidence

Screenshots in `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `routes-dashboard-1440-light.png` | Dashboard with links to each section |
| `routes-content-1440-light.png`, `routes-content-1440-dark.png` | Content parent page, both modes |
| `routes-quiz-content-320-dark.png` | Quiz Content child page at 320 px |
| `routes-review-tasks-1440-light.png` | Review Tasks top-level page |
| `routes-claims-safety-review-320-dark.png` | Claims & Safety Review at 320 px |
| `routes-focus-quiz-content-dark.png` | Focus ring on the first breadcrumb link |
