# Cuidance Admin Web: architecture

_Last updated: Nov 6, 2026 (Week 11 start, on `feat/week-11-review-task-loop`). Planned Week 11 parts are marked **PLANNED**; nothing marked PLANNED is built yet._

How Admin Web is put together, in plain words. Read this with `CLAUDE.md` (the rules) and `docs/Week-11/close-the-loop-implementation-plan.md` (the current plan).

**Keep this file current.** Update it in the same pull request whenever a screen, route, shared store or data file is added or removed. Week 11 adds three new screens, so this file is updated with each of those pull requests.

## 1. What it is

- An **internal** browser tool for the Cuidance team to review and maintain content. Not public, not a portal for providers, brands or retailers.
- **Next.js 16 with TypeScript (strict)**, React 19. No other dependencies.
- **A static website.** `next build` turns every screen into a plain HTML page (`output: 'export'`), and GitHub Pages serves them. There is no server code, no database and no sign-in.
- **Data is seeded.** Every screen shows typed sample data from `shared/`. Supabase is planned but **not connected** (CLAUDE.md "Not yet").

## 2. Folders

```
Cuidance_Admin/
├── admin-web/                 The app
│   ├── app/                   One folder per route (page.tsx), plus private folders starting with _
│   │   ├── page.tsx           Dashboard (/)
│   │   ├── content/…          Content and its six child screens
│   │   ├── review-tasks/      Review Tasks
│   │   ├── …                  The other top-level screens
│   │   ├── _screens/          Shared screen frame (ScreenPage) and panel styles
│   │   ├── _review/           Status and priority labels shared by Dashboard and Review Tasks
│   │   ├── _listDetail/       Shared list-and-details pieces (StatusChip, NoResults)
│   │   ├── _dashboard/, _reviewTasks/, _quiz/, …   One private folder per built screen
│   │   ├── dev/               Internal component preview (URL only)
│   │   └── not-found.tsx      Custom 404
│   └── components/            One shared component per pattern (layout, ui, forms, data, feedback, content)
├── shared/                    Defined once, used everywhere
│   ├── content/               Screen names, wording and seed data, one file per screen
│   ├── design-tokens/         tokens.css (colors light and dark, type, spacing, radius, stroke)
│   └── brand/logo/            Approved Logo Version 4 files only
├── docs/                      Week 10 and Week 11 notes, maps and evidence
├── ARCHITECTURE.md            This file
├── CLAUDE.md                  Rules for AI agents
└── .github/                   PR template, GitHub Pages deploy workflow
```

Folders starting with `_` inside `app/` are private: Next.js doesn't make routes from them.

## 3. Routes

Names, paths, parents and scope notes are defined once in `shared/content/admin-web-screens.ts`. The sidebar, breadcrumbs and links all read from there.

| Route | Screen | Status |
| --- | --- | --- |
| `/` | Dashboard | Built (Week 10) |
| `/content/` | Content | Built (Week 10) |
| `/content/quiz-content/` | Quiz Content | Built (Week 10) |
| `/content/guidance-content/` | Guidance Content | Built (Week 10) |
| `/content/product-information/` | Product Information | Built (Week 10) |
| `/content/knowledge-sources/` | Knowledge Sources | Built (Week 10) |
| `/content/partner-highlights/` | Partner Highlights | Built (Week 10) |
| `/content/commercial-content/` | Commercial Content | Built (Week 10, layout PROVISIONAL) |
| `/guidance-rules-review/` | Guidance Rules Review | Built (Week 10) |
| `/claims-safety-review/` | Claims & Safety Review | Built (Week 10) |
| `/content-metrics/` | Content Metrics | Built (Week 10) |
| `/account-support/` | Account Support | Built (Week 10) |
| `/review-tasks/` | Review Tasks | Built (Week 10) |
| `/settings/` | Settings / Team Access | Built (Week 10) |
| `/review-tasks/[taskId]/` | Review Task Detail | **PLANNED** (Week 11, feature 1). One page per seeded task, built ahead with `generateStaticParams` |
| `/accept-invitation/` | Accept Invitation | **PLANNED** (Week 11, feature 2) |
| `/account-setup/` | Account Setup | **PLANNED** (Week 11, feature 3) |
| `/dev/` | Component preview | Internal, URL only |

**GitHub Pages:** every path starts with `/Cuidance_Admin` there. `next.config.ts` sets this when `GITHUB_PAGES=true`, and plain `<a href>` links add it from `NEXT_PUBLIC_BASE_PATH`. Local builds use the site root.

**Links reload the page.** Screens link with plain `<a href>`, so moving between screens loads a fresh page. Anything that has to survive from one screen to the next is kept in browser storage (section 5).

## 4. How a screen is built

1. **Route file** (`app/<route>/page.tsx`): a server component. It sets the page title and puts the screen inside `ScreenPage` (eyebrow, title, scope note) or, for the Dashboard, `PageHeader`.
2. **Wording and seed data** (`shared/content/<screen>.ts`): every label, message and sample row. Screens never hard-code copy.
3. **Screen view** (`app/_<screen>/<Screen>View.tsx`): a client component with the interactive parts (search, filters, row selection, details panel).
4. **State preview** (`app/_<screen>/<Screen>StateFromUrl.tsx`): reads `?state=loading`, `?state=empty` or `?state=error` so reviewers can see each state. Any other address shows the seeded data.
5. **Styles** (`app/_<screen>/<screen>.module.css`): CSS Modules using tokens from `shared/design-tokens/tokens.css` only.
6. **Without JavaScript:** the built HTML already shows the seeded list and the first item's details. Controls that can't work without JavaScript are hidden.

**Shell** (`components/layout/AdminShell.tsx`, used by the root layout): top bar (breadcrumb starting "Admin", Theme menu, profile menu), persistent sidebar, then the page. Under 768 px the sidebar becomes a Menu.

## 5. State

| State | Owner | Kept in | Notes |
| --- | --- | --- | --- |
| Seed data | `shared/content/*.ts` | Built into the pages | Same on every load |
| Preview state (`?state=`) | Each screen's `StateFromUrl` | The address | Review aid only |
| Screen state (search, filters, selected row, menus) | Each screen | Memory | Lost when you leave the page |
| Theme (Light, Dark, System) | `components/layout/themeStore.ts` | Local storage `cuidance-admin-theme` | Applied before paint by a small script in the root layout |
| **Review decisions** | **PLANNED** `app/_reviewLoop/reviewStore.ts`; rules in `shared/review-loop/` | Session storage (one tab) | Only Review Task Detail records decisions. Dashboard and Review Tasks read them |
| **Invitation and account setup** | **PLANNED** `app/_onboarding/onboardingStore.ts`; wording in `shared/content/` | Session storage (one tab) | Seeded; nothing sent anywhere |

**Stores follow one pattern** (the theme store): a small module with `subscribe`, a getter and a setter, read through React's `useSyncExternalStore`. The server build uses the plain seed, then the browser adds what's in storage after the page loads, so pages don't show hydration warnings.

**Derived, not duplicated (PLANNED):** current task status, Dashboard counts and the Needs attention list are worked out from seed + decisions by shared functions in `shared/review-loop/` (`applyDecisions`, `dashboardSummary`, `needsAttention`). No screen keeps its own copy.

## 6. Week 11 loop (PLANNED)

```
Accept Invitation → Account Setup → Review Tasks → Review Task Detail (decide)
                                                          ↓
                         Review Task Detail (decision shown) ← Dashboard (updated)
```

```
Review Task Detail ──record decision──▶ reviewStore ──saves──▶ session storage
                                           │
                     applyDecisions(seed, decisions)  (shared/review-loop)
                     ┌─────────────┬───────────────┬──────────────────┐
                     ▼             ▼               ▼
               Review Tasks    Dashboard     Review Task Detail
               (statuses)      (counts, rows) (status, history)
```

Full detail: `docs/Week-11/close-the-loop-implementation-plan.md`, sections 3 and 5.

## 7. Styling and accessibility

- Tokens only (`shared/design-tokens/tokens.css`), light and dark. No invented shadows.
- State rules from `shared/design-tokens/README.md`: Selected is Compass Blue plus a non-color sign; Error is Dark Ruby plus ⚠ and a message; Partner is Byzantium Plum plus a label; every state has text or a symbol.
- One primary button per screen. Buttons 12 × 24 px padding. Targets at least 44 px.
- Approved text symbols only (`shared/content/ui-symbols.ts`); no icon set yet.

## 8. Build, test and deploy

| Step | Command or place |
| --- | --- |
| Type check | `npx tsc --noEmit` in `admin-web/` |
| Local build | `npm run build` in `admin-web/` (output in `admin-web/out`) |
| GitHub Pages build | `GITHUB_PAGES=true npm run build` |
| Browser checks | Playwright scripts run by Claude Code during each feature (not committed): every route at 1440, 834, 390 and 320 px, light and dark, both builds; keyboard, contrast, 44 px targets, no JavaScript, hydration. Results go in each feature's implementation note |
| Deploy | `.github/workflows/deploy-admin-web.yml` runs on every push to `main` and publishes to https://esm3bobadilla.github.io/Cuidance_Admin/ |

**Branches:** one feature per short-lived branch, a pull request into `main` using `.github/pull_request_template.md`, a teammate review, then merge. Nothing merges straight to `main`.

## 9. Not built yet (on purpose)

| Area | Today | Later |
| --- | --- | --- |
| Sign-in and accounts | None; the profile shows placeholder initials | Supabase Auth |
| Roles and permissions | Policy wording only (`shared/content/admin-roles.ts`), nothing enforced | Supabase roles and row-level security |
| Data | Seeded files in `shared/content/` | Supabase tables, same project as the main app |
| Saving changes | Nothing saved, except theme (local storage) and, from Week 11, review decisions and onboarding (session storage, one tab) | Supabase |
| Pages for data unknown at build time | Not possible on a static site | Decided with the Supabase and hosting step |
