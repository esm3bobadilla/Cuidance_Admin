# Week 10 Step 1: Admin Web demo and validation log

A browser demo and validation pass of the current Admin Web build, before any new features. Nothing was fixed during this pass. Issues are recorded below for Week 10 Step 2.

## Session details

| Item | Value |
| --- | --- |
| Date | Oct 26, 2026 |
| Tester | Claude Code (automated browser pass) for Team 03. **Needs review by Alyssa and Esme**, plus a real-device check (see "Not tested") |
| Branch | `feat/admin-web-scaffold`, fast-forwarded to `main` before testing (no history rewritten) |
| Commit tested | `f2fa971` (Merge pull request #5, "Deploy Admin Web to GitHub Pages") |
| Environment | Cloud Linux container. Node 22.22.0, npm 10.9.4, Next.js 16.4.2, React 19.3.1, TypeScript 5.9.3 (strict) |
| Builds tested | 1. **Local:** `npm run build`, static export served at the site root. 2. **GitHub Pages:** `GITHUB_PAGES=true npm run build`, the same build the deploy workflow makes, served at `/Cuidance_Admin/`. 3. **Dev server:** `npm run dev` |
| Browser | Chromium 141 (headless), driven through its DevTools connection |
| Viewports | Desktop 1440 × 900, tablet 834 × 1112, mobile 390 × 844, small 320 × 640 |
| Color modes | Light and dark (browser color-scheme setting) |
| Pages | `/` (dashboard), `/dev/` (internal component preview), `404.html` |

**Total:** 32 page loads (2 builds × 2 pages × 4 viewports × 2 modes), plus keyboard, form, no-JavaScript and 404 checks.

## Build check

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed |
| Local build (`npm run build`) | Passed: `/`, `/dev`, `/_not-found` exported as static pages |
| GitHub Pages build (`GITHUB_PAGES=true`) | Passed. All assets load under `/Cuidance_Admin/` |
| Dev server (`npm run dev`) | Passed: `/` 200, `/dev/` 200 (`/dev` redirects to `/dev/` because of the trailing-slash setting) |

## What was tested

| # | Area | Result | Notes |
| --- | --- | --- | --- |
| 1 | Dashboard | Passed | Loads in both builds at every width. Headings in order (h1 > h2 > h3). No overflow |
| 2 | Header and logo | Passed | Logo loads in all 32 runs. Grounded Green lockup in light mode, Quiet Paper lockup in dark mode. Artwork 160 px (image 169 × 46), lines up with the page margin (64 / 32 / 16 px). Alt text "Cuidance" |
| 3 | Light mode | Passed | Page background `#F4F2EC`, text `#111111` |
| 4 | Dark mode | Passed | Page background `#121714`. Every component switches (see evidence) |
| 5 | Responsive layout | Passed | No sideways page overflow at 1440, 834, 390 or 320 px. Margins and heading sizes switch at each breakpoint (h1 32 / 30 / 28 px) |
| 6 | Design tokens | Passed | Matches the Week 9 audit. No new loose values |
| 7 | Typography | Passed | Newsreader for headings, Archivo for body text, in every run |
| 8 | Buttons | Passed, with issue W10-05 | Primary, secondary, ghost and disabled render correctly in both modes |
| 9 | Icon buttons | Demoed (W10-07) | 44 × 44, named, focusable. Glyphs are small placeholders (open icon-set decision) |
| 10 | Inputs and search | Passed | Visible linked labels. Helper and error text announced. Typing works. Arrow keys change the dropdown. Disabled field skipped by Tab |
| 11 | Checkboxes | Passed | Consent starts unchecked. Clicking the label and pressing Space both toggle. Disabled box skipped by Tab |
| 12 | Cards and panels | Passed | 16 px radius, borders, both modes |
| 13 | Data tables | Passed | 56 px rows. Selected row has blue outline plus hidden "Selected" text. At 320 px the wide table scrolls inside its own box, which can take keyboard focus |
| 14 | Metric tiles | Passed | Wrap at narrow widths |
| 15 | Toasts | Passed, with issues W10-04 and W10-06 | Success = status, error = alert, each with icon and text |
| 16 | Keyboard focus | Passed | 21 Tab stops on `/dev/` in a logical order. Every stop shows the 2 px focus ring (`#1F3FD1` light, `#9AABFF` dark) |
| 17 | Navigation and hierarchy | Demoed (W10-09) | No navigation yet (not approved). `/dev/` is reachable only by URL. Breadcrumb "Admin" link correct in both builds (`/` and `/Cuidance_Admin/`) |
| 18 | Empty and loading | Not applicable | Neither exists yet (provisional on the board). The pages are static and render fully with JavaScript off |
| 19 | Error behavior | Broke (W10-02, W10-03) | Form error states pass. The 404 page and the missing favicon don't |
| 20 | Scope and terminology | Demoed (W10-01) | No banned guidance words or em dashes in page text. No data, sign-in or backend. Deployment visibility needs a decision |

## What passed

- Both builds and the dev server.
- TypeScript.
- All 32 page loads, with no JavaScript errors.
- Logo, both color modes, every breakpoint, fonts, design tokens.
- Buttons, inputs, checkboxes, cards, tables, metric tiles and toasts.
- Keyboard focus and Tab order.
- Form error messages.
- No-JavaScript rendering.
- Content and safety wording.

## What broke

- **W10-02:** the 404 page doesn't follow the design system and has no way back.
- **W10-03:** a favicon 404 error appears in the console.
- **W10-04:** three links are smaller than the 44 px tap target.
- **W10-05:** two primary buttons on `/dev/`.
- **W10-10:** `next dev` leaves an untracked file behind.

## Issues

### S1: blocks the primary Admin Web workflow

None.

### S2: meaningful difficulty or confusion

**W10-01: Admin Web, including `/dev/`, is published at a public URL**
- **Screen:** whole site, GitHub Pages deployment.
- **Steps:**
  1. Read `.github/workflows/deploy-admin-web.yml` and the README's live link (`https://esm3bobadilla.github.io/Cuidance_Admin/`).
  2. Build with `GITHUB_PAGES=true` and open `/Cuidance_Admin/dev/`.
- **Expected:** CLAUDE.md says Admin Web is "an internal browser-based support artifact" and "**not** a public-facing app."
- **Actual:** every merge to `main` publishes the dashboard and the internal component preview (including the static Team Access pattern) to a public GitHub Pages site. Pages are marked `noindex`, so search engines shouldn't list them, but anyone with the link can open them. No real data is included.
- **Evidence:** the deploy workflow file. `/Cuidance_Admin/dev/` built and served successfully in the Pages build.
- **Smallest fix:** a Team 03 decision. Either note in CLAUDE.md that a public static demo (no data) is approved, or leave `/dev/` out of the deployed build.
- **Status:** Demoed.

### S3: cosmetic or low impact

**W10-02: 404 page uses the Next.js default, not the design system**
- **Screen:** `404.html`, which GitHub Pages shows for any unknown address.
- **Steps:** open `/Cuidance_Admin/404.html`, in light and then dark mode.
- **Expected:** token colors and fonts, and a link back to the dashboard.
- **Actual:** white `#FFFFFF` background in light mode and black `#000000` in dark mode, from Next's built-in styles (not `#F4F2EC` / `#121714`). System font. Text "404 · This page could not be found." No link back. The logo header does show.
- **Evidence:** `evidence/404-light.png`, `evidence/404-dark.png`.
- **Smallest fix:** add `admin-web/app/not-found.tsx` using PageHeader and a ghost-button link to the dashboard, tokens only.
- **Status:** Broke.

**W10-03: favicon request fails on every page**
- **Screen:** all pages.
- **Steps:** open any page with the browser console showing.
- **Expected:** no console errors.
- **Actual:** `GET /favicon.ico` returns 404, logging "Failed to load resource: the server responded with a status of 404."
- **Evidence:** console output from the first load in each build.
- **Smallest fix:** add the favicon once Team 03 approves the corrected derived favicons (`shared/brand/logo/png/derived/`). Favicon work is deferred by decision, so this is expected for now.
- **Status:** Broke (known, deferred).

**W10-04: small tap targets on three links**
- **Screen:** `/dev/`, at the 390 px and 320 px widths.
- **Steps:** measure the breadcrumb "Admin" link and the toast "View" and "Retry" links.
- **Expected:** at least 44 × 44 px (board accessibility rule).
- **Actual:** Admin 38 × 18, View 34 × 20, Retry 37 × 20.
- **Evidence:** measured during the mobile run.
- **Smallest fix:** give inline links in Breadcrumb and Toast a minimum height and width of `--size-touch-target`, with padding.
- **Status:** Broke.

**W10-05: two primary buttons on one screen**
- **Screen:** `/dev/`.
- **Steps:** open `/dev/` and look at the header ("Create task") and the Buttons card ("Primary").
- **Expected:** one primary button per screen (board rule).
- **Actual:** two Compass Blue primary buttons.
- **Evidence:** `evidence/dev-1440-light.png`.
- **Smallest fix:** change the header's "Create task" action to secondary on the preview page, or remove the header actions.
- **Status:** Broke.

**W10-06: toast links go nowhere**
- **Screen:** `/dev/`, Toasts card.
- **Steps:** click "View" or "Retry".
- **Expected:** a real action, or a clearly inactive example.
- **Actual:** both links point to `#`, so the page jumps to the top.
- **Evidence:** links found: `View -> #`, `Retry -> #`.
- **Smallest fix:** on the preview page, point the links at the page itself, or label them as examples.
- **Status:** Demoed.

**W10-07: icon-button glyphs are small and unclear**
- **Screen:** `/dev/`, Icon buttons card.
- **Steps:** look at the Search and Edit buttons.
- **Expected:** clear icons.
- **Actual:** placeholder glyphs (⌕, ✎) render at 15 px, and the search glyph is hard to recognize.
- **Evidence:** `evidence/dev-1440-light.png`.
- **Smallest fix:** wait for an approved icon set. It's an open decision in `shared/design-tokens/README.md`.
- **Status:** Demoed.

**W10-08: dashboard doesn't use the shared components**
- **Screen:** `/` (dashboard).
- **Steps:** compare `admin-web/app/page.tsx` and `globals.css` with `components/`.
- **Expected:** one shared component per pattern (CLAUDE.md).
- **Actual:** the dashboard still uses its own `.eyebrow`, `.page-title` and `.area` styles from Week 9, which duplicate Eyebrow, PageHeader and Card. They look the same today but could drift apart.
- **Evidence:** `admin-web/app/globals.css` lines 50–117.
- **Smallest fix:** switch the dashboard to PageHeader and Card, with no visual change.
- **Status:** Demoed.

**W10-09: no way to move between pages**
- **Screen:** `/` and `/dev/`.
- **Steps:** on the dashboard, press Tab.
- **Expected:** expected for now, because navigation isn't approved.
- **Actual:** the dashboard has no links or focusable elements (Tab leaves the page right away). The logo isn't a home link. `/dev/` is reachable only by typing the URL.
- **Evidence:** keyboard pass: dashboard 0 Tab stops.
- **Smallest fix:** none until navigation is approved. Optionally, make the logo a link to the dashboard.
- **Status:** Demoed.

**W10-10: `npm run dev` creates an untracked file**
- **Screen:** repository.
- **Steps:** run `npm run dev` in `admin-web/`, then `git status`.
- **Expected:** clean working tree.
- **Actual:** Next.js 16 writes `admin-web/AGENTS.md` (coding-agent notes) on every dev run. It was deleted after this pass, not committed.
- **Evidence:** `?? admin-web/AGENTS.md` in `git status`.
- **Smallest fix:** Team 03 decides whether to commit the file or add it to `.gitignore`.
- **Status:** Broke.

## Issue counts

| Severity | Count | IDs |
| --- | --- | --- |
| S1 | 0 | — |
| S2 | 1 | W10-01 |
| S3 | 9 | W10-02 to W10-10 |

## Not tested

- **The live site** (`https://esm3bobadilla.github.io/Cuidance_Admin/`): this cloud environment's network settings block `esm3bobadilla.github.io`. The identical GitHub Pages build was tested locally under `/Cuidance_Admin/` instead.
- **Real phones and tablets:** tablet and mobile sizes were emulated in desktop Chromium. The board asks for real-device testing ("test on real devices"). Someone on Team 03 should open the live link on a phone and a tablet.
- **Other browsers** (Safari, Firefox) and screen readers: not available here.
- **Zoom and text resizing:** the 320 px run approximates 400 % zoom at 1280 px. A real browser zoom check is still needed.

## Evidence

Screenshots in `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `dashboard-1440-light.png`, `dashboard-1440-dark.png` | Dashboard on desktop, both modes |
| `dashboard-834-light.png` | Dashboard at tablet width |
| `dashboard-320-dark.png` | Dashboard at the narrowest width, dark mode |
| `dev-1440-light.png`, `dev-1440-dark.png` | Component preview on desktop, both modes |
| `dev-320-light.png` | Component preview at 320 px |
| `focus-ring-light.png`, `focus-ring-dark.png` | Keyboard focus rings |
| `404-light.png`, `404-dark.png` | Default 404 page (W10-02) |

## Recommended next step (Week 10 Step 2)

1. **Decide W10-01:** is a public static demo approved? Record the answer in CLAUDE.md.
2. **Fix the small, safe S3 issues in one focused branch, with no new features:**
   - W10-02: token-based 404 page with a link home.
   - W10-04: 44 px tap targets for inline links.
   - W10-05: one primary button on `/dev/`.
   - W10-06: real or clearly inactive toast links.
   - W10-08: dashboard uses PageHeader and Card.
   - W10-10: commit or ignore `AGENTS.md`.
3. **Leave W10-03 (favicon) and W10-07 (icons)** until Team 03 approves the derived favicons and an icon set.
4. **Real-device check:** a teammate opens the live link on a phone and a tablet, in light and dark mode, and adds the results to this log.
