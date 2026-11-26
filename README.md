# Cuidance Admin Web

Internal admin tool for the Cuidance team.

Cuidance Admin Web is an internal browser-based support tool for the Cuidance team. It helps maintain and review the content behind the public Cuidance mobile app.

It is not the public app, it is not part of participant testing, and it is not a provider, creator, brand or retailer portal.

> **Scope note:** Admin Mobile is archived as a reference artifact and is not part of the current implementation scope.

> Cuidance offers guidance, not medical advice. Admin Web follows the same rule. It never diagnoses, never analyzes photos and never makes automated expert judgments.

---

## Status

**Week 10: Next.js with TypeScript in `admin-web/`, Week 8 design tokens, the persistent sidebar, two sample-data screens and a Theme control. Nothing is connected to live data.**

| Area | Status |
| --- | --- |
| Repository documentation | Complete |
| Admin Web | Supporting implementation direction / current scope |
| Admin Mobile | Archived reference / no active implementation |
| Admin Web wireframes | Available as reference; not yet implemented |
| Design tokens | Done: `shared/design-tokens/` from the Week 8 Step 3 design system board (v04); open items listed in its README |
| Shared content and quiz rules | Not started |
| Admin Web framework | Approved: Next.js with TypeScript |
| Admin Web scaffold | Phase B1 (in review): prototype shell with a collapsible sidebar, one Light / Dark button, Dashboard, Content workspace, Review Tasks, Metrics (sample), Profile, Manage Team and Settings. Before that: persistent sidebar, and every route in the Week 10 route map aligned with the approved Week 9 hi-fi screens and the responsive prototype on `feat/admin-web-prototype-alignment`: shell, Dashboard, Quiz Content, Guidance Content, Product Information, Knowledge Sources, Partner Highlights, Commercial Content, Content landing page, Guidance Rules Review, Claims & Safety Review, Content Metrics, Account Support, Review Tasks and Settings / Team Access. Sample data only; no live permissions. Provisional items are listed in each implementation note in `docs/Week-10/` |
| Supabase connection | Not connected yet |
| Authentication | Not started |
| Supabase tables | Not started, pending team decision |
| GitHub Pages hosting | Live: static export, deployed automatically from `main` by GitHub Actions |
| Admin Web logo | Done: Team 03 approved v04 derived lockup. The sidebar is dark green in both themes and shows the reversed lockup; the collapsed rail shows the cream mark. The phone top bar follows the chosen theme (System, Light or Dark). Team 03 approved derived favicons (16, 32 and 48 px) in place (see `shared/brand/logo/README.md`) |

**Live link:** https://esm3bobadilla.github.io/Cuidance_Admin/

## What Admin Web is for

Admin Web is an **internal support artifact**. The Cuidance team uses it in the browser to review and maintain:

- Quiz content
- Guidance content
- Product information
- Sources
- Partner highlights and commercial labels
- Claims and their evidence labels
- Safety notes

It does not add features for the people using the public Cuidance app.

**Admin Web is not:**

- A public-facing Cuidance app
- Part of participant testing
- A provider, creator, brand or retailer portal

## Product boundaries

These are the approved limits for Cuidance. Admin Web must stay inside them.

**In scope**

- Guidance quiz content and the rules that build a result
- Result content, evidence labels and sources
- **Product Barcode / Label Lookup:** product lookup only
- **Saved Routine Notes:** organizing saved notes, not a routine builder
- Commercial content, always clearly labeled as "Partner"
- **Product Library:** a small reference set of real products (brand, product name, category, ingredients, product facts), each with its official brand page as the source and a description rewritten in Cuidance's voice

**Future scope or VERIFY**

- Product availability and retailer information

**Not in Cuidance (and not in Admin Web)**

- Diagnosis or medical advice
- Selfie analysis, skin scanning or any photo-based detection
- Automated recommendations or automated expert judgment
- Medical-review features
- Marketplace tools or checkout
- Provider or creator dashboards
- Public brand or retailer accounts

**Accounts and metrics:** No public user-account management or analytics expansion. Limited internal Account Support and Content Metrics views may be implemented only where already approved in the Admin Web architecture.

## Tech stack

- **Admin Web:** [Next.js](https://nextjs.org/) with TypeScript (strict), browser-based. Approved by Team 03.
- [Supabase](https://supabase.com/) for the database, same project as the main app. **Not connected yet.** No authentication or database tables are being created yet (pending team decision).
- Shared content and tokens as local typed data in `shared/`

> Admin Mobile remains archived reference only. There is no Expo or React Native Admin build.

## Getting started

Admin Web lives in `admin-web/`. By default it runs in **sample mode**: every screen uses sample data and nothing is sent anywhere. From Phase A2 it can also run in **Supabase mode** (real sign-in and review data from the development project), turned on only by build settings.

### Requirements

- Node.js 20.9 or newer
- npm
- A current desktop browser for testing Admin Web
- A Supabase project, when that step starts (ask the team for access)

### Install and run

```bash
# 1. Go to the Admin Web folder
cd admin-web

# 2. Install dependencies
npm install

# 3. Start the dev server, then open http://localhost:3000
npm run dev

# 4. Check the production build
npm run build

# 5. Run the demo workflow and role tests (Node's built-in test runner, no extra packages)
npm test
```

**Demo mode (Phase 2 PR 2).** Product Library, Email and Live work as a demo: changes stay in this browser session, and nothing is sent, scheduled or published. Use **Reset demo data** in the Demo mode banner to go back to the sample data. See `docs/Phase-B2/phase-2-pr2.md`.

## Deployment

Admin Web is hosted on GitHub Pages as a static site.

1. Every merge to `main` redeploys automatically (workflow: `.github/workflows/deploy-admin-web.yml`).
2. You can also run the workflow by hand from the repo's Actions tab.
3. Local development is still `npm run dev` in `admin-web/`, at http://localhost:3000.
4. One-time setup: in the GitHub repo, go to Settings → Pages → Source and choose "GitHub Actions".

### Environment variables (Supabase mode, Phase A2)

Sample mode needs no settings, and the GitHub Pages site always builds in sample mode.

To try Supabase mode on your own computer:

1. Copy `admin-web/.env.example` to `admin-web/.env.local`. That file is git-ignored, so it never gets committed.
2. Fill in the three settings it lists:
   - `NEXT_PUBLIC_ADMIN_DATA_MODE=supabase`;
   - the project URL;
   - the project's **public** (publishable / anon) key.
3. Run `npm run dev` in `admin-web/` and sign in with a test account your team gave you (`example.com` addresses only, D13).

**Never** use the service-role / secret key, the database password or an access token here. The app refuses to start Supabase mode with a secret key. For the local Supabase stack, see `npm run db:start` at the repo root.

## Project structure

```
Cuidance_Admin/
├── admin-web/             Admin Web app for the browser
│   ├── app/               Routes from the Week 10 route map (see `docs/Week-10/route-map.md`), `/dev` component preview, custom 404; Phase 2 PR 1 adds `content/product-library`, `email` and `live/app`, `live/website`
│   │   └── _screens/      Shared structure for the route-map screens (not a route)
│   └── components/        Shared components: layout, ui, forms, data, feedback, content, overlay (drawer, dialog, popover)
├── supabase/              Phase 2: Supabase config, migrations, local seed and database tests; Phase A3: the invitations Edge Function (functions/) and email templates (templates/); role migration Stage 1: rollback/ (reviewed rollback scripts, never run automatically)
├── shared/                Shared content and rules for Admin Web
│   ├── content/           Admin Web screen names, navigation, permission matrix, page wording and sample data, theme and display settings
│   ├── review-loop/       Week 11 review decision rules (statuses, Dashboard counts), shared by every screen
│   ├── workflows/         Phase 2 PR 2 demo workflow rules for Product Library, Email and Live (roles, status changes, validation), with unit tests in __tests__/ (`npm test` in admin-web)
│   ├── onboarding/        Week 11 and Phase A1 invitation, account setup and sign-in rules (password, email, states)
│   ├── quiz-rules/        Answer cards, mixing rules, delivery rules
│   ├── design-tokens/     Colors (light and dark), type, spacing, radius, stroke
│   └── brand/
│       ├── heroes/        Cut-paper hero banner images (Phase B1 prototype; Review Tasks, Metrics and Email from Visual Package 01)
│       ├── icons/         Phase B1 cu-icons path data (rendered by admin-web/components/ui/CuIcon.tsx)
│       ├── illustrations/ Approved flat Cuidance illustrations (Phase A1, plus Phase B1 prototype assets; email/ for the email cards, roles/ and profile/ from Visual Package 01)
│       ├── live/          Phase 2 static Live preview images (App screen, website hero) from the approved prototype
│       ├── auth/          Phase 3 approved paper-cut background for Sign in, Create account and Forgot password
│       └── logo/          Approved Logo Version 4 files (package v03); prototype/ holds the cream mark for the icon rail
│           ├── png/
│           │   └── derived/   Team 03 derived exports (favicons, 180 / 192 px app icons, raster lockups)
│           └── svg/       Wrappers that display the matching PNG
├── docs/
│   ├── wireframes/        Admin Web wireframes (reference only, not app code)
│   ├── Week-10/           Week 10 demo log, route map and screenshot evidence
│   ├── Week-11/           Week 11 Close the Loop plan and feature notes
│   ├── Phase-2/           Supabase integration plan and decisions
│   ├── Phase-A1/          Phase A1 Admin Web completion notes and evidence
│   ├── Phase-A2/          Phase A2 Supabase application foundation notes and evidence
│   ├── Phase-A3/          Phase A3 invitations and onboarding notes
│   ├── Phase-A4/          Phase A4 release readiness: checks, security review, known limitations, go-live checklist
│   ├── Phase-B1/          Phase B1 prototype implementation: role migration plan, progress and checks
│   ├── Phase-B2/          Phase 2 PR 1 (Content, Product Library, Email, Live, role wording) and PR 2 (functional demo workflows): notes and checks
│   ├── Phase-3/           Phase 3 visual polish and QA: changes against the baseline, QA results, branch inventory, before-and-after images; polish/ for the follow-up Admin Web polish pass; visual-package-01/ for the Visual Package 01 asset update
│   └── archived/
│       └── admin-mobile/  Archived Admin Mobile reference (no active work)
├── README.md
├── ARCHITECTURE.md        How Admin Web is put together (routes, screens, state)
├── package.json           Repo tooling only (Supabase CLI: npm run db:start, db:test)
├── CLAUDE.md              Rules for AI agents working in this repo
├── .gitattributes         Keeps .sql and .ts files with Unix line endings, so what reaches Supabase matches review
├── .gitignore
└── .github/
    ├── pull_request_template.md
    └── workflows/
        ├── deploy-admin-web.yml   GitHub Pages deploy
        ├── admin-web-tests.yml    Type check and demo workflow tests on pull requests
        └── supabase-db-tests.yml  Database tests
```

Folders are added to the repo when their first file lands. Git doesn't track empty folders.

## Team workflow

1. `main` is the default branch.
2. Make each change on a short-lived feature branch.
3. Open a pull request into `main` using the PR template.
4. At least one teammate reviews every pull request before it merges.
5. Don't merge directly into `main`.
6. Don't commit secrets, keys or certificates.
7. Delete a feature branch after its pull request is merged.

## Related

- **Cuidance prototype** (`alyssaramirez601/Cuidance_Prototype`): the public Cuidance mobile app's separate repository and the reference for flows, copy and design. Admin Web follows its conventions but does not copy its code or screens, and work here never changes that repo.

## Team

Team 03:

- Alyssa Ramirez
- Esme Bobadilla

## AI use

We use AI tools to support planning, design exploration, coding and documentation. Every claim, design decision and line of code is reviewed and verified by Team 03. Material AI use is logged in our AI disclosure log.

- **Claude Code:** repository setup and documentation
- **Claude Design:** visual boards and wireframe artifacts
- **ChatGPT / Codex:** planning, review, scope control and prompt direction
- **Figma Make:** only when used for prototype or visual implementation work

No AI tool replaces human review or user research. AI output is a draft for the team to review. It is never presented as user research, and synthetic people or simulated feedback are never used as evidence.

## License

_To be decided._
