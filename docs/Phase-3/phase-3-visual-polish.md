# Phase 3: visual polish and QA

_Branch `claude/clever-goldberg-vgmhex`, from `main` at `f525d6e` (merge of PR #25), updated Nov 23, 2026 with `main` at `7d7f3e4` (PR #26, Product Library reference products) through a merge commit. Every PR #26 file is kept exactly as merged. Frontend only. No product files, product data, Supabase data, migrations, RLS, roles, credentials or external services changed._

## Baseline

- **Official baseline:** `Cuidance_Admin_Web_Phase3_Baseline_PreImplementation_2026-11-20.mp4` (Team 03 recording, 4 min 15 s, 1920 x 1080). It walks through Sign in, Create account, Dashboard, Content and its area pages, Review Tasks and a task decision, Metrics, Profile, Settings and Manage Team. The only on-screen note is a handwritten "Fix landing page" on Sign in. The recording shows the site as deployed before PR #24 reached GitHub Pages (Content and Review Tasks still had sidebar sub-pages); PR #24 and PR #25 already consolidated the sidebar.
- **Supplement:** 48 screenshots of `f525d6e` (12 pages; 1440, 834 and 390 px light, 1440 px dark), and the same set after Phase 3. Side-by-side images are in `evidence/compare-*.png`. The recording's audio was not transcribed (no transcription tool in the build session).

## What changed

| Area | Before (baseline) | After (Phase 3) |
| --- | --- | --- |
| Sign in, Create account | Plain paper page with corner shapes and a small hand illustration; "Fix landing page" note in the recording | The approved paper-cut illustration as a responsive, decorative background (cover, anchored to the bottom, never stretched). Newsreader headline and Archivo text on solid panels, so text never depends on the artwork. Dimmed in dark mode, hidden in forced colors |
| Forgot password | A toggle inside Sign in | Its own screen (`/forgot-password/`) with the same Supabase reset request; sample mode sends nothing and says so |
| Account area | Sign out only in the profile panel (top right) | Sign out in the lower-left account area under the current user and role (icon with a label in the collapsed rail). One shared control. Role labels stay Super Admin, Admin and Team Member |
| Content Workspace | Browse by area at the very bottom, under 41 rows | Browse by area near the top as compact links; search and filters directly above the results. One Content item in the sidebar |
| Banners (Content, Dashboard, Review Tasks, Metrics, Email) | Fixed height cropped the artwork; the text panel covered about 60% of the width; phones showed a 140 px cut strip | Banner height follows the artwork's proportions; the text sits over the plain paper area; under 1024 px the whole artwork shows above the text; large text makes the banner taller instead of being cut off. Artwork unchanged |
| Review Tasks | Search only | Search, Status and Priority in one row directly above the queue; assignment, the selected task and the review action on the same page. Task detail and decision flows unchanged. One Review Tasks item in the sidebar |
| Metrics | KPI illustrations squashed to 48 x 84 px | Each illustration in the same square field at its own proportions |
| Borders | Outlines on most panels and cards | 34 decorative outlines (32 on Admin Web screens, 2 on the sign-in screens) become background fields, spacing and type. They come back in High contrast (setting or device) and Windows forced colors through `--frame-border` (app-level, in `globals.css`, built only from existing tokens). Inputs, dialogs, tags, selection, focus and functional groups keep their borders |
| Visual elements | None | A small Care Terracotta rule above three section headings (Today at a glance, Browse by area, Update history). Decorative, hidden in forced colors |

## Intentionally sample or demo only

- Sign in, Create account and Forgot password in sample mode: nothing is checked, sent or saved.
- Dashboard, Content, Review Tasks (sample mode), Metrics (sample analytics), Profile, Settings and Manage Team (sample roster).
- Product Library, Email and Live: PR 2 demo mode, unchanged (browser session only; nothing sent, scheduled or published; Publish unavailable).
- The Brand Website prototype link stays "link not set yet". The App preview image is still the welcome-screen fallback.

## Not changed on purpose

- **Product Library and Product Information files** (shared product-data protection rule): a teammate is updating product images and information in a separate pull request. Phase 3 does not touch product records, images, alt text, descriptions, brands, categories, ownership, statuses or their files.
- Accept invitation and Account setup keep their existing design (not in the Phase 3 scope).

## Pre-existing issues

1. **Fixed in this phase:** repeated region names (list-and-detail pages, Profile) and the Theme and profile buttons whose spoken names didn't match their visible text (also the Email "Use template" buttons). See `qa-results.md`.
2. **Still open (product files protected):** the Product Library "View" buttons. See Known follow-up items.
3. Product Library and Product Information keep their outlines (product files are protected in this phase).

## Known follow-up items

- **Authentication illustration file (VERIFY):** `shared/brand/auth/auth-background.webp` is the copy of `Cuidance_Auth_Background_Illustration_Phase3_v03.png` that reached the build session through the chat preview (1672 x 941, WebP). The original PNG could not be transferred as a file: each attempt arrived as the same preview image (identical bytes). The artwork is visually identical and unchanged. Team 03 approved using it (Nov 23, 2026). Swap in the original export later if wanted: same file name, same size, no code change.
- **Product Library "View" buttons:** spoken as "Open [product name]", which doesn't start with the visible "View" (`label-content-name-mismatch`). The wording is in `shared/content/product-library.ts`, a protected product file. Follow-up after the teammate's product work: change `open` to start with "View" (for example "View [product name]").
- **Branch cleanup:** see `branch-inventory.md`. Nothing deleted; waiting for the GitHub Pages source confirmation.

## Checks

See `qa-results.md`.
