# Cuidance Admin

Internal admin tools for the Cuidance team.

Cuidance is a mobile app for beauty and personal-care guidance. A short quiz asks about hair, skin, makeup and body care, and the app explains what may fit the person and why. This repo holds the **internal admin side**: the tools Alyssa and Esme use to review and maintain the content behind that guidance. It is not the public app, and it is not part of participant testing.

> Cuidance offers guidance, not medical advice. The admin tools follow the same rule. They never diagnose, never analyze photos and never make automated expert judgments.

---

## Status

**Week 8, Step 1: repository setup.** Docs and workflow are in place. No app code yet.

| Area | Status |
| --- | --- |
| Repository, README, CLAUDE.md and PR template | Done |
| Folder structure | Documented, folders added as work lands |
| Admin wireframes | Not started (will live in `docs/wireframes/`) |
| Shared content, quiz rules and design tokens | Not started |
| Admin mobile (Expo) | Not started |
| Admin web | Not started |
| Supabase tables | Not started, waiting on team decision |

## What it's for

Admin is an **internal support artifact**. It helps the team keep the public app's content accurate and consistent. It does not add new features for the people using Cuidance.

### Admin mobile

- Check quiz content, result content and safety lines on a phone, the same way testers see them
- Review and organize content the team is working on

### Admin web

- Review answer cards, mixing rules, result names and safety lines on a larger screen
- Keep content labels (evidence labels, "Partner" labels) consistent

Both apps share the same terminology, quiz logic, result content and design tokens through `shared/`.

## Product boundaries

These are the approved limits for Cuidance. Admin tools must stay inside them.

**In scope**

- Guidance quiz content and the rules that build a result
- Result content, evidence labels and sources
- **Product Barcode / Label Lookup:** product lookup only
- **Saved Routine Notes:** organizing saved notes, not a full routine builder
- Commercial content, always clearly labeled as "Partner"

**Future scope or VERIFY**

- Product availability and retailer information

**Not in Cuidance (and not in admin)**

- Diagnosis or medical advice
- Selfie analysis, skin scanning or any photo-based detection
- Automated recommendations or automated expert judgment
- Medical-review features
- Marketplace tools or checkout
- User-account management or analytics expansion

## Tech stack

- [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/) for admin mobile
- Expo for web (or a matching React setup) for admin web
- TypeScript (strict)
- [Supabase](https://supabase.com/) for authentication and the database, same as the main app
- Shared content and tokens as local typed data in `shared/`

> This stack is planned. We will update this section if it changes during the build.

## Getting started

> Setup steps will be filled in once the admin apps are created. There is no app code in this repo yet.

### Requirements

- Node.js: _version TBD_
- npm or yarn
- The Expo Go app on an iOS or Android phone (admin mobile)
- A Supabase project (ask the team for access)

### Environment variables

When setup starts, keys go in a `.env` file in the project root. Never commit real keys to the repo. `.env` is already in `.gitignore`.

## Project structure

```
Cuidance_Admin/
├── admin-mobile/          Admin app for phones (Expo)
├── admin-web/             Admin app for the browser
├── shared/                Used by both admin apps
│   ├── content/           Result content, safety lines, labels
│   ├── quiz-rules/        Answer cards, mixing rules, delivery rules
│   └── design-tokens/     Colors, type, spacing
├── docs/
│   ├── wireframes/        Admin wireframes (reference only, not app code)
│   └── Week-8/            Week 8 notes and deliverables
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

- **Cuidance prototype** (`alyssaramirez601/Cuidance_Prototype`): the public app's reference for flows, copy and design. Admin follows its conventions but does not copy its screens or code.

## Team

- Alyssa Ramirez
- Esme Bobadilla

## AI use

We use AI tools to support research, design exploration, coding and documentation. Every claim, design decision and line of code is reviewed and verified by the team. Material AI use is logged in our AI disclosure log.

- **Claude:** repository setup, documentation drafting

AI output is a draft for the team to review. It is never presented as user research, and synthetic people or simulated feedback are never used as evidence.

## License

_To be decided._
