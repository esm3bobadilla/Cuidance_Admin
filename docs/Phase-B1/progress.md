# Phase B1 progress: Admin Web prototype implementation

_Branch: `feat/admin-web-foundation` (from `main` at `ff3daed`). Not merged. No pull request yet._

Source of truth: the approved standalone Admin Web prototype and the Week 8 design system board.
Prototype-only controls (Back, Restart, Spots, Sign in, Create account, role selector, device
switcher, prototype labels) are **not** implemented.

## Done

### Role migration design (commit `1145045`)
- [x] `docs/Phase-B1/role-migration-plan.md`: Owner to Super Admin, Admin to Admin, Reviewer and Content Editor to Team Member, in four stages. Additive first, rollback per stage. **No database change made.**

### Phase 1: shared foundation
- [x] Tokens (`shared/design-tokens/tokens.css`): shell greens, solid and soft icon badges, role colors (light and dark), approved drawer and dialog elevation, rail, header and drawer sizes
- [x] Display settings: text size (Default, Large, Larger) on every type token, density, high contrast (also follows the device), reduce motion (also follows the device), always show focus; applied before first paint; forced-colors focus ring
- [x] cu-icons as a React SVG component (`CuIcon`), no icon font dependency
- [x] Approved prototype assets in `shared/brand/` (cream mark, illustrations, heroes, empty states, category tiles, metric icons, glance glyphs). Email and Live images wait for their phases
- [x] Shell: sidebar sections (Main, Account) with icon badges and an active bar; desktop collapse to the 92 px rail (saved per device); tablet rail with an Expand drawer; phone Menu drawer; workspace search (combobox)
- [x] Components: Drawer, Dialog, Popover, Tabs, Chip, Toggle (switch), UploadField (required alt text, local preview only), HeroBanner
- [x] Settings: Accessibility & display section
- [x] `/dev` preview of every new component

### Phase 2: page migration (Nov 16, 2026)
Team 03 decisions applied first: single Light / Dark button; Compass Blue active nav (checked against the latest prototype code: `#1E2650` row, `#9AABFF` badge, no terracotta bar); explicit permission matrix with legacy values kept.

- [x] A. Shell fixes and `shared/content/permissions.ts` (commit `d08d338`)
- [x] B. Dashboard: hero, Today at a glance, Quick work beside Live status (sample), Recent activity. Legacy Review Queue, Needs attention and Key Areas sections removed (Team 03, Nov 16). Items for review stays live in Supabase mode, and the Week 11 "Decision recorded" notice still shows after a decision
- [x] C. Consolidated Content workspace: one list, search, Filter drawer, area tiles, New content drawer
- [x] D. Review Tasks: hero, Assign a review task drawer, reassign rules, existing queue unchanged
- [x] E. Metrics: App, Website and Communication sample tabs (the earlier Content metrics tab was removed to match the prototype)
- [x] F. Profile, Manage Team (sample roster; live members and invitations in Supabase mode), Settings sections

### Review evidence (Nov 16, 2026)
- [x] 21 preview screenshots (7 pages at desktop, tablet and mobile) plus Live status close-ups: `docs/Phase-B1/evidence/README.md`
- [x] Live status panel states that it is sample and pending: Sample data badge, "Live (sample)", and plain-text "Preview not available yet" in place of links
- [x] Sidebar column fills the full page height (the sidebar inside stays pinned while scrolling)

## Checks run on this branch
- [x] `npx tsc --noEmit` (admin-web): clean
- [x] Sample-mode build with `GITHUB_PAGES=true`, plus the deploy workflow's sample-mode guard: passes
- [x] Supabase-mode build (local placeholder settings only): passes
- [x] Permission matrix: 13 scripted checks pass (assign targets per role, author never offered, inactive never offered, Team Members reassign own only, only the assignee decides, Super Admins never approve their own content, legacy map, Manage Team visibility, invite and role-change rights)
- [x] Phase 2 pages: one h1 each, no console errors, no new target under 44 px; drawers, filters, validation, invite, remove dialog and final-Super-Admin protection work
- [x] Browser checks (Playwright, local static build): drawer and dialog keep focus inside, Escape and backdrop close, focus returns to the opener; tabs move with arrow keys; switch, popover and upload alt-text error work; display settings survive a reload; no interactive target under 44 px on Dashboard, Quiz Content, Settings and `/dev`; no console errors

## Decisions and notes for Team 03
1. **Sidebar width** stays at the board's 240 px (the prototype used 248 to 256 px).
2. **Navigation** links only to pages that exist. Communication (Email, Live) and the Profile and Manage Team pages join in their own phases.
3. **Role names** in the app are unchanged until the role migration stages are approved (Supabase mode keeps Owner, Admin, Reviewer).
4. **Phone top bar**: resolved. One Light / Dark button (icon only on phones) keeps the bar on one row.
5. **Account Support** removed from the sidebar (Team 03, Nov 16): not in the prototype navigation. The page stays reachable by URL and workspace search.
6. **Sample identity** now reads "Super Admin (sample)" so designers see every page. Supabase mode reads the stored role through the legacy map.
7. **Settings > Team access** now links to Manage Team, which holds the member list (and, in Supabase mode, the Phase A3 invitation tools).
8. **Dashboard glance cards** for Email, App and Website show sample numbers labeled "Sample data", because those integrations are deferred.

### Merged and applied (Nov 17 to 19, 2026)
- [x] PR #20 merged (`740daf3`): prototype foundation and Phase 2 pages
- [x] PR #21 merged (`1897ea5`): Next.js 16.4.2 → 16.4.6 (GHSA-mfr8-8qww-v76h, GHSA-vc7v-qv4w-wrv8)
- [x] PR #22 merged (`61bdd5e`): role migration Stage 1 (additive, reversible)
- [x] Stage 1 applied to the hosted project by a Team 03 member on Nov 19, 2026: 2 migrations and `invitations` Edge Function version 2. Verified read-only. Record: `role-migration-stage-1.md`; procedure: `stage-1-hosted-rollout-runbook.md`
- [x] `.gitattributes`: `*.sql` and `*.ts` keep Unix line endings (rollout finding)
- [ ] Staging sign-in check (Team 03)

## Next (not started)
- Role migration Stage 3 (move stored roles to the new values), then Stage 4 (remove legacy values): each needs its own plan, PR and Team 03 approval
- Email (templates, drafts, image upload and preview, no sending) and Live (static preview frames)
- Branch cleanup (deferred by Team 03)

## To resume
```
git checkout main && git pull --ff-only
cd admin-web && npm ci && npx tsc --noEmit -p . && npm run build
```
