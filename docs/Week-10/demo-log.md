# Week 10: Admin Web demo and validation log

Step 1 was a browser demo and validation pass of the Admin Web build, before any new features. Nothing was fixed during that pass. The Step 2 corrections and their re-test are recorded in "Week 10 Step 2 corrections" below. Each issue keeps its Step 1 findings and severity, with the Step 2 result added.

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
- **Step 2 decision (Team 03):** Admin Web is intentionally public for live class demonstration. The GitHub Pages deployment stays. Admin Web is still an internal support artifact and is not part of participant testing. Severity stays S2.
- **Status:** **Accepted** for public live demonstration.

### S3: cosmetic or low impact

**W10-02: 404 page uses the Next.js default, not the design system**
- **Screen:** `404.html`, which GitHub Pages shows for any unknown address.
- **Steps:** open `/Cuidance_Admin/404.html`, in light and then dark mode.
- **Expected:** token colors and fonts, and a link back to the dashboard.
- **Actual:** white `#FFFFFF` background in light mode and black `#000000` in dark mode, from Next's built-in styles (not `#F4F2EC` / `#121714`). System font. Text "404 · This page could not be found." No link back. The logo header does show.
- **Evidence:** `evidence/404-light.png`, `evidence/404-dark.png`.
- **Smallest fix:** add `admin-web/app/not-found.tsx` using PageHeader and a ghost-button link to the dashboard, tokens only.
- **Step 2 fix:** new `admin-web/app/not-found.tsx`, exported as `404.html`. It uses PageHeader, tokens only, with the title "Page not found", a one-sentence explanation, and one primary action, "Return to Dashboard". That action is a link styled as a button (new `ButtonLink` in `components/ui/Button.tsx`, same styles as Button). No new navigation. Re-test: token background (`#F4F2EC` light, `#121714` dark), Newsreader title, logo shown, no overflow at all four widths, and "Return to Dashboard" goes to `/` (local) and `/Cuidance_Admin/` (Pages).
- **Status:** **Fixed.**

**W10-03: favicon request fails on every page**
- **Screen:** all pages.
- **Steps:** open any page with the browser console showing.
- **Expected:** no console errors.
- **Actual:** `GET /favicon.ico` returns 404, logging "Failed to load resource: the server responded with a status of 404."
- **Evidence:** console output from the first load in each build.
- **Smallest fix:** add the favicon once Team 03 approves the corrected derived favicons (`shared/brand/logo/png/derived/`). Favicon work is deferred by decision, so this is expected for now.
- **Step 2 fix:** Team 03 approved the derived favicons. `admin-web/app/layout.tsx` lists `cuidance-favicon-16x16.png`, `-32x32.png` and `-48x48.png` from `shared/brand/logo/png/derived/` in the page metadata (`icons`). The files are used exactly as supplied: the built copies have the same SHA-256 as the originals. The rejected favicons in `png/` aren't used. Re-test: the browser requests the 32 × 32 favicon (status 200) and never requests `/favicon.ico`, in both builds and on the dev server. No console errors.
- **Status:** **Fixed.**

**W10-04: small tap targets on three links**
- **Screen:** `/dev/`, at the 390 px and 320 px widths.
- **Steps:** measure the breadcrumb "Admin" link and the toast "View" and "Retry" links.
- **Expected:** at least 44 × 44 px (board accessibility rule).
- **Actual:** Admin 38 × 18, View 34 × 20, Retry 37 × 20.
- **Evidence:** measured during the mobile run.
- **Smallest fix:** give inline links in Breadcrumb and Toast a minimum height and width of `--size-touch-target`, with padding.
- **Step 2 fix:** Breadcrumb links and Toast action links now have a 44 × 44 px minimum touch target (`--size-touch-target`). The text, size, color and underline are unchanged, so they still read as text links, not buttons. The Toast link's target reaches into the toast's padding, so the toast keeps its height. Re-test: breadcrumb "Admin" measures 44 × 44 at every width. "View" and "Retry" are now plain text on `/dev/` (see W10-06), so they're no longer tap targets. No element under 44 px in any of the 48 runs.
- **Status:** **Fixed.**

**W10-05: two primary buttons on one screen**
- **Screen:** `/dev/`.
- **Steps:** open `/dev/` and look at the header ("Create task") and the Buttons card ("Primary").
- **Expected:** one primary button per screen (board rule).
- **Actual:** two Compass Blue primary buttons.
- **Evidence:** `evidence/dev-1440-light.png`.
- **Smallest fix:** change the header's "Create task" action to secondary on the preview page, or remove the header actions.
- **Step 2 fix:** the header's "Create task" is now secondary. The Buttons card keeps its one "Primary" example, so every state is still shown. Re-test: one primary on `/dev/` ("Primary"), one on the 404 page ("Return to Dashboard") and none on the dashboard.
- **Status:** **Fixed.**

**W10-06: toast links go nowhere**
- **Screen:** `/dev/`, Toasts card.
- **Steps:** click "View" or "Retry".
- **Expected:** a real action, or a clearly inactive example.
- **Actual:** both links point to `#`, so the page jumps to the top.
- **Evidence:** links found: `View -> #`, `Retry -> #`.
- **Smallest fix:** on the preview page, point the links at the page itself, or label them as examples.
- **Step 2 fix:** the Toast `href` is now optional. Without one, the action label shows as plain text (Guidance Ink, no underline, normal cursor), not a link. The `/dev/` toasts leave out the `href`, and a note under them says the actions become links once a real page exists. No routes were invented. Re-test: no `href="#"` anywhere, and no links inside toasts.
- **Status:** **Fixed.**

**W10-07: icon-button glyphs are small and unclear**
- **Screen:** `/dev/`, Icon buttons card.
- **Steps:** look at the Search and Edit buttons.
- **Expected:** clear icons.
- **Actual:** placeholder glyphs (⌕, ✎) render at 15 px, and the search glyph is hard to recognize.
- **Evidence:** `evidence/dev-1440-light.png`.
- **Smallest fix:** wait for an approved icon set. It's an open decision in `shared/design-tokens/README.md`.
- **Step 2 fix:** the placeholder glyphs ⌕ and ✎ are replaced with glyphs the board already uses: "?" (Help) and "‹" (Back, plus a disabled Back). The glyph now uses `--type-heading-4` (20 px) instead of 15 px. Accessible names stay on every button (`aria-label` "Help", "Back", "Back (disabled)"). No new icon system. The board has no search or edit glyph, so those wait for an icon set (noted in `shared/design-tokens/README.md`). Re-test: legible in light and dark mode, and at 834, 390 and 320 px.
- **Status:** **Fixed.**

**W10-08: dashboard doesn't use the shared components**
- **Screen:** `/` (dashboard).
- **Steps:** compare `admin-web/app/page.tsx` and `globals.css` with `components/`.
- **Expected:** one shared component per pattern (CLAUDE.md).
- **Actual:** the dashboard still uses its own `.eyebrow`, `.page-title` and `.area` styles from Week 9, which duplicate Eyebrow, PageHeader and Card. They look the same today but could drift apart.
- **Evidence:** `admin-web/app/globals.css` lines 50–117.
- **Smallest fix:** switch the dashboard to PageHeader and Card, with no visual change.
- **Step 2 fix:** the dashboard now uses PageHeader (eyebrow "Internal tool", title, description) and Card (`as="li"`, h3 titles) for the seven content areas. All text is unchanged. The duplicate `.eyebrow`, `.page-title`, `.lead` and `.area` styles are removed from `globals.css`. Two visible differences come from matching the shared components and `/dev/`: the intro line is now 14 px muted text (PageHeader description) instead of 18 px, and card content is 12 px apart instead of 8 px. No new navigation, metrics, charts or data. Re-test: headings in order (h1 > h2 > h3), no overflow at any width, both modes.
- **Status:** **Fixed.**

**W10-09: no way to move between pages**
- **Screen:** `/` and `/dev/`.
- **Steps:** on the dashboard, press Tab.
- **Expected:** expected for now, because navigation isn't approved.
- **Actual:** the dashboard has no links or focusable elements (Tab leaves the page right away). The logo isn't a home link. `/dev/` is reachable only by typing the URL.
- **Evidence:** keyboard pass: dashboard 0 Tab stops.
- **Smallest fix:** none until navigation is approved. Optionally, make the logo a link to the dashboard.
- **Status:** **Deferred** until Week 10 Step 2, because navigation routes aren't implemented. Unchanged in this pass. The new 404 page's "Return to Dashboard" is the only added link.

**W10-10: `npm run dev` creates an untracked file**
- **Screen:** repository.
- **Steps:** run `npm run dev` in `admin-web/`, then `git status`.
- **Expected:** clean working tree.
- **Actual:** Next.js 16 writes `admin-web/AGENTS.md` (coding-agent notes) on every dev run. It was deleted after this pass, not committed.
- **Evidence:** `?? admin-web/AGENTS.md` in `git status`.
- **Smallest fix:** Team 03 decides whether to commit the file or add it to `.gitignore`.
- **Step 2 re-test:** reproduced. `npm run dev` created `admin-web/AGENTS.md` again. It was deleted after the run and not committed.
- **Final cleanup fix:** `admin-web/AGENTS.md` is added to `.gitignore`, so the generated file is ignored and never committed. Re-test: `npm run dev` created the file again, and `git status --ignored` lists it as ignored (`!! admin-web/AGENTS.md`), not untracked. `git check-ignore` matches the new `.gitignore` line.
- **Status:** **Resolved** by ignoring the generated file.

## Issue counts

| Severity | Count | IDs |
| --- | --- | --- |
| S1 | 0 | — |
| S2 | 1 | W10-01 |
| S3 | 9 | W10-02 to W10-10 |

Severity is unchanged after Step 2. Status after Step 2:

| Status | IDs |
| --- | --- |
| Accepted | W10-01 (public live demonstration) |
| Fixed | W10-02, W10-03, W10-04, W10-05, W10-06, W10-07, W10-08 |
| Resolved | W10-10 (generated `AGENTS.md` ignored in `.gitignore`) |
| Deferred | W10-09 (navigation routes not implemented; deferred to Week 10 Step 2) |
| Open | None |

## Week 10 Step 2 corrections

### Session details

| Item | Value |
| --- | --- |
| Date | Oct 26, 2026 |
| Tester | Claude Code (automated browser pass) for Team 03. **Needs review by Alyssa and Esme** |
| Branch | `feat/admin-web-scaffold` |
| Starting commit | `3407b8b` (Step 1 log) |
| Environment and browser | Same as Step 1 |
| Pages | `/`, `/dev/`, and an unknown address (`/no-such-page/`). The test server answers unknown addresses with `404.html` and status 404, the way GitHub Pages does |

### Files changed

| File | Change |
| --- | --- |
| `admin-web/app/not-found.tsx` | New. Custom 404 page (W10-02) |
| `admin-web/app/layout.tsx` | Favicon metadata (W10-03) |
| `admin-web/app/page.tsx`, `admin-web/app/globals.css` | Dashboard uses PageHeader and Card; duplicate styles removed (W10-08) |
| `admin-web/app/dev/page.tsx` | One primary, plain-text toast actions, board glyphs (W10-05, W10-06, W10-07) |
| `admin-web/components/ui/Button.tsx`, `Button.module.css` | `ButtonLink` for the 404 action |
| `admin-web/components/ui/Breadcrumb.module.css` | 44 px link target (W10-04) |
| `admin-web/components/feedback/Toast.tsx`, `Toast.module.css` | Optional `href`, plain-text action, 44 px link target (W10-04, W10-06) |
| `admin-web/components/ui/IconButton.tsx`, `IconButton.module.css` | Larger glyph size (W10-07) |
| `shared/brand/logo/README.md`, `shared/design-tokens/README.md`, `README.md` | Favicon status, icon note, structure line. Documentation only |

Not changed: logo files, `tokens.css`, the deploy workflow, the Admin Mobile archive, and the `Cuidance_Prototype` repository.

### Verification

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed |
| Local build (`npm run build`) | Passed: `/`, `/dev`, `/_not-found` (exported as `404.html`) |
| GitHub Pages build (`GITHUB_PAGES=true`) | Passed. Favicons, logo and the 404 link all use `/Cuidance_Admin/` |
| Local production preview | 48 page loads: 2 builds × 3 pages × 4 widths × 2 modes |
| Dev server (`npm run dev`) | Passed: `/` 200, `/dev/` 200, unknown address 404 with the custom page. Light and dark, no console errors |
| Light and dark mode | Passed on all three pages. Backgrounds `#F4F2EC` and `#121714`. Dark logo switches |
| Widths 1440, 834, 390, 320 px | Passed. No sideways overflow in any of the 48 runs |
| Touch targets | No interactive element under 44 × 44 px in any run |
| One primary per page | `/dev/` 1, 404 page 1, dashboard 0 |
| Keyboard focus order | `/dev/`: 19 stops in reading order (Admin, Export, Create task, buttons, Help, Back, fields, checkboxes, two tables), each with the 2 px focus ring in both modes. 404: one stop (Return to Dashboard), with the ring. Dashboard: no stops yet (W10-09) |
| 404 route | Custom page in both builds and on the dev server. "Return to Dashboard" goes to the dashboard |
| Favicon requests | 32 × 32 favicon loads (200). No `/favicon.ico` request. Built files match the approved files byte for byte |
| JavaScript errors | None. The only console entry is the browser's own "404" notice on the unknown address, which is expected because the page returns status 404, as it will on GitHub Pages. In some runs the browser cancels and re-requests the dark-mode logo when the test switches color mode mid-session (traced in the final cleanup). The logo still loads every time |
| Content wording | No banned words or em dashes on any page |
| No JavaScript | All three pages render with JavaScript off |
| Untracked files | `next dev` recreated `admin-web/AGENTS.md` (W10-10). Deleted in Step 2. Now ignored (see the final cleanup). Only gitignored output remains |

### Step 2 evidence

| File | What it shows |
| --- | --- |
| `step2-404-1440-light.png`, `step2-404-1440-dark.png` | Custom 404 page on desktop, both modes |
| `step2-404-320-dark.png` | Custom 404 page at 320 px |
| `step2-404-focus-light.png` | Focus ring on "Return to Dashboard" |
| `step2-dashboard-1440-light.png`, `step2-dashboard-1440-dark.png` | Dashboard with PageHeader and Card |
| `step2-dashboard-320-light.png` | Dashboard at 320 px |
| `step2-dev-1440-light.png`, `step2-dev-1440-dark.png` | Component preview on desktop, both modes |
| `step2-dev-834-dark.png`, `step2-dev-320-light.png` | Component preview at tablet and narrow widths |
| `step2-dev-header-icons-light-dark.png` | Secondary header actions and the new icon glyphs, both modes |
| `step2-dev-buttons-toasts-light.png` | One primary button, and plain-text toast actions |
| `step2-focus-breadcrumb-light.png` | Focus ring showing the 44 × 44 "Admin" target |

## Final cleanup before pull-request review

Oct 26, 2026, on `feat/admin-web-scaffold`.

| Item | Result |
| --- | --- |
| `.gitignore` | Added `admin-web/AGENTS.md` (W10-10 resolved) |
| `/dev/` icon examples | **Kept Help (?) and Back (‹).** Both are in the design system board's Core UI Components section: "Help button · Default, Pressed" shows "? Help" (glyph 22 px on a 48 px button in the sizing notes), and "Top bar" shows "‹ Back" and "? Help". Search and Edit aren't on the board, so they weren't restored. Accessible labels and 44 px targets unchanged |
| Unchanged | Favicons, 404 page, tokens, dashboard components, responsive layout, GitHub Pages deployment |
| TypeScript (`npx tsc --noEmit`) | Passed |
| `npm run build` | Passed: `/`, `/dev`, `/_not-found` |
| GitHub Pages build | Passed |
| `npm run dev` | `/` 200, `/dev/` 200, unknown address 404 with the custom page. Light and dark, no console errors. `admin-web/AGENTS.md` created and ignored (`!!`), not untracked |
| Light and dark | Passed on all three pages in both builds: backgrounds `#F4F2EC` and `#121714`, matching logo per mode |
| Widths 1440, 834, 390, 320 px | 48 runs, no sideways overflow, no target under 44 px, one primary on `/dev/` and the 404 page, none on the dashboard |
| Keyboard | `/dev/` 19 stops, 404 page 1 stop, every stop with the focus ring, both modes |
| Favicon | 32 × 32 favicon loads (200) in both builds with a fresh browser profile. No `/favicon.ico` request |
| JavaScript errors | None. Two runs logged a cancelled dark-mode logo request, traced to the browser re-picking the `<picture>` image when the test switches color mode. The logo loaded in both runs |

## Not tested

- **The live site** (`https://esm3bobadilla.github.io/Cuidance_Admin/`): this cloud environment's network settings block `esm3bobadilla.github.io`. The identical GitHub Pages build was tested locally under `/Cuidance_Admin/` instead.
- **Real phones and tablets:** tablet and mobile sizes were emulated in desktop Chromium. The board asks for real-device testing ("test on real devices"). Someone on Team 03 should open the live link on a phone and a tablet.
- **Other browsers** (Safari, Firefox) and screen readers: not available here.
- **Zoom and text resizing:** the 320 px run approximates 400 % zoom at 1280 px. A real browser zoom check is still needed.

## Evidence (Step 1)

Screenshots in `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `dashboard-1440-light.png`, `dashboard-1440-dark.png` | Dashboard on desktop, both modes |
| `dashboard-834-light.png` | Dashboard at tablet width |
| `dashboard-320-dark.png` | Dashboard at the narrowest width, dark mode |
| `dev-1440-light.png`, `dev-1440-dark.png` | Component preview on desktop, both modes |
| `dev-320-light.png` | Component preview at 320 px |
| `focus-ring-light.png`, `focus-ring-dark.png` | Keyboard focus rings |
| `404-light.png`, `404-dark.png` | Default 404 page (W10-02, before the Step 2 fix) |

## Recommended next step (written in Step 1)

_Step 2 and the final cleanup completed items 1 to 3. W10-10 was resolved by ignoring the generated file. Item 4 is still open._

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
