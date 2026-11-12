# Phase A2: Supabase application foundation

_Nov 12, 2026. Evidence screenshots are in `evidence/`. Branch `feat/phase-a2-admin-web-supabase`, from `main` `3eda8b2` (after Phase A1, [esm3bobadilla/Cuidance_Admin#16](https://github.com/esm3bobadilla/Cuidance_Admin/pull/16))._

**Sample mode stays the default (D9).** The GitHub Pages site always builds in sample mode, and every Week 10, Week 11 and Phase A1 behavior is unchanged there. Supabase mode turns on only when the site is built with the three settings in `admin-web/.env.example`.

## 1. Hosted development project: migration status

The four Phase 2.1 migrations were applied to **"Cuidance Admin Web — Development"** on Nov 11, 2026. This is the only project the Supabase connector can reach. It is not the public app's project.

1. **How they were applied:** they went through the Supabase connector, one at a time, exactly as they are in the repository. They weren't modified or recreated.
2. **Migration history:** the connector records its own timestamps as the version. So the four history rows were re-labelled with the repository versions (`20261111060000` to `20261111060300`). This is the same thing `supabase migration repair` does. Now `supabase db push` and the GitHub integration see them as already applied. No schema object was changed by this.
3. **Verified:**
   - **6 tables** (`profiles`, `workspaces`, `workspace_members`, `invitations`, `review_tasks`, `review_decisions`), each with **RLS enabled** and 0 rows;
   - **7 enum types**;
   - **11 functions**, each with `search_path` set to empty;
   - **11 triggers**, including `on_auth_user_created` on `auth.users`;
   - **12 policies**, all limited to `authenticated`;
   - **no table permissions for `anon`**;
   - no unexpected tables, views or policies.
4. **Security Advisor:** no errors. There are 4 warnings ("Signed-In Users Can Execute SECURITY DEFINER Function"), one each for `member_role`, `is_member`, `has_role` and `shares_workspace`.
   - **This is intended.** The RLS policies call these functions, and they only tell a signed-in person about their own memberships.
   - **Follow-up for Team 03 (needs a new reviewed migration):** move them into a private schema, which would clear the warnings.
5. **Performance advisor:** information-level notes only (some foreign keys without covering indexes, and indexes not used yet). Both are expected on empty tables.
6. **Not done:**
   - no test accounts or data were added to the hosted project;
   - nothing was applied to any other project;
   - no keys were requested or printed.

> **Note on CLAUDE.md.** CLAUDE.md says migrations reach the hosted database only through the reviewed GitHub connection or a team member's `supabase db push`, and never from an AI session. The Phase A1 and Supabase Execution Package instructed this step explicitly, so it was done through the Supabase connector, using only the merged, reviewed migration files. Team 03 may want to update that rule, or confirm the exception.

## 2. What was built

| Piece | File | Job |
| --- | --- | --- |
| Data-mode switch | `admin-web/app/_data/config.ts` | `sample` (default) or `supabase`. Supabase mode needs all three settings; it refuses a secret or service-role key |
| Settings template | `admin-web/.env.example` | Names only, no values. Real values go in `admin-web/.env.local` (git-ignored) |
| Supabase client | `admin-web/app/_data/supabaseClient.ts` | One browser client, loaded on demand so sample-mode pages never download it |
| Sign-in session | `admin-web/app/_data/authStore.ts` | Session (kept and refreshed by Supabase Auth), profile name, active workspace role; `signIn`, `signOut` |
| Identity | `admin-web/app/_data/identity.ts` | The Profile card and panel show the signed-in member, their role and workspace |
| Route protection | `admin-web/app/_data/AuthGate.tsx`, used by `AdminShell` | Every page except Sign In, Create Account, Accept Invitation and Account Setup needs an active member. Signed out → Sign In with `?next=` (this site only; other addresses are refused). Signed in but not a member → "No workspace access" |
| Review data | `admin-web/app/_data/reviewData.ts` | `useReviewData()` for the Dashboard, Review Tasks and Review Task Detail in either mode. `saveDecision` inserts the decision, then reloads, so every screen shows what the database holds |
| Mapping | `shared/review-loop/supabase-mapping.ts` | Database codes to the existing labels; rows to tasks; `canDecide` (D4, D12); task ID check |
| Live task page | `admin-web/app/review-tasks/task/page.tsx`, `app/_reviewLoop/LiveReviewTaskDetail.tsx` | `/review-tasks/task/?id=<task id>`: real task IDs on a static site. The sample pages `/review-tasks/seed-1/` to `seed-5/` stay for sample mode |
| Wording | `shared/content/supabase-mode.ts` | Every Supabase-mode message (PROVISIONAL until Team 03 reviews it) |

### Screen changes in Supabase mode
- **Sign In:**
  - checks the email and password with Supabase Auth;
  - a wrong password shows an error (icon and message) and returns focus to the cleared password field;
  - a service problem shows a different message;
  - the field checks still run first.
- **Sign out** (in the Notifications panel) ends the session and returns to Sign In.
- **Dashboard:**
  - counts and Needs attention come from the database;
  - "Decision recorded" shows once after a decision.
- **Review Tasks:** shows the database tasks, with loading, empty and error states.
- **Review Task Detail:**
  - shows "Reviewing as <name>";
  - only the **assigned Reviewer** sees the form (D4); everyone else sees why not;
  - after **Needs changes**, the Reviewer can **Record another decision** (D12); **Approved** is final;
  - there's no Reset (decisions are append-only);
  - shows the real saving and save-error states (network failure, or the database refusing the decision).
- **Create Account, Accept Invitation, Account Setup:** they say invitations aren't connected yet (Phase 2.5) and link back to Sign In. Nothing is created.
- **Sample task pages and sample notification links:** they never show sample tasks beside real data.

### Unchanged
- **The review rules.** The Review Task Decision Loop rules (`shared/review-loop/review-decisions.ts`) weren't changed. The detail screen got options so both modes share it, and sample mode passes exactly its Week 11 behavior.
- **Notifications** are still sample items in both modes.
- **Not added:** invitations, Edge Functions, real email or a production deploy.

## 3. Dependency
- **`@supabase/supabase-js` 2.118.0**, exact version, added to `admin-web/package.json`. It's approved under D10.
- It was released Oct 15, 2026, and npm audit found 0 vulnerabilities.
- Nothing else was added.

## 4. Tests

### Sample mode (both builds, the default)
- TypeScript;
- the production build and the GitHub Pages build;
- the Week 10 shell suite and screen suites;
- the Week 11 decision loop;
- Feature 2;
- the Phase A1 suite;
- responsive audits;
- hydration.

| Check | Result |
| --- | --- |
| TypeScript, production build, GitHub Pages build | Pass |
| Week 10 shell suite | 352 loads, 0 problems |
| Screen suites (b1, quiz, product, claims, b2, metrics) and the landing and detail suite | 0 failures each |
| Week 11 decision loop | 0 failures (80 detail loads, 96 previews, 16 flows) |
| Feature 2 | 0 failures |
| Phase A1 suite | 288 loads, 16 flows, 0 failures |
| Responsive audits, 3 modes × 2 builds | No issues |
| Hydration (dev server) | A1 pages: 400 loads; Week 11: 104 loads; 0 warnings, React attached on every page |
| Database tests (pgTAP) | 114 tests, pass |

**Hydration finding.** On this Next.js version, dev pages opened at `127.0.0.1` never hydrate, because the dev server blocks its hot-reload connection from that address. So earlier hydration runs, which used `127.0.0.1`, loaded pages without running React. The checks now open `localhost` and confirm that React attached on every page. Run that way, the merged Phase A1 code and this branch both have 0 hydration warnings.

### Supabase mode (new)
`a2-supabase-tests` runs real browsers against a **local** Supabase stack: the same four migrations plus the seed, and `example.com` test users with the same reviewers and assignments as the sample data. It never touches the hosted project. It covers:
- route protection and `?next=`;
- open redirects refused;
- signed-out visitors (anon) read nothing from all six tables;
- wrong password;
- an outsider with no workspace;
- the real Dashboard (3 / 1 / 1 / 0), Review Tasks and identity;
- Request changes (note required), decide again (D12), then Approve (final);
- the database rows and the task status;
- the Dashboard counts changing to 2 / 1 / 1 / 0, and the message showing once;
- persistence in a fresh browser as another reviewer;
- D4 in the screen and in the database;
- status not writable through the API;
- an Admin can read but has no decision form;
- save error, missing, bad and unknown task IDs, loading, load error;
- sign out;
- console errors.

**Result:** 82 checks, 0 failures, and no unexpected console messages on an idle machine. Supabase-mode hydration (dev server, signed out and signed in, light and dark): 28 loads, 0 warnings, React attached on every page.

**Secret scan:** no keys or tokens in any changed file. The built Supabase-mode site contains only the project URL and the public key. The local service-role key, secret key and JWT secret are in none of its files.

## 5. Still open
- **Security Advisor follow-up:** move the role helpers to a private schema (needs a new migration and its review).
- **CLAUDE.md:** confirm or update the hosted-migration rule (see the note in section 1).
- **Accounts on the hosted project:** create them through the dashboard (`example.com` only, D13) when the team is ready to try Supabase mode against it. None exist yet.
- **Wording:** all Supabase-mode wording is PROVISIONAL.
