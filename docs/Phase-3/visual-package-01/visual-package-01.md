# Visual Package 01: Admin Web asset update

_Branch `claude/clever-goldberg-vgmhex`, started again from `main` at `1d41d21` (the polish pass merged). Admin Web only. The brand website, Dashboard, Content, Product Library, Settings, product files and product data, Supabase, roles, navigation, copy (apart from two image descriptions) and interactions are unchanged._

Source: `claude-code-visual-package-01.zip` from Team 03 (Nov 26, 2026): 11 approved images and an implementation brief. The brief asked to check the current build first and change only what was missing. None of the five revisions were in the build yet. Team 03 then confirmed the Live and Roles card choices and kept the 5:2 banners (Nov 26, 2026).

## What changed

| Brief | Done | Notes |
| --- | --- | --- |
| A. Hero banners | Review Tasks, Metrics and Email use the new artwork | The new artwork is 2:1, but the current banners are 3:1. A 3:1 crop cut into the jars and documents, so these three banners are 5:2: the artwork fills them (`object-fit: cover`), cropped on screen slightly below center. The text panel, heading, description, button and layout are unchanged, and the text sits on the cream side. The banners are about 20% taller (1440 px: 359 to 430 px) |
| B. Email template icons | The four new icons replace the old ones in the same 96 px containers | The same files are the templates' default email images, so the Invite and Password reset image descriptions were updated to match the new art ("a sealed envelope with an invitation card", "a checklist with a padlock") |
| C. Live signal | The existing Live signal icon (the sidebar's olive badge, 48 px) sits once in the upper-right of the Live page header, beside the title | In this build the "Release card" is the **Current preview** card. Only the icon was removed from its "Live (sample)" label: the label text, its style and the card content are unchanged. The same `LiveScreen` serves Cuidance App and Brand Website, so both Live pages get it. The icon is decorative and stays beside the title at every width (the header text wraps beside it) |
| D. Manage Team role icons | The new markers are in the Role column and in the "What each role can do" card below the table, 24 px tall | Row heights, labels and data are unchanged. Manage Team has no invitation illustration, so nothing else changed. The earlier role illustrations are no longer used in code (the files stay; `illus-leaf-hand.png` is still used by Account Setup) |
| E. Profile card | The new illustration replaces the old one in the same place | It's the same 96 px tall, at its own proportions. Before, the illustration changed with your role; now everyone sees the same one |

In dark mode, the role markers and the Profile illustration sit on the light-green brand surface (`--color-brand`), so the dark green hands stay visible (the illustrations README rule).

**Files**
- The supplied PNGs were re-encoded as WebP (transparency kept, scaled for the web at their own proportions). The artwork isn't redrawn, recolored or cropped.
- The old hero JPGs are removed; they're still in Git history.
- Code:
  - `HeroBanner` (optional `frame` and `focus`, plus the shared `packageHeroFrame`) and the three hero pages;
  - `PageHeader` (an optional decorative `mark`), `StatusBadge` (the icon is optional) and `LiveScreen`;
  - `RoleBadge` (the new markers), `ProfileView` and `account.module.css`;
  - `shared/content/email.ts` (two image descriptions) and `shared/content/account-pages.ts` (the unused role-illustration map removed).

## Banner height

The three new banners are 5:2, about 20% taller than before (Team 03 kept this, because 3:1 crops the approved artwork):

| Width | Review Tasks | Metrics | Email |
| --- | --- | --- | --- |
| 1440 | 359 to 430 px | 359 to 430 px | 359 to 430 px |
| 1280 | 306 to 366 px | 306 to 366 px | 308 to 366 px |
| 1024 | 291 to 348 px | 291 to 348 px | 304 to 348 px |
| 390 | 251 to 274 px | 279 to 302 px | 343 to 366 px |

They scale with the page width. The Dashboard and Content banners are unchanged; they were checked at 7 widths.

## Remaining visual notes

1. **Two other signal glyphs remain, on purpose:**
   - the sidebar's Live navigation icon;
   - the small glyph in the shared "Demo mode" banner, which shows on every demo page, not only Live.
   Neither is part of the Live page content. Ask if the Demo mode glyph should change too.
2. **Role marker weight:** the Super Admin artwork has more empty space around it than the Admin and Team Member art, so at 24 px it reads slightly smaller. It's shown as supplied; a tighter export from Team 03 would even them out.
3. **The Email template icons** are different shapes (two wide, two nearly square), so in the same 96 px tiles they read at slightly different sizes. They're scaled the same, as the brief asked.

## Checks

| Check | Result |
| --- | --- |
| Type check; `npm test` | Pass; 42 of 42 |
| Production build; GitHub Pages build with the deploy workflow's sample-mode check | Pass; Pass |
| Visual Package checks (against `main`) | 25 of 25 |
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
- **Live** (App and Website, 3 modes, 6 widths from 1920 to 320 px):
  - there is exactly one signal, decorative, in the header's upper-right beside the title, never under the top bar;
  - there's none in the Current preview card;
  - the pill text and style, the card content and the header text are identical to `main`;
  - no horizontal scrolling.
- **Roles card:** it uses the same three markers as the Role column (24 px), and its text is unchanged.
- **Other banners:** the Dashboard and Content banners keep their height at 7 widths.
- **Unchanged pages:** Dashboard, Content, Product Library, Settings, Commercial Content and Guidance Rules Review are pixel-identical to `main` at 1440 and 390 px.

## Evidence

`evidence/` (before is `main` at `1d41d21`):
- `compare-hero-review-tasks-1440.png`, `compare-hero-review-tasks-390.png`
- `compare-hero-metrics-1440.png`
- `compare-hero-email-1440.png`
- `compare-email-template-icons.png`
- `compare-manage-team-role-column.png`
- `compare-profile-card.png`
- `compare-live-app-1440.png`, `compare-live-app-390.png`
- `compare-manage-team-roles-card.png`
