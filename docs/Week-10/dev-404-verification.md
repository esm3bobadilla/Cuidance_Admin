# Week 10: `/dev/` Component Preview and custom 404 verification

- **Branch:** `feat/admin-web-dev-404`, from `main` at `1a6b605` (after PR #9)
- **Date:** Oct 30, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.**

## Why this check

After PR #9, `/dev/`, the favicon and the custom 404 page couldn't be confirmed on the live site. A clean rebuild of `main`, made exactly as the deploy workflow builds it, showed all three were in the deployed output and worked with the `/Cuidance_Admin/` base path. The likely causes on the live site were browser caching and the favicon's low contrast in dark browser themes. This branch completes `/dev/` and re-verifies both pages.

## Before and after

| Route | Before this branch | Change |
| --- | --- | --- |
| `/dev/` | **Existed** (Week 9 Step 5) | Title "Component Preview". A note that it's an internal Admin Web development screen. New Card and panel example. New loading (⋯), empty (◌) and error (⚠) state examples, using the shared state panel from the Dashboard and Review Tasks |
| Custom 404 (`app/not-found.tsx`) | **Existed** (Week 10 Step 1 corrections) | **None.** It already has the logo (in the sidebar), "Page not found", a short message, one primary "Return to Dashboard" (48 px tall), the `/Cuidance_Admin/` base path and token styling in both modes |

## GitHub Pages paths

The workflow uploads `admin-web/out`, which GitHub Pages serves at `/Cuidance_Admin/`.

- **`out/404.html`:** at the root of the uploaded output, where GitHub Pages looks for a custom 404 page. It's also exported as `out/404/index.html`.
- **`out/dev/index.html`:** present.
- **Favicons:** the three approved files are in `out/_next/static/media/`, and every page links to them under `/Cuidance_Admin/`.

| Path (served the way GitHub Pages serves it) | Result |
| --- | --- |
| `/Cuidance_Admin/dev/` | 200, "Component Preview" |
| `/Cuidance_Admin/dev` | Redirects to `/Cuidance_Admin/dev/` |
| `/Cuidance_Admin/test/` | 404 status with the custom "Page not found" page. "Return to Dashboard" goes to `/Cuidance_Admin/` |
| Favicon | A fresh browser profile loads the 32 × 32 favicon (200) from both `/dev/` and the 404 page. No `/favicon.ico` request |

## Test results

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed |
| `npm run build` and `GITHUB_PAGES=true npm run build` | Passed |
| Full browser suite | **352 loads, 0 problems** (2 builds × 22 pages × 1440, 834, 390, 320 px × light and dark). `/dev/` and the 404 page each passed all 16 of their runs |
| `/dev/` content | All sections present (Buttons, Text fields, Checkboxes, Metric tiles, the two tables, Card and panel, Loading, empty and error states, Toasts). One primary button. State symbols hidden from screen readers |
| Light and dark mode | Token backgrounds and the matching logo on both pages, through the system color preference |
| Keyboard | `/dev/`: 30 stops. 404: skip link, sidebar, then Return to Dashboard. Every stop has a visible focus ring |
| 44 px targets | No interactive element under 44 × 44 px. Return to Dashboard is 193 × 48 px |
| No JavaScript | Both pages render at 1440 and 320 px with the sidebar visible and no overflow |
| JavaScript errors | None |
| Other routes | Unchanged. All 16 back links still work |

## Evidence

Screenshots in `docs/Week-10/evidence/`, captured from the GitHub Pages build at `/Cuidance_Admin/`:

| File | What it shows |
| --- | --- |
| `dev-component-preview-1440-light.png`, `dev-component-preview-1440-dark.png` | `/dev/`, full page, both modes |
| `not-found-404-1440-light.png`, `not-found-404-1440-dark.png` | Custom 404 at `/Cuidance_Admin/test/`, both modes |

## Still open

The approved favicon is Grounded Green on a transparent background. It's clear on light browser tabs (13:1 contrast) but nearly invisible on dark ones (about 1.1:1). Making it visible on dark tabs is a Team 03 brand decision, and it would need an approved new export. No artwork was changed.
