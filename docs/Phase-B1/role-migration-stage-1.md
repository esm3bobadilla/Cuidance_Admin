# Role migration Stage 1: Super Admin, Admin, Team Member

_Team 03 decisions of Nov 16, 2026. Additive and reversible. Merged in PR #22 (`61bdd5e`). **Applied to the hosted project on Nov 19, 2026** and verified read-only (see [Hosted rollout](#hosted-rollout-applied-nov-19-2026)). One check is still pending: signing in as the staging accounts._

## What Stage 1 does

1. **Adds the new role values** `super_admin` and `team_member` (`20261118060000_roles_stage1_add_values.sql`). Nothing is renamed or removed.
2. **Adds one explicit mapping** (`public.role_group()`, in `20261118060100_roles_stage1_mapping_and_rules.sql`). Every database rule reads roles through it:

   | Stored value | Role group |
   | --- | --- |
   | `owner`, `super_admin` | Super Admin |
   | `admin` | Admin |
   | `reviewer`, `content_editor`, `team_member` | Team Member |

   The app (`shared/content/permissions.ts`, `legacyRoleMap`) and the invitations Edge Function (`supabase/functions/_shared/invitation-rules.ts`, `roleGroup`) use the same mapping.
3. **Rewrites the rules on role groups:** RLS policies, the membership, task and decision triggers, the invitation role check, the invitations Edge Function and the app's live role checks.
4. **Changes no stored data.** Existing members keep their legacy values (staging: `owner`, `admin`, `reviewer`). New invitations from the app use `team_member` and `admin`.

## Permission differences (before Stage 1 → after)

| Rule | Phase 2.1 (before) | Stage 1 (after) |
| --- | --- | --- |
| Who may be assigned a review | Reviewers only | Admins and Team Members. Super Admins never |
| Who may create (send) a task | Owners and Admins | Any member, as themselves |
| Who may assign | Owners and Admins, to Reviewers | Super Admins and Admins to Admins and Team Members; Team Members to Team Members only |
| Who may edit or reassign a task | Owners and Admins, any task | Super Admins and Admins any task; Team Members only tasks they sent |
| Who records a decision | The assigned Reviewer | The assigned reviewer (an Admin or Team Member) |
| Reviewer separation | Not enforced (Owners and Admins couldn't be assigned) | No one is assigned to, or decides on, a task they created, so no one approves their own content, Super Admins included |
| Workspace settings | Owner | Super Admin (legacy Owner) |
| Manage members | Owner: Admins and Reviewers; Admin: Reviewers | Super Admin: Admins and Team Members; Admin: Team Members |
| Final-Owner protection (D5) | Last `owner` | Last Super Admin, counting `owner` and `super_admin` together |
| Invitations | Owner invites Admin or Reviewer; Admin invites Reviewer | Super Admin invites Admin or Team Member; Admin invites Team Member (`reviewer` still accepted) |
| Content Editor (D3) | Reserved | Still reserved: can't be assigned or invited |

Unchanged: D7 (7-day invitations), D12 (decide again after Needs changes), append-only decisions, status only through decisions, workspace isolation, signed-out visitors see nothing.

Error messages kept word for word where the rule's meaning didn't change ("The final Owner can't be…", "Only the assigned Reviewer can…"), so existing callers keep matching them. Two new messages: "You can't be assigned to review a task you created." and "You can't record a decision on a task you created."

## Rollback plan

`supabase/rollback/20261118_roles_stage1_rollback.sql` (outside `migrations/`, so it never runs by itself). In one transaction it:

1. maps new values back (`super_admin` → `owner`, `team_member` → `reviewer`) in memberships and invitations: lossless, because the groups match;
2. restores the Phase 2.1 invitation role check;
3. restores the Phase 2.1 functions and RLS policies, copied verbatim from the Phase 2.1 migrations;
4. drops the mapping functions;
5. lists open tasks assigned to an Admin, which must be reassigned to a Reviewer under the old rules.

It can't remove the two enum values (Postgres has no `drop value`); they stay unused and harmless.

**Verified locally** (PostgreSQL 16 with pgTAP and a minimal Supabase `auth` stand-in):
- With new-value data: members and invitations map back correctly, and the Admin-assigned task is listed.
- Without data: functions, policies, constraints and grants are **identical to Phase 2.1 (127 objects compared)**.
- The original 114 tests from `main` then pass, except the one that lists the exact role values (it sees the two unused values).

To run it: a team member puts the script's body in a new reviewed migration and applies it with `supabase db push`. Never by hand on the hosted project, never from an AI session.

## Deployment order

1. Database: the two Stage 1 migrations (reviewed GitHub connection or `supabase db push`).
2. Edge Function: deploy `invitations`. Until then, the hosted function rejects `team_member` invitations (`invalid-role`).
3. Frontend: already compatible with both the old and the new database, because it reads roles through the mapping. GitHub Pages stays in sample mode (D9).

The step-by-step procedure, with backups, a dry run, verification and rollback: [`stage-1-hosted-rollout-runbook.md`](stage-1-hosted-rollout-runbook.md).

## Hosted rollout (applied Nov 19, 2026)

A Team 03 member ran the runbook on their own computer:
1. backups (schema, data, roles), stored on that computer and not in the repo;
2. the dry run;
3. `supabase db push` for the database;
4. `supabase functions deploy` for the Edge Function.

Both deploy commands finished with exit code 0. Claude Code then ran the section 8 checks **read-only** (no hosted change).

**Project:** Cuidance Admin Web, development project `ewsitaheidkfmjwguqlm` (Postgres 17).

**Applied migrations** (hosted now has 6):

| Version | Name |
| --- | --- |
| `20261111060000` to `20261111060300` | Phase 2.1 (unchanged) |
| `20261118060000` | `roles_stage1_add_values` |
| `20261118060100` | `roles_stage1_mapping_and_rules` |

**Edge Function `invitations`:** version 2, ACTIVE, JWT verification on. Deployed 2026-11-19 23:10 UTC, replacing version 1 (the pre-Stage-1 code). It contains the Stage 1 code: the role mapping, and the invitation values `admin`, `team_member`, `reviewer`. The `ADMIN_SITE_URL` secret was unchanged.

### Verification results (read-only, Nov 19, 2026)

| # | Check | Result |
| --- | --- | --- |
| 1 | Migrations applied | Pass: the 6 above |
| 2 | Role values | Pass: `owner, admin, reviewer, content_editor, super_admin, team_member`. Every legacy value kept |
| 3 | No data changed | Pass: 6 users (all `example.com`), 1 workspace, 5 members, 5 tasks, 0 decisions, 0 invitations. Stored roles still `admin`, `owner`, `reviewer` ×3, identical to before the rollout |
| 4 | Mapping reads each staging account correctly | Pass: `owner.a` → Super Admin, `admin.a` → Admin, `reviewer.a`, `reviewer.b`, `reviewer.c` → Team Member, all active. All 5 tasks sent by `owner.a` to a reviewer, none self-assigned |
| 5 | Invitation role check | Pass: allows `admin`, `reviewer`, `team_member` |
| 6 | Permission rules | Pass: the 6 Stage 1 policies are in place with the reviewed names; `role_group`, `member_group` and `has_group` exist, callable by signed-in users only |
| 7 | Hosted matches what was tested | Pass: 146 of 146 objects (functions, policies, checks, grants, triggers) match a local database built from the same migrations, after the line-ending note below |
| 8 | Edge Function | Pass: version 2, ACTIVE, JWT verification on, Stage 1 code |
| 9 | Security advisor | As expected: see below |

**Line-ending note.** The rollout ran from a Windows checkout, so the 7 functions the Stage 1 migrations create or replace were stored with Windows line endings:
- `role_group`, `member_group`, `has_group`, `has_role`;
- `guard_workspace_member`, `guard_review_task`, `guard_review_decision`.

With those characters removed, all 7 match the reviewed code exactly. This is harmless: in SQL and PL/pgSQL they count as spaces, and none of the code's text (error messages, role names) spans a line break. Policies matched as they were, because Postgres rewrites them into its own form. The new `.gitattributes` rule (`*.sql` and `*.ts` with Unix line endings) keeps future rollouts byte-identical to what's reviewed. The Edge Function files also carry Windows line endings, which doesn't change how they run.

### Security advisor (expected warnings)

| Warning | Before | After | Why it's expected |
| --- | --- | --- | --- |
| Signed-in users can run a `SECURITY DEFINER` function (lint 0029) | 4 (`has_role`, `is_member`, `member_role`, `shares_workspace`) | **6**: the same 4 plus `has_group` and `member_group` | Helpers the RLS policies call. They only reveal whether the caller is a member, and the caller's own role group. Accepted in Phase A4 for the first four. The two new ones were predicted before the rollout |
| Leaked password protection disabled (Auth) | 1 | 1 | Unchanged by Stage 1. An Auth setting for the team to decide |

Nothing else new.

### Still pending

- **Staging sign-in check (Team 03).** Sign in on a Supabase-mode build and confirm:
  - `owner.a` shows as Super Admin and sees Manage Team;
  - `admin.a` shows as Admin;
  - `reviewer.a` shows as Team Member and can still record a decision on a task assigned to them;
  - `no.access` sees no workspace data.

  Claude Code couldn't do this: the staging passwords aren't available to it, and resetting them would be a hosted change.
- **Don't create invitations on hosted** to test: that sends real email, and email stays off until the team picks a provider (D6).

## Staging accounts (six `example.com` accounts)

Before the rollout, the hosted project was checked read-only:
- Hosted has only the 4 Phase 2.1 migrations; the role list is `owner, admin, reviewer, content_editor`.
- The six accounts: `owner.a` (owner → Super Admin), `admin.a` (admin → Admin), `reviewer.a`, `reviewer.b`, `reviewer.c` (reviewer → Team Member), `no.access` (no membership). No other users.
- The 5 tasks were all sent by `owner.a` and assigned to `reviewer.a`, `reviewer.b` or `reviewer.c`. None is self-assigned, so Stage 1 leaves every existing task decidable by its current reviewer.

Then the same six accounts, roles and assignments were replicated locally on a database **with** Stage 1: **29 of 29 checks pass** (each account's visibility, settings, member management, invitations, assigning, reassigning and decisions).

Sign-in on hosted staging was not repeated: the staging passwords weren't available to Claude Code, and resetting them would be a hosted change. It is the one pending check above.

## Next stages (not started)

- **Stage 3, move the data:** `owner` → `super_admin`, `reviewer` → `team_member` on hosted, with the staging re-seed.
- **Stage 4, remove the legacy values:** only after Stage 3 has run on staging, the team has signed off and the rollback has been rehearsed.
