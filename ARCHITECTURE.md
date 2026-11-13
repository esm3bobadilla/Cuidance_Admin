# Cuidance Admin Web: architecture

_Last updated: Nov 11, 2026 (Phase 2.1: Supabase schema, RLS, triggers and database tests on `feat/phase-2-1-supabase-schema`; the app itself is unchanged and runs in sample mode). Week 11 features 1 and 2 are merged (PRs #13 and #14)._

How Admin Web is put together, in plain words. Read this with `CLAUDE.md` (the rules) and `docs/Week-11/close-the-loop-implementation-plan.md` (the current plan).

**Keep this file current.** Update it in the same pull request whenever a screen, route, shared store or data file is added or removed. Week 11 adds three new screens: Review Task Detail (feature 1, merged) and Accept Invitation and Account Setup (feature 2, this branch).

## 1. What it is

- An **internal** browser tool for the Cuidance team to review and maintain content. Not public, not a portal for providers, brands or retailers.
- **Next.js 16 with TypeScript (strict)**, React 19. No other dependencies.
- **A static website.** `next build` turns every screen into a plain HTML page (`output: 'export'`), and GitHub Pages serves them. There is no server code, no database and no sign-in.
- **Data is seeded.** Every screen shows typed sample data from `shared/`. **Phase 2** adds a separate Admin Supabase project; its schema and tests exist (section 10), but the app doesn't connect to it yet. Sample mode stays the default.

## 2. Folders

```
Cuidance_Admin/
├── admin-web/                 The app
│   ├── app/                   One folder per route (page.tsx), plus private folders starting with _
│   │   ├── page.tsx           Dashboard (/)
│   │   ├── content/…          Content and its six child screens
│   │   ├── review-tasks/      Review Tasks, and [taskId]/ for Review Task Detail (Week 11)
│   │   ├── …                  The other top-level screens
│   │   ├── _screens/          Shared screen frame (ScreenPage) and panel styles
│   │   ├── _review/           Status and priority labels shared by Dashboard and Review Tasks
│   │   ├── _listDetail/       Shared list-and-details pieces (StatusChip, NoResults)
│   │   ├── _reviewLoop/       Week 11: review store, Review Task Detail view, Dashboard decision message
│   │   ├── _data/             Phase A2: data-mode switch, Supabase client, sign-in session, route guard, review data
│   │   ├── _dashboard/, _reviewTasks/, _quiz/, …   One private folder per built screen
│   │   ├── dev/               Internal component preview (URL only)
│   │   └── not-found.tsx      Custom 404
│   └── components/            One shared component per pattern (layout, ui, forms, data, feedback, content)
├── shared/                    Defined once, used everywhere
│   ├── content/               Screen names, wording and seed data, one file per screen
│   ├── review-loop/           Week 11: review decision rules (no React), shared by every screen
│   ├── design-tokens/         tokens.css (colors light and dark, type, spacing, radius, stroke)
│   ├── onboarding/            Week 11 and Phase A1: invitation, account setup and sign-in rules
│   └── brand/                 logo/ (approved Logo Version 4 files only) and illustrations/ (Phase A1 approved flat art)
├── supabase/                  Phase 2: config.toml, migrations, local seed, database tests; Phase A3: functions/ (invitations Edge Function) and templates/ (emails)
├── package.json               Repo tooling only (Supabase CLI); the app's own package.json is in admin-web/
├── docs/                      Week 10, Week 11, Phase 2 and Phase A1 notes, maps and evidence
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
| `/review-tasks/[taskId]/` | Review Task Detail | **BUILT (Week 11, feature 1).** One static page per seeded task (`seed-1` to `seed-5`), built with `generateStaticParams` and `dynamicParams = false`; other task addresses show Page not found. Layout PROVISIONAL |
| `/review-tasks/task/?id=` | Review Task Detail for a Supabase task | **BUILT (Phase A2).** Supabase mode only: one static page reads the task ID from the address. In sample mode it shows "This task isn't available" |
| `/sign-in/` | Sign In (Admin Web landing and sign-in entry) | **BUILT (Phase A1).** Prototype only: nothing is checked; a well-formed email and any password open the Dashboard. Setup shell. `?state=loading` or `submit-error` previews |
| `/create-account/` | Create Account | **BUILT (Phase A1).** Invitation only (no public sign-ups): looks for an invitation for the email and links to Accept Invitation. Setup shell. `?state=loading`, `found`, `not-found`, `submit-error` previews |
| `/accept-invitation/` | Accept Invitation | **BUILT (Week 11, feature 2).** Prototype only. Uses the setup shell (no sidebar). `?invite=` picks a sample invitation; `?state=` previews |
| `/account-setup/` | Account Setup | **BUILT (Week 11, feature 2).** Prototype only. Uses the setup shell (no sidebar). Ends with Go to Review Tasks |
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

**Shell** (`components/layout/AdminShell.tsx`, used by the root layout): top bar (breadcrumb starting "Admin", the icon-only Light / Dark / System theme controls, and the Profile button that opens the Notifications panel), persistent sidebar, then the page. Under 768 px the sidebar becomes a Menu.

**Sidebar (Phase A1):** the logo, then four groups: Dashboard; Content (Quiz Content, Guidance Content, Product Information, Knowledge Sources, Partner Highlights); Review Tasks (Guidance Rules Review, Claims & Safety Review); Metrics (Content Metrics). A group opens by default when you're on its page or one of its children; its toggle says "<Group> pages" and shows open or closed. Below the groups: a decorative illustration, the Profile card (sample identity, Account Support, Notifications) and Settings last. The order is defined once in `sidebarNav`, `sidebarProfileLinks` and `sidebarFooter` (`shared/content/admin-web-screens.ts`).

## 5. State

| State | Owner | Kept in | Notes |
| --- | --- | --- | --- |
| Seed data | `shared/content/*.ts` | Built into the pages | Same on every load |
| Preview state (`?state=`) | Each screen's `StateFromUrl` | The address | Review aid only |
| Screen state (search, filters, selected row, menus) | Each screen | Memory | Lost when you leave the page |
| Theme (Light, Dark, System) | `components/layout/themeStore.ts`; controls in `ThemeSwitch.tsx` | Local storage `cuidance-admin-theme` | Applied before paint by a small script in the root layout |
| **Notifications read state (Phase A1)** | `components/layout/notificationsStore.ts`; sample items in `shared/content/notifications.ts` | Session storage `cuidance-admin-notifications-read` (one tab) | Which sample notifications were read, and whether the panel is open (memory only). Sample data, nothing is sent |
| **Review decisions** | **BUILT (Week 11)** `app/_reviewLoop/reviewStore.ts`; rules in `shared/review-loop/review-decisions.ts` | Session storage `cuidance-admin-review-session` (one tab) | Only Review Task Detail records decisions and resets them. Dashboard, Review Tasks and Review Task Detail read them through `useReviewTasks()`. Also holds the one-time Dashboard message |
| **Invitation and account setup** | **BUILT (Week 11)** `app/_onboarding/onboardingStore.ts`; rules in `shared/onboarding/onboarding-rules.ts`; wording in `shared/content/invitation.ts` and `account-setup.ts` | Session storage `cuidance-admin-onboarding` (one tab) | Holds the invitation answer, the full name and the work email. **Never the password.** Doesn't touch review decisions. Nothing is sent anywhere |

**Stores follow one pattern** (the theme store): a small module with `subscribe`, a getter and a setter, read through React's `useSyncExternalStore`. The server build uses the plain seed, then the browser adds what's in storage after the page loads, so pages don't show hydration warnings.

**Derived, not duplicated (BUILT, Week 11):** current task status, Dashboard counts and the Needs attention list are worked out from seed + decisions by shared functions in `shared/review-loop/` (`applyDecisions`, `dashboardSummary`, `needsAttention`). No screen keeps its own copy.

## 6. Week 11 loop (all steps BUILT)

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

Full detail: `docs/Week-11/close-the-loop-implementation-plan.md`, sections 3 and 5, and `docs/Week-11/review-task-loop-implementation.md` (what was built and tested).

**Built in feature 1:**

| Piece | File | Job |
| --- | --- | --- |
| Rules | `shared/review-loop/review-decisions.ts` | `applyDecisions` (seed + decisions → current tasks), `needsAttention`, `dashboardSummary` (3 / 1 / 1 / 0 on the seed), `validateDecision` (Request changes needs a note), `parseReviewSession` (ignores bad saved data), the "Reviewer B" placeholder |
| Wording and paths | `shared/content/review-task-detail.ts` | Detail screen and Dashboard message wording, `reviewTaskPath`, `reviewTaskFromPath` (breadcrumb) |
| Store | `admin-web/app/_reviewLoop/reviewStore.ts` | `recordDecision`, `resetReviewSession`, `clearReviewNotice`, `useReviewTasks()` |
| Screen | `admin-web/app/_reviewLoop/ReviewTaskDetailView.tsx` (+ `StateFromUrl`) | Summary, decision history, decision form, recorded decision, states (`?state=loading`, `error`, `unavailable`, `saving`, `save-error`, `success`) |
| Dashboard message | `admin-web/app/_reviewLoop/DecisionNotice.tsx` | "Decision recorded" once after a decision |
| Readers | `_dashboard/DashboardContent.tsx`, `_reviewTasks/ReviewTasksContent.tsx`, `_review/ReviewShared.tsx` | Counts, rows and statuses from `useReviewTasks()`; title links; the Approved status |
| Breadcrumb | `components/layout/TopBar.tsx` | Admin / Review Tasks / *task* on detail pages |

**Status changes:** Approve → Approved (note optional; the task leaves Needs attention and its count drops by 1). Request changes → Needs changes (note required; the task stays and counts don't change). A decided task shows its decision instead of the form until **Reset sample data**.

**Built in feature 2 (Accept Invitation and Account Setup):**

| Piece | File | Job |
| --- | --- | --- |
| Setup shell | `components/layout/AdminShell.tsx`, `SetupBar.tsx`; `isSetupPath` in `shared/content/admin-web-screens.ts` | On `/sign-in/`, `/create-account/` (Phase A1), `/accept-invitation/` and `/account-setup/` only: the logo and the theme controls, no sidebar, Menu, breadcrumb or profile. Every other route renders the full shell as before |
| Sample invitations and wording | `shared/content/invitation.ts`, `shared/content/account-setup.ts` | Valid and expired sample invitations (Reviewer B, `reviewer.b@example.com`, Reviewer, Cuidance Content Team), `invitationFromParam` |
| Rules | `shared/onboarding/onboarding-rules.ts` | Password requirements (12+ characters, a letter, a number), email format and match, `validateSetup`, `invitationView`, `setupView`, `parseOnboardingSession` (ignores bad or unexpected saved data) |
| Store | `admin-web/app/_onboarding/onboardingStore.ts` | `acceptInvitation`, `declineInvitation`, `requestNewInvitation`, `createAccount` (name and email only), `resetOnboarding` |
| Screens | `admin-web/app/_onboarding/AcceptInvitationView.tsx`, `AccountSetupView.tsx`, `SetupFrame.tsx`, `OnboardingStateFromUrl.tsx` | The two screens, the Grounded Green welcome panel with the three steps, and the `?state=` / `?invite=` readers |

**Flow:** Accept Invitation (valid → Accept or Decline) → Account Setup (missing until accepted) → Create account → Account created → Go to Review Tasks, where the sidebar starts. Invitation states: valid, expired, declined, not found, already accepted, with Request a new invitation (nothing is sent).

**Phase A1 (Admin Web completion):** Sign In and Create Account join the start of the flow: Sign In → Create Account (invitation only) or Accept Invitation → Account Setup → Review Tasks. Both use `SetupFrame variant="entry"` (headline, body and the hand-and-stone illustration beside the card); Accept Invitation and Account Setup keep the steps panel. Wording in `shared/content/sign-in.ts`; rules `validateSignIn` and `findInvitationByEmail` in `shared/onboarding/onboarding-rules.ts`. Neither screen saves anything. Full notes: `docs/Phase-A1/admin-web-completion-implementation.md`.

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
| Deploy | `.github/workflows/deploy-admin-web.yml` runs on every push to `main` and publishes to https://esm3bobadilla.github.io/Cuidance_Admin/. **Always sample mode** (Phase A4): pinned, and checked after the build |

**Branches:** one feature per short-lived branch, a pull request into `main` using `.github/pull_request_template.md`, a teammate review, then merge. Nothing merges straight to `main`.

## 9. Not built yet (on purpose)

| Area | Today | Later |
| --- | --- | --- |
| Sign-in and accounts | Sample mode: none (placeholder identity). **Supabase mode: sign-in, sign-out, session and route protection (A2); invitations, account setup and password reset (A3)** | Hosted rollout of the Edge Function and email (owner steps, `docs/Phase-A3/`) |
| Roles and permissions | Sample mode: policy wording only. **Supabase mode: enforced by Row Level Security and triggers**; the screens only show what a role may do (D4, D12) | Team Access management (later phase) |
| Data | Sample mode: seeded files in `shared/content/`. **Supabase mode: review tasks and decisions from the separate Admin project** (D1) | Content screens (quiz, guidance, products, sources, partners) |
| Saving changes | Nothing saved, except theme (local storage) and, from Week 11, review decisions and the invitation and account setup (session storage, one tab). Passwords are never saved | Supabase |
| Pages for data unknown at build time | **Phase A2: one page reads the ID from the address** (`/review-tasks/task/?id=`) | Same pattern for other records |

## 10. Phase 2: Supabase (built through Phase A3)

Approved by Team 03 on Nov 11, 2026 (decisions D1 to D14). Full plan: `docs/Phase-2/supabase-integration-plan.md`.

- **Project:** a separate Admin Supabase project, "Cuidance Admin Web — Development". Never the public app's.
- **Hosting:** the frontend stays a static export on GitHub Pages. The browser will use only the public URL and anon key; **Row Level Security is the security boundary**. Privileged invitation and membership actions will run in **Supabase Edge Functions** (Phase 2.5).
- **Built in Phase 2.1** (database only, not yet applied to the hosted project):

| Piece | Where |
| --- | --- |
| Local Supabase config (invite-only auth, 12-character passwords with letters and digits, email confirmation, redirect URLs) | `supabase/config.toml` |
| Tables: `profiles`, `workspaces`, `workspace_members`, `invitations`, `review_tasks`, `review_decisions` | `supabase/migrations/` |
| Role helpers (`member_role`, `is_member`, `has_role`, `shares_workspace`) and guard triggers (final Owner, assigned-Reviewer decisions, no decisions after Approved, append-only decisions, status set by decisions) | `supabase/migrations/20261111060200_functions_and_triggers.sql` |
| RLS policies and column-level API privileges | `supabase/migrations/20261111060300_rls_and_grants.sql` |
| Local seed: the workspace and the five sample tasks (3 / 1 / 1 / 0) | `supabase/seed.sql` |
| Database tests (pgTAP, 114 tests) | `supabase/tests/`, `npm run db:test` |
| CI for database changes | `.github/workflows/supabase-db-tests.yml` |

- **Hosted development project:** the four Phase 2.1 migrations were applied on Nov 11, 2026, with the repo versions in the migration history (details in `docs/Phase-A2/admin-web-supabase-implementation.md`).

### Phase A2: Supabase application foundation (BUILT, sample mode stays the default)

**Two data modes, chosen when the site is built** (`admin-web/app/_data/config.ts`):

| Mode | When | What the app uses |
| --- | --- | --- |
| Sample (default, D9) | No settings, or anything incomplete. The GitHub Pages build always | The Week 10 / 11 / A1 sample data and the browser-only review loop, unchanged |
| Supabase | `NEXT_PUBLIC_ADMIN_DATA_MODE=supabase` plus the project URL and the **public** key (`admin-web/.env.example`) | Supabase Auth sign-in, and review tasks and decisions from the development project |

| Piece | File | Job |
| --- | --- | --- |
| Switch | `app/_data/config.ts` | `dataMode`, `isSupabaseMode`. Refuses a secret or service-role key |
| Client | `app/_data/supabaseClient.ts` | One browser client, loaded on demand (sample pages never download it). Session kept by Supabase Auth (`cuidance-admin-auth`) |
| Session | `app/_data/authStore.ts`, `identity.ts` | Signed in or out, profile name, workspace role; `signIn`, `signOut`. The Profile card and panel show the signed-in member |
| Route guard | `app/_data/AuthGate.tsx` (in `AdminShell`) | Every page except the four entry and setup screens needs an active member. Signed out goes to Sign In with `?next=` (this site only) |
| Review data | `app/_data/reviewData.ts`; mapping in `shared/review-loop/supabase-mapping.ts` | `useReviewData()` for the Dashboard, Review Tasks and Review Task Detail in either mode; `saveDecision` inserts into `review_decisions` and reloads |
| Live detail | `app/_reviewLoop/LiveReviewTaskDetail.tsx`, `app/review-tasks/task/page.tsx` | The Week 11 detail screen (`TaskDetail`) with the signed-in Reviewer, D4 (assigned Reviewer only) and D12 (decide again after Needs changes, until Approved) |
| Wording | `shared/content/supabase-mode.ts` | Every Supabase-mode message |

### Phase A3: invitations and onboarding (BUILT, Supabase mode only)

| Piece | File | Job |
| --- | --- | --- |
| Edge Function | `supabase/functions/invitations/index.ts`, rules in `supabase/functions/_shared/invitation-rules.ts` | create, get, accept, decline, revoke, resend. The **only** code with the service-role key (D2). D5 roles, 7 days (D7), single-use accept, 60-second resend cooldown, no leaks |
| Email templates | `supabase/templates/` (`config.toml` `[auth.email.template.*]`) | Invite, sign-in link (existing accounts) and reset. Links carry a single-use `token_hash` straight to Admin Web. PROVISIONAL design |
| Browser side | `admin-web/app/_data/invitationsApi.ts` | Calls the function; reads the email-link token once, removes it from the address, verifies it; password reset and saving |
| Screens | `app/_onboarding/LiveAcceptInvitation.tsx`, `LiveAccountSetup.tsx`; `SignInView.tsx` (Forgot password); `app/_settings/LiveTeamAccess.tsx` | Accept Invitation, Account Setup (setup and reset), Team Access invite / resend / withdraw |

Flow: Team Access → email → Accept Invitation → Account Setup → Review Tasks. Full notes and the hosted rollout steps: `docs/Phase-A3/invitations-implementation.md`.

**Security:** RLS is the boundary. The route guard and the role checks in the screens only decide what is shown; the database refuses anything the rules don't allow. Create Account is invitation only (no public sign-ups); accounts start from an invitation (Phase A3).

## 11. Release readiness (Phase A4)

The status, quality checks, security review, Security Advisor decision, known limitations and the owner's go-live checklist are in `docs/Phase-A4/release-readiness.md`. In short: the public GitHub Pages site is ready and **always builds in sample mode** (pinned in `.github/workflows/deploy-admin-web.yml`, which fails the deploy if a Supabase address or key appears in the build). Supabase mode is ready for staging once the owner deploys the invitations Edge Function and sets up Auth email.

