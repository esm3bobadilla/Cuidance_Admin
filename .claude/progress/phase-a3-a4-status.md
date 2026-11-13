# Phase A3 / A4 status

Resume from here. Before continuing, re-check the branch, commit, working tree, open PRs, the Supabase project identity and CLAUDE.md. Don't repeat completed work. Don't merge, deploy or change hosted data without the owner's explicit authorization.

## Baseline (verified Nov 12, 2026)
- `main` = `618b5bb` (Phase A2 merged, [esm3bobadilla/Cuidance_Admin#17](https://github.com/esm3bobadilla/Cuidance_Admin/pull/17)). No open PRs. The working tree was clean.
- Supabase: the only project is "Cuidance Admin Web — Development". Its hosted history has the 4 Phase 2.1 migrations (`20261111060000` to `20261111060300`).
- GitHub Pages: sample mode (no Supabase settings in the deploy).

## Current phase: A3 (invitations and onboarding completion)
Branch: `feat/phase-a3-invitations` (from `618b5bb`).

### Design decisions
1. **No new migration.** Use the existing `invitations` table (D7: 7-day expiry, pending / accepted / declined / revoked, one pending per email per workspace).
2. **One Edge Function, `supabase/functions/invitations`.** Actions: create, get, accept, decline, revoke, resend (plan Phase 2.5).
   - It's the only code that uses the service-role key, which the Supabase runtime provides as `SUPABASE_SERVICE_ROLE_KEY`.
   - D5: Owners invite Admins and Reviewers; Admins invite Reviewers.
3. **Links.** The email links go straight to the site with a single-use, expiring Supabase Auth `token_hash`.
   - Templates are in `supabase/templates/`.
   - The page verifies the token with `verifyOtp`, then removes it from the address.
   - New people get an invite link; people who already have an account get a sign-in link.
4. **Resend.** Sends a fresh link while the invitation is pending and within its 7 days. The expiry is never extended. 60-second cooldown per invitation.
5. **Password.** Setup and reset share the Account Setup screen: 12+ characters, with a letter and a number (the existing rules plus the Auth config).
6. **Local only.** All testing uses the local stack (emails go to the local mail catcher). Hosted function deploy, templates and SMTP are owner steps (D6: no production SMTP).
7. **Email design.** The Week 12 Invite and Welcome email concepts aren't in the repo. The templates are PROVISIONAL until the owner supplies them.

### Progress
- [x] Baseline verified, branch created
- [x] Edge Function, config, templates: committed `ee115a2`. Function tests: 64 checks, 0 failures
- [x] Client: `admin-web/app/_data/invitationsApi.ts`
- [x] Accept Invitation, Account Setup (setup password and reset), Forgot password: committed `8911646`
- [x] Team Access: invite, resend, withdraw: committed `8911646`. Browser flows: 46 checks, 0 failures
- [x] Full validation (all passing):
  - TypeScript and the 3 builds;
  - sample regressions (shell 352 / 0; screen, landing, W11, F2, A1 suites 0 failures; 6 audits no issues);
  - A2 Supabase suite 82 / 0;
  - function tests 64 / 0;
  - browser flows 46 / 0;
  - responsive audit of the new screens (126 loads) no issues;
  - hydration at localhost (400 + 104 + 28, React attached on every page) 0 warnings;
  - db lint clean; db tests 114 pass;
  - secret scan clean.
- [x] Docs: `docs/Phase-A3/invitations-implementation.md`, ARCHITECTURE, README, plan phase table
- [x] PR opened: [esm3bobadilla/Cuidance_Admin#18](https://github.com/esm3bobadilla/Cuidance_Admin/pull/18) "Phase A3: invitations and onboarding completion", Alyssa requested.

## CHECKPOINT: waiting for the owner
Phase A3 is complete and open for review. **Don't merge, don't start Phase A4, and don't change the hosted project** until the owner authorizes it. Phase A4 starts only after A3 is merged, or if the owner explicitly authorizes parallel work.

### Commits on the branch (pushed)
- `ee115a2` invitations Edge Function, email templates, Auth config
- `8911646` Supabase-mode onboarding screens and Team Access invitations
- `64ff9fb` documentation and progress checkpoint

### Blockers / owner decisions
- Week 12 email concepts needed for the final email design.
- Hosted rollout (deploy the function, set `ADMIN_SITE_URL`, email templates, SMTP provider) needs authorization.

### Local environment notes
- Local stack: `SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io npx supabase start` (start dockerd first). Local function setting: `supabase/functions/.env` (git-ignored): `ADMIN_SITE_URL=http://localhost:3000`.
- Test users: the scratchpad `tools/a2-setup.mjs` (example.com only). Emails: the local mail catcher at http://127.0.0.1:54324.
- The local email rate limit (`email_sent = 2`) only applies with custom SMTP, so no change is needed.
- **Sandbox quirk (cloud session only):** the local Edge Functions runtime can't verify this sandbox's proxy certificate, so it can't download npm packages. After every `supabase start`, run the scratchpad `a3/seed-deno-cache.sh`. It copies the pre-downloaded packages (supabase-js 2.118.0, its dependencies and @opentelemetry/api) into the runtime cache. This doesn't affect the repository, hosted Supabase or a normal computer.

---

## Phase A3: DONE
Merged: [esm3bobadilla/Cuidance_Admin#18](https://github.com/esm3bobadilla/Cuidance_Admin/pull/18), merge commit `1b119a7`. GitHub Pages deploy run #14 succeeded (sample mode). Hosted Supabase unchanged (4 migrations, no Edge Functions, 0 rows).

## Current phase: A4 (production hardening and release readiness)
Started Nov 12, 2026 on the owner's instruction. Branch: `feat/phase-a4-release-readiness` (from `1b119a7`).

**Owner limits for A4:** don't deploy the Edge Function, change hosted Supabase data, switch GitHub Pages out of sample mode, **open or merge a PR**, or delete branches without explicit authorization. Commit and push to the branch, then stop and report.

### Plan
- [x] Reachability (crawl from the Dashboard): sample 21, Pages 21, Supabase 19 pages; every link opens a real page. Was: every screen in both modes (Dashboard, Content x6, Review Tasks, Metrics, Account Support, Settings, Sign In, Create Account, Accept Invitation, Account Setup, task detail, 404)
- [x] Accessibility audit (new `a4-a11y.mjs`): one finding (sidebar Notifications aria-expanded), fixed in `f5b2ba2`. Was: accessibility audit (new script): names on every control, valid aria references, unique IDs, labelled fields, images alt, landmarks, heading order, focus visible; both modes; fix what it finds
- [x] Visual polish (`f5b2ba2`): phone invitations list; no focus box on first load. Was: visual polish pass against the A1 reference pack (screenshots of key screens, light and dark); fix clear issues
- [x] States: 7 Supabase-mode empty / error checks pass (`a4-states.mjs`). Was: loading / empty / error states review (every ?state= preview, Supabase-mode real states)
- [x] Hardening: npm audit 0 (app prod, dev, root); deploy workflow pins sample mode and fails on any Supabase address or key (tested locally both ways). Was: hardening review: code and config (Edge Function, client data layer, headers / static hosting limits, dependency audit)
- [ ] Security Advisor: document the 4 warnings (accept, or a follow-up migration that needs its own reviewed PR)
- [x] Full validation, all passing (numbers in `docs/Phase-A4/release-readiness.md`, section 4)
- [x] Docs: `docs/Phase-A4/release-readiness.md`, ARCHITECTURE (section 11, deploy row, stale A2 sentence fixed), README, CLAUDE.md status line (rules unchanged)
- [x] Committed and pushed to `feat/phase-a4-release-readiness`. **No PR opened.**

## CHECKPOINT: Phase A4 complete, waiting for the owner
Next actions need the owner's explicit authorization:
- open (and later merge) the A4 PR;
- the hosted rollout (release-readiness section 7);
- the Security Advisor follow-up migration (its own PR);
- dependency patch updates;
- deleting merged branches.

### A4 environment
After any restart, run the scratchpad `a4/up.sh`. It brings back dockerd, the local Supabase, the runtime package cache, the test users and the 3 builds, then serves them on 4101 (sample), 4102 (Pages build), 4103 and 3000 (Supabase mode).
