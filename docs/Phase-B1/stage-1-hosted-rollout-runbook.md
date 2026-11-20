# Role migration Stage 1: hosted rollout runbook

_Prepared Nov 18, 2026. **Executed by a Team 03 member on Nov 19, 2026** (backups, dry run, database migrations, Edge Function deploy), then verified read-only. Results: [`role-migration-stage-1.md`](role-migration-stage-1.md#hosted-rollout-applied-nov-19-2026). Kept as the reference procedure for later stages and for the rollback. Run only by a team member on their own computer, never from an AI session (CLAUDE.md)._

## 1. Target

| Item | Value |
| --- | --- |
| Supabase project | **Cuidance Admin Web — Development** |
| Project ref | `ewsitaheidkfmjwguqlm` (region us-east-1, Postgres 17, status ACTIVE_HEALTHY) |
| Not the public app's project | Confirmed (D1) |
| Repository commit | `main` at `61bdd5e` (merge of PR #22) or later |
| Supabase CLI | 3.1.0 (repo root `package.json`; run `npm ci` at the repo root) |

## 2. What will change

**Database: exactly two migrations** (hosted currently has the four Phase 2.1 migrations only):

1. `20261118060000_roles_stage1_add_values.sql`: adds `super_admin` and `team_member` to the role list. Nothing renamed or removed.
2. `20261118060100_roles_stage1_mapping_and_rules.sql`:
   - adds the mapping and helper functions (`role_group`, `member_group`, `has_group`);
   - replaces `has_role` and three trigger functions (`create or replace`);
   - replaces 6 RLS policies and the invitation role check (drop and re-create in the same file).

   It adds, deletes and changes **no rows**.

**Edge Function `invitations`:** from deployed version 1 (verified identical to the pre-Stage-1 repo code) to the `main` version. JWT verification stays on (`verify_jwt = true` in `supabase/config.toml`). The secret `ADMIN_SITE_URL` stays as it is.

**Not changed:** stored roles, users, tasks, decisions, invitations, Auth settings, SMTP and email templates, the GitHub Pages site (sample mode, D9).

## 3. Pre-flight state (read-only, checked Nov 18)

| Check | Hosted now |
| --- | --- |
| Migrations applied | 4 (`20261111060000` to `20261111060300`) |
| Role values | `owner, admin, reviewer, content_editor` |
| Users / members / tasks / decisions / invitations | 6 / 5 / 5 / 0 / 0 |
| Stored member roles | `owner` ×1, `admin` ×1, `reviewer` ×3 (all `example.com`) |
| Tasks | All 5 sent by `owner.a`, assigned to `reviewer.a`, `reviewer.b`, `reviewer.c`. None self-assigned |
| Rules the migration rewrites | Functions, policies, invitation role check, function grants and triggers: **fingerprint-identical** to the Phase 2.1 baseline tested locally and in CI |
| Security advisor | 4 warnings (helper functions callable by signed-in users, by design) + 1 Auth notice (leaked-password protection off) |

## 4. Backup (before anything else)

Store the dumps **outside the repository** (they hold data, even though it's all `example.com`). Never commit them.

```bash
cd Cuidance_Admin && git checkout main && git pull --ff-only   # at 61bdd5e or later
npm ci                                                           # Supabase CLI 3.1.0
npx supabase login
mkdir -p ~/cuidance-backups/2026-11-18-pre-stage1
npx supabase db dump --remote=ewsitaheidkfmjwguqlm -f ~/cuidance-backups/2026-11-18-pre-stage1/schema.sql
npx supabase db dump --remote=ewsitaheidkfmjwguqlm --data-only -f ~/cuidance-backups/2026-11-18-pre-stage1/data.sql
npx supabase db dump --remote=ewsitaheidkfmjwguqlm --role-only -f ~/cuidance-backups/2026-11-18-pre-stage1/roles.sql
```

Each command asks for the database password; type it at the prompt. Never put it in a file, the repo or chat. `db dump` may need Docker running.

Check: all three files exist and aren't empty. `data.sql` should mention 5 `review_tasks` rows.

## 5. Dry run (changes nothing)

```bash
npx supabase migration list --remote=ewsitaheidkfmjwguqlm
npx supabase db push --remote=ewsitaheidkfmjwguqlm --skip-vault --dry-run
```

**Expected:**
- `migration list` shows the 4 Phase 2.1 migrations as applied on both sides, and the two `20261118…` migrations as local only.
- The dry run lists **exactly** `20261118060000_roles_stage1_add_values.sql` and `20261118060100_roles_stage1_mapping_and_rules.sql`.

**Stop** if it lists anything else, or asks to "include all".

Never add `--include-all`, `--include-seed` or `--include-roles`: the seed is local-only, and roles aren't part of this change. `--skip-vault` makes sure nothing touches Vault secrets (the Vault section in `config.toml` is commented out anyway).

## 6. Apply (step 1 of 2: database)

```bash
npx supabase db push --remote=ewsitaheidkfmjwguqlm --skip-vault
```

Each migration runs in its own transaction. If the second one fails, only the two unused role values are added (harmless), and nothing else changes. Stop and report.

Then run the verification in section 8 **before** deploying the function.

## 7. Apply (step 2 of 2: Edge Function)

```bash
npx supabase functions deploy invitations --remote=ewsitaheidkfmjwguqlm --use-api
```

Don't add `--no-verify-jwt` or `--prune`. Expected: `invitations` becomes version 2 and stays ACTIVE, with JWT verification on.

**Why this order is safe:**
- **Database first:** the current function (version 1) only creates `admin` and `reviewer` invitations, and the new database still accepts both. So invitations keep working between the two steps.
- **The reverse order would also fail safely:** the new function's `team_member` invitation would be refused by the old database check before any email is sent. Nothing would be stored.
- **Today:** there are 0 invitations, so no existing row is affected.

## 8. Verification (read-only SQL, Supabase SQL editor)

```sql
-- 1. Six migrations, the two new ones last
select version, name from supabase_migrations.schema_migrations order by version;

-- 2. All six role values, legacy ones first and unchanged
select enum_range(null::public.workspace_role);
-- expect {owner,admin,reviewer,content_editor,super_admin,team_member}

-- 3. No data changed (compare with section 3)
select (select count(*) from auth.users) users, (select count(*) from public.workspace_members) members,
       (select count(*) from public.review_tasks) tasks, (select count(*) from public.review_decisions) decisions,
       (select count(*) from public.invitations) invitations,
       (select string_agg(role::text, ',' order by role::text) from public.workspace_members) stored_roles;
-- expect 6 | 5 | 5 | 0 | 0 | admin,owner,reviewer,reviewer,reviewer

-- 4. The mapping reads the staging accounts correctly
select u.email, m.role, public.role_group(m.role)
from public.workspace_members m join auth.users u on u.id = m.user_id order by u.email;
-- expect admin.a -> admin; owner.a -> super_admin; reviewer.a/b/c -> team_member

-- 5. Invitation role check accepts the new value
select pg_get_constraintdef(oid) from pg_constraint where conname = 'invitations_role_check';
-- expect admin, reviewer, team_member

-- 6. The six new policy names
select tablename, policyname from pg_policies where schemaname = 'public' order by 1, 2;
```

Security advisor after the rollout: expect **2 more warnings** of the existing kind, for `member_group` and `has_group` (helpers the RLS policies call; they only reveal the caller's own role group). Nothing else new.

Functional check, signed in on a Supabase-mode build:
- `owner.a` shows as Super Admin.
- `admin.a` shows as Admin.
- `reviewer.a` shows as Team Member and can still record a decision on their assigned task.
- `no.access` sees nothing.

**Don't create invitations on hosted:** that sends real email, and email stays off (Option C, D6).

## 9. Rollback

**If the dry run or step 6 shows anything unexpected:** stop. Nothing needs undoing; at most the two unused role values were added.

**To undo after a successful rollout:**
1. Function first: redeploy version 1's code.
   ```bash
   git checkout 1897ea5 -- supabase/functions
   npx supabase functions deploy invitations --remote=ewsitaheidkfmjwguqlm --use-api
   git checkout main -- supabase/functions
   ```
2. Database, through a reviewed PR:
   - Copy `supabase/rollback/20261118_roles_stage1_rollback.sql` into a new migration (for example `supabase/migrations/2026MMDDHHMMSS_roles_stage1_rollback.sql`).
   - Open a PR, get a review, merge, then run sections 5 and 6 again.

   The script, in one transaction:
   - maps any new values back (`super_admin` → `owner`, `team_member` → `reviewer`);
   - restores the Phase 2.1 functions, policies and invitation check, copied verbatim;
   - drops the mapping functions;
   - lists open tasks assigned to an Admin, to reassign.

   Tested locally: the result is identical to Phase 2.1 (127 objects). The two enum values stay, unused (Postgres can't drop enum values).
3. **Last resort only** (data damage, which Stage 1 can't cause because it changes no rows): restore from the section 4 dumps, with a team decision first.

## 10. Readiness checklist

| # | Item | Status |
| --- | --- | --- |
| 1 | Correct project confirmed (name, ref, Postgres 17, healthy, not the public app's) | Ready |
| 2 | Hosted has only the 4 Phase 2.1 migrations; merging PR #22 didn't auto-apply anything | Ready |
| 3 | Migration files reviewed: additive only, no row changes, legacy values kept | Ready |
| 4 | Hosted rules identical to the tested baseline | Ready |
| 5 | Tests: 157/157 on real Supabase CI; staging replica 29/29; rollback verified | Ready |
| 6 | Edge Function: deployed version 1 = pre-Stage-1 code; new version passes `deno check` and 14/14 rule checks | Ready |
| 7 | Invitations safe: 0 rows today; the new check is a superset; both deploy orders fail safely | Ready |
| 8 | Commands verified against CLI 3.1.0 help (`--remote=<ref>`, `--skip-vault`, `--dry-run`, `--use-api`) | Ready |
| 9 | Backup dumps taken (section 4) | Done by the team, Nov 19 (stored on the team member's computer, not in the repo) |
| 10 | Dry run lists exactly the two Stage 1 migrations (section 5) | Done by the team, Nov 19 |
| 11 | Team 03 approval to run sections 6 and 7 | Given; both ran with exit code 0 |

## Appendix: section 4 backups on Windows PowerShell

The same backups as section 4, for Windows. Docker Desktop must be running (`docker info` works). If PowerShell says "running scripts is disabled", use `npx.cmd` instead of `npx`.

```powershell
cd C:\path\to\Cuidance_Admin
git checkout main
git pull --ff-only
npm ci
npx supabase --version          # expect 3.1.0
npx supabase login

$Backup = Join-Path $env:USERPROFILE "cuidance-backups\YYYY-MM-DD-pre-stageN"
New-Item -ItemType Directory -Force -Path $Backup

npx supabase db dump --remote=ewsitaheidkfmjwguqlm -f "$Backup\schema.sql"; $LASTEXITCODE
npx supabase db dump --remote=ewsitaheidkfmjwguqlm --data-only -f "$Backup\data.sql"; $LASTEXITCODE
npx supabase db dump --remote=ewsitaheidkfmjwguqlm --role-only -f "$Backup\roles.sql"; $LASTEXITCODE
```

Type the database password only at the prompt, never on the command line.

**Confirm each backup completed:**
- every `$LASTEXITCODE` prints `0`;
- `Get-ChildItem $Backup | Select-Object Name, Length` lists all three files, with `schema.sql` and `data.sql` well above zero (`roles.sql` can be small);
- `Select-String -Path "$Backup\schema.sql" -Pattern "review_tasks" -List` finds a line;
- `Select-String -Path "$Backup\data.sql" -SimpleMatch "Understanding sensitive skin" -List` finds a line.

Never commit, email or share the backup files.
