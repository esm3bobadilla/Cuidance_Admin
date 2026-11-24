# Phase 3: remote branch inventory

_Updated Nov 24, 2026. Cleanup is complete._

## Outcome

1. **Phase 3 is merged:** PR #27, "Phase 3: Visual polish, accessibility and QA", merged into `main` on Nov 23, 2026 as merge commit `31fef45` (regular merge commit, approved by Alyssa on `b7aff13`).
2. **GitHub Pages deployed it:** the "Deploy Admin Web to GitHub Pages" run for `31fef45` (run #23) succeeded, including the sample-mode check and the `deploy-pages` step. Pages publishes from **GitHub Actions**: the deploy step only works with that setting, and the repository has no branch-based "pages build and deployment" job.
3. **The 20 approved branches were deleted** on Nov 23, 2026, after a final check that each had no commits outside `main`. They were deleted on GitHub outside the build session, which can't delete branches (HTTP 403 from its connection). Verified Nov 23, 2026: none of the 20 remain.

## Deleted (20, all fully merged into `main`)

| Branch | Last commit |
| --- | --- |
| `chore/nextjs-16.4.6-security` | Nov 17 |
| `claude/clever-goldberg-vgmhex` (Phase 3) | Nov 23 |
| `deploy-github-pages` | Oct 26 |
| `docs/stage1-hosted-rollout-record` (PR #23; a different branch from `docs/hosted-rollout-record`) | Nov 20 |
| `feat/admin-web-dashboard-screen` | Oct 27 |
| `feat/admin-web-dev-404` | Oct 30 |
| `feat/admin-web-foundation` | Nov 16 |
| `feat/admin-web-prototype-alignment` | Nov 6 |
| `feat/admin-web-review-tasks` | Oct 28 |
| `feat/admin-web-route-map` | Oct 27 |
| `feat/admin-web-scaffold` | Oct 26 |
| `feat/admin-web-theme-responsive` | Nov 5 |
| `feat/phase-2-1-supabase-schema` | Nov 11 |
| `feat/phase-a1-admin-web-completion` | Nov 11 |
| `feat/phase-a2-admin-web-supabase` | Nov 12 |
| `feat/phase-a3-invitations` | Nov 12 |
| `feat/phase-a4-release-readiness` | Nov 13 |
| `feat/role-migration-stage-1` | Nov 18 |
| `feat/week-11-account-setup` | Nov 10 |
| `feat/week-11-review-task-loop` | Nov 6 |

## Kept (the three intended branches)

| Branch | Why |
| --- | --- |
| `main` | Default branch (`31fef45` after Phase 3) |
| `docs/hosted-rollout-record` | 2 commits not in `main` (Rollout 1 to 3 records, `db2af05`, `4d87c73`). Team 03 decides whether to merge or keep them |
| `feat/product-library-reference-products` | Alyssa's product branch (PR #26, merged). Fully merged, but kept until she confirms |

How "fully merged" was checked: `git rev-list --count origin/main..origin/<branch>` was 0 for every deleted branch, so no commit was lost.

**Note:** after the cleanup, `claude/clever-goldberg-vgmhex` was started again from `main` (`31fef45`) for the Admin Web polish pass. It's the only branch this build session can push to, and it's a new short-lived branch for that one pull request.
