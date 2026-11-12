# Phase 2: Supabase integration plan

- **Status:** Phase 2.0 (decisions and verification) done. **Phase 2.1 (schema, RLS, triggers, seed and database tests) is built** on `feat/phase-2-1-supabase-schema`, waiting for its pull request and review. Nothing has been applied to the hosted project.
- **Date:** Nov 11, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.**
- **The app is unchanged.** It still runs in sample mode (D9). There's no sign-in, no Supabase client and no environment variables yet.

## 1. Architecture

```
GitHub Pages (static Next.js export)          Supabase: "Cuidance Admin Web — Development"
  browser ── public URL + anon key ──────────▶  Postgres with Row Level Security (the security boundary)
         └── signed-in user's token ─────────▶  Edge Functions (Phase 2.5): invitations, memberships
                                                  hold the service-role key; re-check every permission
```

- The frontend stays a static site on GitHub Pages (D2). It has no server and can't hold secrets.
- Everything the browser does goes through the public anon (publishable) key, so **RLS policies and database triggers enforce every rule**.
- Actions that need the secret key run only in **Supabase Edge Functions** (Phase 2.5).
- Sample mode stays the default (D9) until staging validation passes.

## 2. Team 03 decisions (Nov 11, 2026)

| # | Decision |
| --- | --- |
| D1 | A **separate** Supabase project for Cuidance Admin. Never the public app's project |
| D2 | Keep GitHub Pages for the frontend. Supabase Edge Functions for privileged invitation actions |
| D3 | Reserve **Content Editor** in the schema; don't implement it yet |
| D4 | Only the **assigned Reviewer** may record a review decision. Owner/Admin override is deferred |
| D5 | Owner invites and manages Admins and Reviewers. Admin invites and manages Reviewers only. Reviewer can't invite or manage. **No one may remove or demote the final Owner** |
| D6 | Test accounts during development. No production SMTP until the team picks a provider |
| D7 | Invitations expire after **7 days** |
| D8 | Real tasks open at `/review-tasks/task/?id=…`. The sample routes stay in sample mode |
| D9 | Sample mode stays the default. Don't switch the public site to Supabase mode until staging validation passes |
| D10 | `@supabase/supabase-js` and the Supabase CLI are approved |
| D11 | The Sign In screen matches Accept Invitation and Account Setup |
| D12 | A task may get another decision after Needs changes, until it's Approved |
| D13 | `example.com` test accounts only |
| D14 | CLAUDE.md updated to record this architecture (done in Phase 2.1) |

## 3. Phase 2.0 verification (Nov 11, 2026)

| Check | Result |
| --- | --- |
| Admin Supabase project | **"Cuidance Admin Web — Development"**, us-east-1, Postgres 17, healthy. Separate from the public app (D1). Before Phase 2.1: no tables and no migrations |
| GitHub connection | Confirmed by Team 03 in the Supabase dashboard |
| Auth settings (dashboard, Team 03) | Email provider on; **public sign-ups off**; email confirmation on; Site URL and redirect URLs set; password policy set; publishable key available; secret key kept private |
| Email-link expiry | **Not yet reported** (the verification note had a placeholder). Needed before Phase 2.5, see section 8 |
| Repository | No Supabase files, variables or dependencies before Phase 2.1 |

## 4. Schema (Phase 2.1)

Migrations in `supabase/migrations/`:

| File | Contents |
| --- | --- |
| `20261111060000_types.sql` | `citext`; the lists of allowed values: `workspace_role` (owner, admin, reviewer, content_editor reserved), `member_status`, `invitation_status`, `task_type`, `task_status`, `task_priority`, `decision_kind` |
| `20261111060100_tables.sql` | The six tables below |
| `20261111060200_functions_and_triggers.sql` | Role helpers, `updated_at`, the new-user profile trigger, and the guard triggers |
| `20261111060300_rls_and_grants.sql` | RLS on every table, policies, and the API privileges |

| Table | Key columns and rules |
| --- | --- |
| `profiles` | `id` (the auth user), `full_name`. Created automatically for every new auth user |
| `workspaces` | `name`, `slug` |
| `workspace_members` | `workspace_id`, `user_id`, `role`, `status` (active / deactivated). Members are deactivated, never deleted |
| `invitations` | `workspace_id`, `email` (case-insensitive), `role` (**admin or reviewer only**), `invited_by`, `status`, `expires_at` (**7 days**), `accepted_by`, `responded_at`. One pending invitation per email per workspace |
| `review_tasks` | `title`, `type`, `status`, `priority`, `assigned_to`, `open_question`, `created_by`. Assigned only to an active Reviewer of the same workspace; can't start as Approved |
| `review_decisions` | `task_id`, `workspace_id`, `decision`, `note`, `decided_by`, `decided_at`. **Request changes needs a note.** Append-only. A task with decisions can't be deleted |

## 5. Permission matrix

| Action | Owner | Admin | Reviewer | Signed-in non-member | Signed out |
| --- | --- | --- | --- | --- | --- |
| Read workspace, members, tasks, decisions | ✓ | ✓ | ✓ | ✗ | ✗ |
| Read invitations | All | Reviewer invitations | ✗ | ✗ | ✗ |
| Read profiles | Own and co-members' | Own and co-members' | Own and co-members' | Own only | ✗ |
| Rename the workspace | ✓ | ✗ | ✗ | ✗ | ✗ |
| Change a member's role or status | Admins and Reviewers (between those two roles) | Reviewers (status only) | ✗ | ✗ | ✗ |
| Promote to Owner, assign Content Editor | ✗ | ✗ | ✗ | ✗ | ✗ |
| Change your own membership | ✗ | ✗ | ✗ | ✗ | ✗ |
| Demote, deactivate or remove the final Owner | ✗ (even for trusted code) | ✗ | ✗ | ✗ | ✗ |
| Add members, create or answer invitations | Edge Function only (Phase 2.5) | Edge Function only | ✗ | ✗ | ✗ |
| Create, edit and assign tasks | ✓ | ✓ | ✗ | ✗ | ✗ |
| Set a task's status directly | ✗ | ✗ | ✗ | ✗ | ✗ |
| Record a decision | ✗ (D4) | ✗ (D4) | **Assigned tasks only** | ✗ | ✗ |
| Edit or delete a decision, delete a task or member | ✗ | ✗ | ✗ | ✗ | ✗ |
| Edit your own profile name | ✓ | ✓ | ✓ | ✓ | ✗ |

**How it's enforced:**
- Table and column privileges: signed-out visitors get nothing, and only named columns can be written.
- RLS policies.
- Guard triggers that apply to every caller, including the trusted Edge Functions:
  - the final Owner rule;
  - only the assigned, active Reviewer decides;
  - no decision on an Approved task;
  - a decision is always recorded as the signed-in user, in its task's workspace, at the current time;
  - decisions are append-only.
- **Task status only changes through a decision**, by trigger.

## 6. Seed (local only)

`supabase/seed.sql`:
- the "Cuidance Content Team" workspace;
- the five Week 10 / Week 11 sample tasks, unassigned, giving Review Queue counts of **3 / 1 / 1 / 0**.

No people are seeded. The seed runs only on a local `supabase start` or `supabase db reset`, never on the hosted project.

## 7. Database tests (Phase 2.1)

`supabase/tests/`, using pgTAP, run with `npm run db:test` at the repo root. Each file creates its own `example.com` test users (Owner, two Admins, two Reviewers, a non-member and another workspace's Owner) inside a transaction that's rolled back.

| File | What it checks |
| --- | --- |
| `01_schema_and_access_test.sql` | All six tables exist with RLS on. Signed-out visitors have no privileges and are refused. No deletes. Status, memberships, invitations and decisions can't be written directly. Helper and trigger functions are locked down. Every security definer function has an empty `search_path`. The allowed values match the screens |
| `02_profiles_test.sql` | Profiles are created automatically. Read your own and co-members' profiles, not outsiders'. Rename yourself only |
| `03_workspaces_and_members_test.sql` | Workspace isolation. Owner and Admin management rules (D5). No promotion to Owner. Content Editor can't be assigned (D3). No changing your own membership. No deletes. **The final Owner can't be demoted, deactivated or removed, even by trusted code.** With a second Owner, one can be demoted |
| `04_invitations_test.sql` | 7-day default expiry (D7). Can't invite an Owner or a Content Editor. One pending invitation per email. Owner sees all, Admin sees Reviewer invitations, Reviewer and non-member see none. No direct writes |
| `05_review_tasks_test.sql` | Members read and non-members don't. Owner and Admin create, as themselves, in their own workspace. Reviewers can't create or edit. Assignment only to active Reviewers in the workspace. No starting as Approved. No direct status changes. No deletes |
| `06_review_decisions_test.sql` | The assigned Reviewer approves (task becomes Approved). Request changes needs a real note (Needs changes). A new decision after Needs changes, then Approved, keeps both (D12). Nothing after Approved. Not on someone else's task (D4). A decision sent as someone else is recorded as the signed-in Reviewer. Admin, Owner and non-members can't decide (D4). No edits or deletes, even by trusted code. A deactivated Reviewer can't decide |
| `07_seed_and_counts_test.sql` | The seed matches the sample data. Counts are 3 / 1 / 1 / 0, then 2 / 1 / 1 / 0 after approving a guidance task |

**Result (Nov 11, 2026): 7 files, 114 tests, all passing. `supabase db lint`: no schema errors.** A deliberately wrong test failed as expected, confirming the harness catches failures.

**CI:** `.github/workflows/supabase-db-tests.yml` runs on pull requests that change `supabase/`, the root `package.json` or the workflow itself. It starts a local Supabase in the runner, resets the database from the migrations and seed, lints, and runs the tests. No secrets, and no connection to the hosted project. The GitHub Pages deploy workflow is unchanged.

**Tooling:** the Supabase CLI (3.1.0) is a development dependency in a new **repo-root** `package.json` (tools only). `admin-web/` and its GitHub Pages build are unchanged, so the deploy never downloads the CLI.

## 8. Notes and findings

1. **Trigger order:** PostgreSQL runs the guard triggers before the RLS check, so some refusals arrive as the trigger's plain message (code `P0001`) instead of an RLS error (`42501`). Both block the action. The app should show these messages as save errors (Phase 2.4).
2. **Email-link expiry vs. 7-day invitations:** the invitation row lasts 7 days (D7), but Supabase's emailed links usually expire much sooner. Phase 2.5 includes a **Resend invitation link** function. Please report the dashboard's email-link expiry value.
3. **Local development in Claude Code cloud sessions:** Docker images from `public.ecr.aws` are blocked there, so the CLI is pointed at Docker Hub with `SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io`. GitHub Actions runners don't need this.
4. **Applying to the hosted project:** only after the Phase 2.1 PR is approved and merged, through the Supabase GitHub connection or a team member's `supabase db push`. Never from an AI session.

## 9. Environment variables (later phases)

| Name | Type | Where | From |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Browser; `.env.local`; GitHub Actions variable | Phase 2.2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (RLS protects the data) | Same | Phase 2.2 |
| `NEXT_PUBLIC_DATA_MODE` | `sample` (default) or `supabase` | Build | Phase 2.2 |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | **Edge Functions only** (provided by Supabase) | Phase 2.5 |
| `ADMIN_SITE_URL` | Public | Edge Function settings | Phase 2.5 |

## 10. Phases

| Phase | Work | Status |
| --- | --- | --- |
| 2.0 | Decisions, project and dashboard verification | **Done** |
| 2.1 | Schema, RLS, triggers, seed, database tests, CI, CLAUDE.md | **Done** (merged; applied to the development project) |
| 2.2 | Data layer and data-mode switch (`sample` default); add `@supabase/supabase-js` | **Done** (Phase A2) |
| 2.3 | Sign In (D11), Sign out, session and route guards | **Done** (Phase A2) |
| 2.4 | Review Tasks, Review Task Detail (`/review-tasks/task/?id=`, D8) and Dashboard on real data | **Done** (Phase A2) |
| 2.5 | Invitation Edge Functions (create, get, respond, revoke, resend link); connect Accept Invitation, Account Setup, Team Access | **Built** (Phase A3, local; hosted rollout needs the owner, see `docs/Phase-A3/`) |
| 2.6 | End-to-end tests on staging, secret-scan check, docs | Planned |
