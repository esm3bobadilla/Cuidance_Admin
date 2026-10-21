# CLAUDE.md: Cuidance Admin Web

Rules for any Claude agent working in this repo. Follow them on every task. If something here conflicts with a request, ask before going ahead.

_Last updated: Oct 21, 2026 (Week 9 practice build: Admin Web scope confirmed; Next.js with TypeScript approved; implementation not started)._

## Project context

- **Cuidance** is a mobile app for beauty and personal-care guidance. A short quiz asks about hair, skin, makeup and body care, and the app explains what may fit the person and why.
- **This repository is Cuidance Admin Web.**
- **Admin Web is an internal browser-based support artifact.** The team uses it to review and maintain quiz content, guidance content, product information, sources, partner highlights, commercial labels, claims and safety notes.
- Admin Web is **not** a public-facing app, and **not** a provider, creator, brand or retailer portal.
- **Admin Mobile is archived** and is not an active implementation target. Its wireframes may stay documented under `docs/archived/admin-mobile/` as reference only.
- **Admin screens are not part of participant testing.** Don't add them to test plans, and don't treat admin feedback as user research.
- The public Cuidance app remains in the **separate `alyssaramirez601/Cuidance_Prototype` repository.** Follow its content, safety and design rules, but **don't copy public app code or public prototype screens** here, and never modify that repo from here.
- Team 03: Alyssa Ramirez and Esme Bobadilla. Both work in this repo, so this file keeps the build consistent.

## Platform

- **Active target: Admin Web**
- Browser-based implementation
- **Framework: Next.js with TypeScript**, approved by Team 03
- **No active Expo or React Native Admin Mobile build**

## Product boundaries

Admin Web stays inside the approved Cuidance scope. If a request goes past these lines, stop and ask.

- **No marketplace tools.** No carts or pricing tools.
- **No checkout or seller tools.**
- **No provider or creator dashboards.**
- **No public brand or retailer accounts.**
- **No automated recommendations.** Admin Web organizes and reviews content. It never generates picks for people.
- **No medical-review workflows.** No clinician workflows, case review or medical sign-off.
- **No diagnosis or medical advice.**
- **No selfie analysis or skin scanning**, and no automated expert judgment.
- **Product Barcode / Label Lookup** stays **product lookup only.**
- **Saved Routine Notes** stays **saved-note organization**, not a routine builder.
- **Product availability and retailer information** are **future scope or VERIFY.** Don't build them, and mark any mention as VERIFY.
- **Commercial content must be clearly labeled** ("Partner") and kept separate from guidance.
- No public user-account management or analytics expansion. Limited internal Account Support and Content Metrics views may be implemented only where already approved in the Admin Web architecture.

## Core stack

- Admin Web: Next.js (approved)
- TypeScript (strict)
- Supabase for the database, same project as the main app. **Not connected yet** (pending team decision).
- Shared content and rules ship as local typed data in `shared/`

**Not yet:** Don't connect Supabase, create database tables, or add authentication or backend implementation until the team starts that step. Ask before adding any dependency beyond the approved Next.js and TypeScript setup.

## Project structure

```
Cuidance_Admin/
├── admin-web/             # Admin Web app for the browser
├── shared/                # Shared content and rules. Define things once, here.
│   ├── content/           # Result content, safety lines, labels
│   ├── quiz-rules/        # Answer cards, mixing rules, delivery rules
│   └── design-tokens/     # Colors, type, spacing
├── docs/
│   ├── wireframes/        # Admin Web wireframes (reference only)
│   └── archived/
│       └── admin-mobile/  # Archived Admin Mobile reference (no active work)
├── README.md
├── CLAUDE.md
├── .gitignore
└── .github/
    └── pull_request_template.md
```

- Admin Web wireframes: **Available as reference; not yet implemented.**
- Wireframe HTML in `docs/wireframes/` and `docs/archived/` is **reference only.** Never treat it as working app code or import from it.
- Don't create empty placeholder folders just to make them show up in Git.
- Update the "Project structure" section of `README.md` whenever folders change.

## Repo and branches

- `main` is the default branch.
- Use **short-lived feature branches** for every change.
- Changes go through **pull requests** into `main`, using `.github/pull_request_template.md`.
- **At least one teammate reviews** each pull request before it merges.
- **Do not merge directly into `main`.**
- Delete a feature branch only after its pull request is merged.
- **Do not commit secrets.** Keys go in `.env`, never in code. Certificates and key files stay out of the repo (see `.gitignore`).

## Content and safety rules

These match the main app. Admin Web content feeds the app, so the same rules apply.

- Say "may fit" and "based on what you selected." Never "you have," "fix," "perfect," "flawless," "anti-," "problem," "best," "guaranteed" or "slimming."
- No real brand names in guidance. Partner or paid content is always labeled "Partner."
- Every guidance claim keeps its evidence label (Strong, Moderate, Limited or Assumption) and its source link.
- The emergency line stays on every result and is never edited away by an admin tool.
- Never infer skin tone, undertone or race from anything.
- Don't use em dashes in app copy.

## Styling

- Use the design tokens in `shared/design-tokens/` once they exist. Never hard-code a color, size or spacing value in a screen.
- Tokens come from Esme's Week 7 identity system. Check with Esme before changing any token or role.

## AI use

- AI output is a draft. **Team 03 reviews it before it's used.** No tool replaces human review.
- **AI output is not user research.** Never present it as findings, and never use synthetic people or simulated feedback as evidence.
- Tools Team 03 uses:
  - **Claude Code:** repository setup and documentation
  - **Claude Design:** visual boards and wireframe artifacts
  - **ChatGPT / Codex:** planning, review, scope control and prompt direction
  - **Figma Make:** only when used for prototype or visual implementation work
- Log AI-assisted work in the team's AI disclosure log.

## Do not

- Do not create Admin Mobile screens, mobile navigation, Expo mobile code, or mobile-specific implementation unless Team 03 explicitly reopens that scope.
- Do not connect Supabase, create database tables, or add authentication or backend implementation until the team starts that step.
- Do not switch away from Next.js with TypeScript without Team 03 approval.
- Do not copy public app code or public prototype screens from `Cuidance_Prototype`.
- Do not edit the `Cuidance_Prototype` repo or its `gh-pages` branch from here.
- Do not treat wireframe HTML as working application code.
- Do not add public user-account management, analytics expansion, marketplace tools, provider or creator dashboards, brand or retailer accounts, automated recommendations, checkout or medical-review features.
- Do not define terminology, quiz rules, result content or tokens outside `shared/`.
- Do not commit secrets.

## Working style

- Explain changes in plain, step-by-step language with numbered steps or checklists. Alyssa and Esme are designers, so skip the jargon.
- Make small, focused changes and say which files changed.
- If a request is unclear or would break a rule above, ask first.
