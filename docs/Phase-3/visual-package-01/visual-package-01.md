# Visual Package 01: Admin Web asset update

_Branch `claude/clever-goldberg-vgmhex`, started again from `main` at `1d41d21` (the polish pass merged). Admin Web only. The brand website, product files and product data, Supabase, roles, navigation, copy (apart from two image descriptions) and interactions are unchanged._

Source: `claude-code-visual-package-01.zip` from Team 03 (Nov 26, 2026): 11 approved images and an implementation brief. The brief asked to check the current build first and change only what was missing. None of the five revisions were in the build yet.

## What changed

| Brief | Done | Notes |
| --- | --- | --- |
| A. Hero banners | Review Tasks, Metrics and Email use the new artwork | The new artwork is 2:1, but the current banners are 3:1. A 3:1 crop cut into the jars and documents, so these three banners are 5:2: the artwork fills them (`object-fit: cover`), cropped on screen slightly below center. The text panel, heading, description, button and layout are unchanged, and the text sits on the cream side. The banners are about 20% taller (1440 px: 359 to 430 px) |
| B. Email template icons | The four new icons replace the old ones in the same 96 px containers | The same files are the templates' default email images, so the Invite and Password reset image descriptions were updated to match the new art ("a sealed envelope with an invitation card", "a checklist with a padlock") |
| C. Live signal | **Not done, waiting on Team 03** | See "Decision needed" |
| D. Manage Team role icons | The new markers are in the Role column only, 24 px tall | Row heights are unchanged. The "Roles" summary card under the table keeps the earlier role illustrations (see "Decision needed") |
| E. Profile card | The new illustration replaces the old one in the same place | It's the same 96 px tall, at its own proportions. Before, the illustration changed with your role; now everyone sees the same one |

In dark mode, the role markers and the Profile illustration sit on the light-green brand surface (`--color-brand`), so the dark green hands stay visible (the illustrations README rule).

**Files**
- The supplied PNGs were re-encoded as WebP (transparency kept, scaled for the web at their own proportions). The artwork isn't redrawn, recolored or cropped.
- The old hero JPGs are removed; they're still in Git history.
- Code: `HeroBanner` (optional `frame` and `focus`, plus the shared `packageHeroFrame`), the three hero pages, `RoleBadge` (an optional `marker`), `ManageTeamView`, `ProfileView`, `account.module.css`, and `shared/content/email.ts` (two image descriptions).

## Decision needed

1. **Live signal (brief C).** The brief describes a separate signal illustration on a "Release card" on the Live / Guidance App page. In this build the Live page has no separate illustration and no card by that name. The only signal is the small icon inside the "Live (sample)" status pill on the Current preview card. Moving it to the page header would change the pill, which the brief says to keep, and keeping both would show two signals. Waiting on Team 03's choice.
2. **Roles summary card (brief D).** The brief limits the new icons to the Role column, so the summary card under the table keeps the earlier illustrations. That means Manage Team shows two icon styles for the same roles. Team 03 can choose to switch the card too.
3. **Banner height (brief A).** The three new banners are about 20% taller than the Dashboard and Content banners. A 3:1 frame would match them but crops the objects.

## Checks

| Check | Result |
| --- | --- |
| Type check; `npm test` | Pass; 42 of 42 |
| Production build; GitHub Pages build with the deploy workflow's sample-mode check | Pass; Pass |
| Visual Package checks (against `main`) | 22 of 22 |
| Full page pass (26 pages, 6 widths, light, dark and high contrast with larger text) | 312 loads, 0 failures |
| Polish, Phase 3, Keyboard and touch, Live, Email, Demo | 26, 20, 21, 15, 20, 18: all pass |
| Product Library | 17 of 17 (one old script step still expects an archived product the reference data doesn't have; the corrected check passes) |
| Roles (Super Admin and Team Member) | 37 of 37 |
| axe-core (33 routes plus drawers and dialogs, light and dark), plus landmark and label checks on the five changed pages | No findings |

**Visual Package checks (22)**
- **Banners:** each of the three, in light, dark and high contrast, at 8 widths from 1920 to 320 px:
  - the new artwork, at its 2:1 proportions, fills a 5:2 frame;
  - it's decorative, and the text panel stays on the cream side (within 56% of the width);
  - nothing is clipped, and there's no horizontal scrolling.
- **Email:** all four new icons load in unchanged containers and scale the same. The card text and actions are identical to `main`. The Invite preview uses the new image with a matching description.
- **Manage Team** (3 modes, 3 widths):
  - there is one new marker per row, only in the Role column, 24 px tall and decorative;
  - table text and row heights are identical to `main`, and no images were added.
- **Profile** (3 modes, 4 widths):
  - there is one decorative illustration, the new one, at the same height and inside the card;
  - the avatar, text, upload control, Edit profile, notifications and activity are identical to `main`.
- **Unchanged pages:** Dashboard, Content, Product Library, Settings, Live App, Live Website, Commercial Content and Guidance Rules Review are pixel-identical to `main` at 1440 and 390 px.

## Evidence

`evidence/` (before is `main` at `1d41d21`):
- `compare-hero-review-tasks-1440.png`, `compare-hero-review-tasks-390.png`
- `compare-hero-metrics-1440.png`
- `compare-hero-email-1440.png`
- `compare-email-template-icons.png`
- `compare-manage-team-role-column.png`
- `compare-profile-card.png`
