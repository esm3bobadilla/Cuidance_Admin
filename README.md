# Cuidance Admin Web

Internal admin tool for the Cuidance team.

Cuidance Admin Web is an internal browser-based support tool for the Cuidance team. It helps maintain and review the content behind the public Cuidance mobile app.

It is not the public app, it is not part of participant testing, and it is not a provider, creator, brand or retailer portal.

> **Scope note:** Admin Mobile is archived as a reference artifact and is not part of the current implementation scope.

> Cuidance offers guidance, not medical advice. Admin Web follows the same rule. It never diagnoses, never analyzes photos and never makes automated expert judgments.

---

## Status

**Week 8: scope set to Admin Web only.** Docs and workflow are in place. No app code yet.

| Area | Status |
| --- | --- |
| Repository, README, CLAUDE.md and PR template | Done |
| Admin Web | Supporting implementation direction / current scope |
| Admin Mobile | Archived reference / no active implementation |
| Admin Web wireframes | Not started (will live in `docs/wireframes/`) |
| Shared content, quiz rules and design tokens | Not started |
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
- User-account management or analytics expansion

## Tech stack

- **Admin Web:** browser-based React or another approved web setup. The framework is still to be confirmed.
- [Supabase](https://supabase.com/) for the database, same project as the main app (pending team decision)
- Shared content and tokens as local typed data in `shared/`

> This stack is not final. We will update this section once the team approves a framework.

## Getting started

> Setup steps will be filled in once Admin Web is created. There is no app code in this repo yet.

### Requirements

- Node.js: _version TBD_
- npm or yarn
- A current desktop browser for testing Admin Web
- A Supabase project, when that step starts (ask the team for access)

### Environment variables

When setup starts, keys go in a `.env` file in the project root. Never commit real keys to the repo. `.env` is already in `.gitignore`.

## Project structure

```
Cuidance_Admin/
├── admin-web/             Admin Web app for the browser
├── shared/                Shared content and rules for Admin Web
│   ├── content/           Result content, safety lines, labels
│   ├── quiz-rules/        Answer cards, mixing rules, delivery rules
│   └── design-tokens/     Colors, type, spacing
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
