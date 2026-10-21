# Cuidance Admin Web

Internal admin tool for the Cuidance team.

Cuidance Admin Web is an internal browser-based support tool for the Cuidance team. It helps maintain and review the content behind the public Cuidance mobile app.

It is not the public app, it is not part of participant testing, and it is not a provider, creator, brand or retailer portal.

> **Scope note:** Admin Mobile is archived as a reference artifact and is not part of the current implementation scope.

> Cuidance offers guidance, not medical advice. Admin Web follows the same rule. It never diagnoses, never analyzes photos and never makes automated expert judgments.

---

## Status

**Week 9 practice build: Admin Web scope confirmed; Next.js with TypeScript shell scaffolded in `admin-web/`; content features not started.**

| Area | Status |
| --- | --- |
| Repository documentation | Complete |
| Admin Web | Supporting implementation direction / current scope |
| Admin Mobile | Archived reference / no active implementation |
| Admin Web wireframes | Available as reference; not yet implemented |
| Design tokens | Done: `shared/design-tokens/` from the Week 8 Step 3 design system board (v04); open items listed in its README |
| Shared content and quiz rules | Not started |
| Admin Web framework | Approved: Next.js with TypeScript |
| Admin Web scaffold | Done: minimal shell with a placeholder dashboard |
| Supabase connection | Not connected yet |
| Authentication | Not started |
| Supabase tables | Not started, pending team decision |

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

Admin Web lives in `admin-web/`. Right now it is a minimal shell with a placeholder dashboard. It has no data, sign-in or backend.

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
```

### Environment variables

When setup starts, keys go in a `.env` file in the project root. Never commit real keys to the repo. `.env` is already in `.gitignore`.

## Project structure

```
Cuidance_Admin/
├── admin-web/             Admin Web app for the browser
├── shared/                Shared content and rules for Admin Web
│   ├── content/           Result content, safety lines, labels
│   ├── quiz-rules/        Answer cards, mixing rules, delivery rules
│   ├── design-tokens/     Colors (light and dark), type, spacing, radius, stroke
│   └── brand/
│       └── logo/          Approved Logo Version 4 files (waiting on assets)
├── docs/
│   ├── wireframes/        Admin Web wireframes (reference only, not app code)
│   └── archived/
│       └── admin-mobile/  Archived Admin Mobile reference (no active work)
├── README.md
├── CLAUDE.md              Rules for AI agents working in this repo
├── .gitignore
└── .github/
    └── pull_request_template.md
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
