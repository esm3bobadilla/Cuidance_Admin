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

## Checks run on this branch
- [x] `npx tsc --noEmit` (admin-web): clean
- [x] Sample-mode build with `GITHUB_PAGES=true`, plus the deploy workflow's sample-mode guard: passes
- [x] Supabase-mode build (local placeholder settings only): passes
- [x] Browser checks (Playwright, local static build): drawer and dialog keep focus inside, Escape and backdrop close, focus returns to the opener; tabs move with arrow keys; switch, popover and upload alt-text error work; display settings survive a reload; no interactive target under 44 px on Dashboard, Quiz Content, Settings and `/dev`; no console errors

## Decisions and notes for Team 03
1. **Sidebar width** stays at the board's 240 px (the prototype used 248 to 256 px).
2. **Navigation** links only to pages that exist. Communication (Email, Live) and the Profile and Manage Team pages join in their own phases.
3. **Role names** in the app are unchanged until the role migration stages are approved (Supabase mode keeps Owner, Admin, Reviewer).
4. **Phone top bar**: Menu, logo, Search, then the three-way theme control and profile wrap to a second row on narrow phones. The prototype used a single Light / Dark button; changing the theme control needs Team 03 approval.

## Next (not started)
- Phase 2: page layouts from the prototype (Dashboard, consolidated Content workspace, Review Tasks with the Assign drawer, Metrics with sample data, Settings sections, Profile, Manage Team), using the components above
- Role migration Stage 1 and 2, each in its own reviewed pull request, after Team 03 answers the open decisions in the plan
- Email (templates, drafts, image upload and preview, no sending) and Live (static preview frames) after Phase 2

## To resume
```
git fetch origin feat/admin-web-foundation && git checkout feat/admin-web-foundation
cd admin-web && npm ci && npx tsc --noEmit -p . && npm run build
```
