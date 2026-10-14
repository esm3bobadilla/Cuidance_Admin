# CLAUDE.md: Cuidance Admin

Rules for any Claude agent working in this repo. Follow them on every task. If something here conflicts with a request, ask before going ahead.

_Last updated: Oct 14, 2026 (Week 8, Step 1: repository setup)._

## Project context

- **Cuidance** is a mobile app for beauty and personal-care guidance. A short quiz asks about hair, skin, makeup and body care, and the app explains what may fit the person and why.
- **This repo is Cuidance Admin**, an **internal support artifact**. It holds the tools the team uses to review and maintain Cuidance content. It is not the public app.
- Two apps live here:
  - **admin mobile** (Expo, for phones)
  - **admin web** (for the browser)
- Admin mobile and admin web **share terminology, quiz logic, result content and design tokens** through `shared/`. Never define these twice.
- **Admin screens are not part of participant testing.** Don't add them to test plans, and don't treat admin feedback as user research.
- Team: Alyssa Ramirez and Esme Bobadilla. Both work in this repo, so this file keeps both builds consistent.
- The public app's reference is the `alyssaramirez601/Cuidance_Prototype` repo and its CLAUDE.md. Follow its content, safety and design rules. **Don't copy its app code or prototype screens here.**

## Product boundaries

Admin tools stay inside the approved Cuidance scope. If a request goes past these lines, stop and ask.

- **No marketplace tools.** No checkout, carts, pricing or seller tools.
- **No automated recommendations.** Admin organizes and reviews content. It never generates picks for people.
- **No medical-review features.** No clinician workflows, case review or medical sign-off.
- **No diagnosis, medical advice, selfie analysis, skin scanning or automated expert judgment.**
- **Product Barcode / Label Lookup** stays **product lookup only.**
- **Saved Routine Notes** stays **saved-note organization**, not a full routine builder.
- **Product availability and retailer information** are **future scope or VERIFY.** Don't build them, and mark any mention as VERIFY.
- **Commercial content must be clearly labeled** ("Partner") and kept separate from guidance.
- No user-account management or analytics expansion beyond what the team approves.

## Core stack (planned)

- Expo (managed workflow) with React Native for admin mobile
- Expo for web (or a matching React setup) for admin web, to be confirmed by the team
- TypeScript (strict)
- Supabase for authentication and the database, same project as the main app
- Shared content and rules ship as local typed data in `shared/`

**Not yet:** Don't add Expo app code or Supabase tables until the team starts that step.

## Project structure

```
Cuidance_Admin/
├── admin-mobile/          # Admin app for phones (Expo)
├── admin-web/             # Admin app for the browser
├── shared/                # Used by both admin apps. Define things once, here.
│   ├── content/           # Result content, safety lines, labels
│   ├── quiz-rules/        # Answer cards, mixing rules, delivery rules
│   └── design-tokens/     # Colors, type, spacing
├── docs/
│   ├── wireframes/        # Admin wireframes (reference only)
│   └── Week-8/            # Week 8 notes and deliverables
├── README.md
├── CLAUDE.md
├── .gitignore
└── .github/
    └── pull_request_template.md
```

- Wireframe HTML in `docs/wireframes/` is **reference only.** Never treat it as working app code or import from it.
- Update the "Project structure" section of `README.md` whenever folders change.

## Repo and branches

- `main` is the default branch.
- Use **short-lived feature branches** for every change.
- Changes go through **pull requests** into `main`, using `.github/pull_request_template.md`.
- **At least one teammate reviews** each pull request before it merges.
- **Do not merge directly into `main`.**
- Delete a feature branch only after its pull request is merged.
- **Do not commit secrets.** Keys go in `.env`, never in code. Certificates and provisioning files stay out of the repo (see `.gitignore`).

## Content and safety rules

These match the main app. Admin content feeds the app, so the same rules apply.

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

- AI output is a draft. **The team reviews it before it's used.**
- **AI output is not user research.** Never present it as findings, and never use synthetic people or simulated feedback as evidence.
- Log AI-assisted work in the team's AI disclosure log.

## Do not

- Do not add Expo app code or Supabase tables until the team starts that step.
- Do not copy public app code or prototype screens from `Cuidance_Prototype`.
- Do not edit the `Cuidance_Prototype` repo or its `gh-pages` branch from here.
- Do not treat wireframe HTML as working application code.
- Do not add user-account management, analytics expansion, marketplace tools, automated recommendations, checkout or medical-review features.
- Do not define terminology, quiz rules, result content or tokens separately in `admin-mobile/` and `admin-web/`. Use `shared/`.
- Do not commit secrets.

## Working style

- Explain changes in plain, step-by-step language with numbered steps or checklists. Alyssa and Esme are designers, so skip the jargon.
- Make small, focused changes and say which files changed.
- If a request is unclear or would break a rule above, ask first.
