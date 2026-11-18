# Role migration Stage 1: Super Admin, Admin, Team Member

_Branch `feat/role-migration-stage-1`, from `main` at `1897ea5`. Team 03 decisions of Nov 16, 2026. Additive and reversible._

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

## Deployment order (for the team, after review and merge)

1. Database: the two Stage 1 migrations (reviewed GitHub connection or `supabase db push`).
2. Edge Function: deploy `invitations`. Until then, the hosted function rejects `team_member` invitations (`invalid-role`).
3. Frontend: already compatible with both the old and the new database, because it reads roles through the mapping. GitHub Pages stays in sample mode (D9).

## Staging accounts (six `example.com` accounts)

The hosted project was **not changed**. Checked read-only:
- Hosted has only the 4 Phase 2.1 migrations; the role list is `owner, admin, reviewer, content_editor`.
- The six accounts: `owner.a` (owner → Super Admin), `admin.a` (admin → Admin), `reviewer.a`, `reviewer.b`, `reviewer.c` (reviewer → Team Member), `no.access` (no membership). No other users.
- The 5 tasks were all sent by `owner.a` and assigned to `reviewer.a`, `reviewer.b` or `reviewer.c`. None is self-assigned, so Stage 1 leaves every existing task decidable by its current reviewer.

Then the same six accounts, roles and assignments were replicated locally on a database **with** Stage 1: **29 of 29 checks pass** (each account's visibility, settings, member management, invitations, assigning, reassigning and decisions).

Sign-in on hosted staging was not repeated: the staging passwords aren't available in this session, and resetting them would be a hosted change.

## Next stages (not in this PR)

- **Stage 3, move the data:** `owner` → `super_admin`, `reviewer` → `team_member` on hosted, with the staging re-seed.
- **Stage 4, remove the legacy values:** only after Stage 3 has run on staging, the team has signed off and the rollback has been rehearsed.
