# Phase 3: remote branch inventory

_Checked Nov 20, 2026 against `main` at `f525d6e`. No branch has been deleted._

**Status:** waiting for Team 03 to confirm that GitHub Pages builds from **GitHub Actions** (Settings, Pages, Source), as asked, before any deletion. This session also cannot delete remote branches: a test deletion of one merged branch was refused (HTTP 403 from the proxy), so a team member deletes them on GitHub or with the commands below.

## Fully merged: every commit is already in `main` (19)

18 are safe to delete now. `deploy-github-pages` becomes safe once Pages is confirmed to build from GitHub Actions. (An earlier chat summary said 18 in total and folded `deploy-github-pages` into that number; the correct total is 19.)

| Branch | Last commit | Notes |
| --- | --- | --- |
| `chore/nextjs-16.4.6-security` | 2026-11-17 | PR #21 |
| `deploy-github-pages` | 2026-10-26 | Delete only after confirming Pages builds from GitHub Actions |
| `docs/stage1-hosted-rollout-record` | 2026-11-20 | PR #23 |
| `feat/admin-web-dashboard-screen` | 2026-10-27 | |
| `feat/admin-web-dev-404` | 2026-10-30 | |
| `feat/admin-web-foundation` | 2026-11-16 | PR #20 |
| `feat/admin-web-prototype-alignment` | 2026-11-06 | |
| `feat/admin-web-review-tasks` | 2026-10-28 | |
| `feat/admin-web-route-map` | 2026-10-27 | |
| `feat/admin-web-scaffold` | 2026-10-26 | |
| `feat/admin-web-theme-responsive` | 2026-11-05 | |
| `feat/phase-2-1-supabase-schema` | 2026-11-11 | |
| `feat/phase-a1-admin-web-completion` | 2026-11-11 | |
| `feat/phase-a2-admin-web-supabase` | 2026-11-12 | |
| `feat/phase-a3-invitations` | 2026-11-12 | |
| `feat/phase-a4-release-readiness` | 2026-11-13 | |
| `feat/role-migration-stage-1` | 2026-11-18 | PR #22 |
| `feat/week-11-account-setup` | 2026-11-10 | |
| `feat/week-11-review-task-loop` | 2026-11-06 | |

How "merged" was checked: `git merge-base --is-ancestor <branch> origin/main` is true for each one, so no commit would be lost.

## Keep

| Branch | Why |
| --- | --- |
| `main` | Default branch |
| `claude/clever-goldberg-vgmhex` | Active Phase 3 work |
| `docs/hosted-rollout-record` | 2 commits not in `main` (Rollout 1 to 3 records, `db2af05`, `4d87c73`). Team 03 decides whether to merge or keep them |
| Any teammate branch for product images and information | Active shared work: not inventoried for deletion, never touched |

## When approved

On GitHub: Code, Branches, the trash icon beside each branch. Or, from a clone:

```bash
git push origin --delete chore/nextjs-16.4.6-security docs/stage1-hosted-rollout-record \
  feat/admin-web-dashboard-screen feat/admin-web-dev-404 feat/admin-web-foundation \
  feat/admin-web-prototype-alignment feat/admin-web-review-tasks feat/admin-web-route-map \
  feat/admin-web-scaffold feat/admin-web-theme-responsive feat/phase-2-1-supabase-schema \
  feat/phase-a1-admin-web-completion feat/phase-a2-admin-web-supabase feat/phase-a3-invitations \
  feat/phase-a4-release-readiness feat/role-migration-stage-1 feat/week-11-account-setup \
  feat/week-11-review-task-loop
# then, after the Pages check:
git push origin --delete deploy-github-pages
```
