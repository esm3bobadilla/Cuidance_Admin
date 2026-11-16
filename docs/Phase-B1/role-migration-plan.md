# Role migration plan: Super Admin, Admin, Team Member

_Status: **design plan only.** Nothing in this document has been applied. No migration file, Edge Function change, test change or hosted change is part of this commit._

_Written Nov 16, 2026 for Team 03 review._

## 1. What is changing and why

Team 03 approved the Admin Web prototype as the new source of truth. It uses three roles:

| Today (Phase 2.0, D3 to D5) | New role | Notes |
| --- | --- | --- |
| Owner | **Super Admin** | Full control. Only role that changes roles and workspace settings. |
| Admin | **Admin** | Adds, removes and invites people. Invites as Team Member only. Cannot change roles. |
| Reviewer | **Team Member** | Reviews assigned work, drafts content and email. No Manage Team. |
| Content Editor (reserved, unused) | **Team Member** | Has zero rows today, so nothing moves. |

Team 03 asked for a **real migration**, not a relabel. That means the database values, Row Level Security (RLS), triggers, the invitations Edge Function, the app's role checks, navigation, page and action permissions, database tests and staging accounts all move together.

## 2. Ground rules

1. **No destructive step until rollback is documented and tested.** The old enum values (`owner`, `reviewer`, `content_editor`) stay in the database through stages 1 to 3 below.
2. **Every stage is its own reviewed pull request** with its own migration file in `supabase/migrations/` and matching tests in `supabase/tests/`.
3. **No hand changes to the hosted database.** Migrations reach it only through the reviewed GitHub connection or a team member's `supabase db push`.
4. **The final-Owner rule (D5) carries over as the final-Super-Admin rule.** No one may demote or remove the last active Super Admin.
5. **Sample mode stays the default.** The public GitHub Pages site is not affected by any stage.

## 3. Stages

### Stage 1: add the new values (additive only)

- Migration `…_roles_add_values.sql`:
  - `alter type public.workspace_role add value if not exists 'super_admin';`
  - `alter type public.workspace_role add value if not exists 'team_member';`
- These must sit in their own migration, because Postgres can't use a newly added enum value in the same transaction that adds it.
- Nothing reads the new values yet. **Rollback:** none needed (unused values are harmless). Removing them later is part of Stage 4.

### Stage 2: dual-read permissions

- Migration `…_roles_dual_read.sql` replaces, without dropping data:
  - `public.has_role(...)`: treats `owner` and `super_admin` as the same role, and `reviewer`, `content_editor` and `team_member` as the same role.
  - Triggers in `20261111060200_functions_and_triggers.sql`: final-Owner guard (D5), reviewer-only decisions (D4) and the re-decide rule (D12) check the role *group*, not one literal value.
  - RLS policies in `20261111060300_rls_and_grants.sql`: the "who may manage whom" rules (Owner manages Admins and Reviewers, Admin manages Reviewers) are rewritten as "Super Admin manages Admins and Team Members, Admin manages Team Members".
  - The `invitations.role` check accepts `admin`, `reviewer` **and** `team_member`.
- Edge Function `supabase/functions/_shared/invitation-rules.ts`: `WorkspaceRole` gains the new values; `canInvite` maps both old and new.
- Tests: every existing pgTAP test keeps passing, and a copy of the permission tests runs against members holding the **new** values.
- **Rollback:** re-apply the Stage 1 versions of the functions and policies (kept in the migration as a commented "down" block and in `supabase/rollback/` if the team wants it as a file). Data is untouched, so rollback is safe.

### Stage 3: move the data

- Migration `…_roles_move_data.sql`:
  - `update workspace_members set role = 'super_admin' where role = 'owner';`
  - `update workspace_members set role = 'team_member' where role in ('reviewer', 'content_editor');`
  - Pending invitations: `reviewer` becomes `team_member`.
  - The `invitations.role` check now allows only `admin` and `team_member`.
- The final-Super-Admin trigger is checked inside this migration: the update keeps the same number of top-role members, so it can't trip.
- App: role labels, nav visibility and action permissions read the new values (see section 4).
- Staging: re-seed the six `example.com` accounts with the new roles (Super Admin A, Admin A, Team Members A to C, one account with no access). No real names, no emails sent.
- **Rollback:** the reverse updates (`super_admin` back to `owner`, `team_member` back to `reviewer`). This is lossless because Content Editor had zero rows. Kept as a tested script.

### Stage 4: remove the old values (destructive, later)

- Only after Stage 3 has run on staging, the team has signed off, and the rollback script has been run once against a local database.
- Postgres can't drop an enum value directly, so this stage recreates the type: new type with `super_admin`, `admin`, `team_member`; `alter table … alter column role type … using role::text::new_type`; drop the old type; rename.
- `has_role` loses its dual-read mapping.
- **Rollback:** a reverse migration that recreates the four-value type. Documented and tested before Stage 4 is approved.

## 4. App changes (ride with Stage 3)

| Area | Super Admin | Admin | Team Member |
| --- | --- | --- | --- |
| Manage Team in navigation | Yes | Yes | **Hidden** |
| Invite people | Yes, as Admin or Team Member | Yes, as Team Member | No |
| Change someone's role | Yes, not their own | No | No |
| Remove or deactivate people | Yes | Team Members only | No |
| Workspace settings | Edit | View | View |
| Create and edit content | Yes | Yes | Yes (drafts, send for review) |
| Assign review tasks | Anyone | Anyone | Team Members only |
| Record a review decision | When assigned | When assigned | When assigned |
| Email | Draft and (future) send | Draft and (future) send | Drafts only |
| Live updates | (future) push | (future) push | (future) push approved updates only |
| Metrics | View | View | View |

Sending email and pushing Live updates are **not built** in this phase (provider and integrations not approved). The table records the permission so it's ready when they are.

Files that read roles today and will change:

- `shared/content/admin-roles.ts`, `shared/content/team-access.ts`, `shared/content/invitation.ts`
- `shared/review-loop/supabase-mapping.ts`
- `admin-web/app/_settings/LiveTeamAccess.tsx`
- Role labels in `admin-web/app/_rules/`, `_claims/`, `_sources/`
- Navigation visibility in the new Sidebar (Phase 1 builds it role-aware, using sample-mode roles)

## 5. Decisions Team 03 still needs to make

1. **Who can be assigned a review?** The prototype lets Admins assign anyone. Today only Reviewers can be assigned (D4). Proposal: any active member can be assigned, and only the assignee records the decision.
2. **Can a Super Admin approve their own content?** Proposal: no; a different person must be assigned.
3. **Stage 4 timing.** Proposal: not before the staging re-seed has been used for one full review cycle.
4. **Database tests.** 114 pgTAP tests use the old names. Proposal: Stage 2 duplicates the permission tests for new values; Stage 4 renames the rest.

## 6. What this commit does not do

- No migration file, no change to RLS, triggers, the Edge Function, tests or seed.
- No hosted Supabase change.
- The Phase 1 shell shows the new role names in **sample mode only**, so designers can review navigation. Supabase mode keeps today's roles until Stage 3.
