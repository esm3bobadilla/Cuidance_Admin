# Week 10: Theme control, responsive check and role wording

- **Branch:** `feat/admin-web-theme-responsive`, from `main` at `2d929b7` (after PR #10)
- **Date:** Nov 5, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked PROVISIONAL or TO CONFIRM need a Team 03 decision.
- **Not included:** Supabase, sign-in, live permissions, invitations, account creation, profile or avatar artwork, new routes, new dependencies, and Cuidance Mobile changes.

## 1. Theme control (Light, Dark or System)

**What people see:**
1. A **Theme** control at the bottom of the sidebar. It uses the existing Select component.
2. On narrow screens (under 768 px), the same control sits inside the **Menu**, below the page links.
3. Three choices: **System** (the default), **Light** and **Dark**.

**How it behaves:**
- **System** follows the device setting and updates when the device setting changes.
- **Light** or **Dark** stays chosen even when the device uses the other setting.
- **The choice is remembered.** It's kept in the browser (`localStorage`, key `cuidance-admin-theme`), so it survives reloads, page changes and later visits. Choosing System clears it.
- **No flash.** A short script in the page `<head>` applies the saved choice before the page draws.
- **The logo follows the theme.** The approved v04 lockups are used as supplied:
  - Light theme: the Quiet Paper reversed lockup on the green sidebar.
  - Dark theme: the Grounded Green lockup on the light sidebar.
  - Both images are in the page, and CSS shows the one that matches.
- **Without JavaScript,** the Theme control is hidden, because it can't work, and the device setting applies.
- **Before the page finishes loading,** the control can show "System" for a moment on a page with a saved choice. The colors are already right during that moment. Only the control's label catches up.

**Tokens:** `shared/design-tokens/tokens.css` was **reorganized, not changed.**
- The dark values now apply in two cases: when the device is dark and nobody picked Light, or when someone picked Dark.
- So the 28 dark values appear twice. A comment in the file says to change both copies together.
- A check confirmed that **all 118 original declarations are unchanged.** The only additions are the duplicated dark values and the `color-scheme` lines for each theme.

## 2. Responsive check

Every main page was measured at **1440, 1280, 1024, 900, 834, 768, 767, 600, 480, 390, 360 and 320 px.** The check looked for:
- Sideways page scrolling.
- Content spilling out of its box.
- Anything past the right edge.
- Targets under 44 × 44 px.

**One real problem was found and fixed:**
- **Where:** the Dashboard's Review Queue panel at **1280 px**, the narrowest desktop width.
- **What happened:** the four count tiles were squeezed so narrow that their labels spilled out (for example, "questions").
- **The fix:** from 1280 px up, the tiles keep enough room for their labels. If the row is too narrow, the View review tasks button moves to the next line. The minimum width is set from the sidebar-width token, with no new value.
- **Result:** 1440 px and 1024 px are **pixel-identical** to before. Only the 1280 to about 1350 px range changes.

**Everything else already met the rules:**
- **Sideways scrolling:** none at any width.
- **Tables:** they scroll inside their own panel.
- **Key Areas:** three columns on desktop, one below 1280 px (unchanged, from the hi-fi).
- **Short screens:** on a short desktop or tablet window, the sidebar scrolls, so the Theme control stays reachable.

## 3. Roles and publishing (policy wording only)

**Where it shows:**
- **Settings** has a static **Roles and publishing** card.
- The same card is reused on `/dev/`.
- The `/dev/` "Team access" example table now uses the same role names and one-line summaries.

**Where the wording lives:** `shared/content/admin-roles.ts`, so it's written once.

| Role | Wording |
| --- | --- |
| Main Admin / Owner | Publishes approved content |
| Admin | Publishes approved content |
| Content Editor | **TO CONFIRM:** "Details to be confirmed by Team 03." No Content Editor definition was supplied, so none was written |
| Reviewer | **Can:** review assigned content, add notes, approve items, request changes. **Cannot:** publish independently, manage team members, assign roles, edit core content |

- **Publishing rule shown on the card:** "Admin and Main Admin / Owner publish approved content."
- **Policy only:** "Policy description only. Roles aren't connected yet: there's no sign-in, and nothing here changes what anyone can do."
- **Nothing is enforced:** no sign-in, role assignment, invitations or permissions.

## 4. Files changed

| File | Change |
| --- | --- |
| `shared/design-tokens/tokens.css` | Reorganized so a manual Light or Dark choice works. No values changed |
| `shared/design-tokens/README.md` | Note about the Theme control and the two dark copies |
| `shared/content/theme.ts` | New: Theme label, options, storage key and the before-paint script |
| `shared/content/admin-roles.ts` | New: role names, summaries, can and cannot lists, publishing rule |
| `admin-web/app/layout.tsx` | Before-paint script, and the two logo images |
| `admin-web/app/globals.css` | Shows the logo that matches the theme |
| `admin-web/components/layout/Sidebar.tsx`, `Sidebar.module.css` | Theme control at the bottom of the sidebar and inside Menu. Hidden without JavaScript |
| `admin-web/components/layout/ThemePreference.tsx`, `.module.css` | New: the Theme control |
| `admin-web/components/content/RolesPolicy.tsx`, `.module.css` | New: the roles policy card |
| `admin-web/app/settings/page.tsx` | Shows the card and an "Other settings are not built yet." note in place of the structure-only note |
| `admin-web/app/dev/page.tsx` | Team access table uses the shared roles; the card is previewed |
| `admin-web/app/_dashboard/dashboard.module.css` | 1280 px tile fix |
| `README.md` | Status and project structure |
| `docs/Week-10/evidence/` | New screenshots (section 6) |

## 5. Test results

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed |
| `npm run build` and the GitHub Pages build (`/Cuidance_Admin/`) | Both passed |
| Full browser suite | **352 loads, 0 problems:** 2 builds × 22 pages × 1440, 834, 390 and 320 px × light and dark. Covers the sidebar, Menu, back links, 44 px targets, overflow, logo, one primary button, keyboard order and no JavaScript |
| Theme: System light, System dark | Right background, sidebar and logo. Nothing saved. Desktop, tablet and mobile, both builds |
| Theme: Light while the device is dark, Dark while the device is light | Right colors and logo immediately, after reload, after a sidebar link, and in a new tab. Applied before React loads (no flash). Desktop, tablet and mobile (from inside Menu), both builds |
| Back to System | Clears the saved choice; follows the device again |
| Device setting changes | System follows it; a manual choice stays |
| Keyboard | Tab reaches Theme after Settings, with a visible focus ring. The arrow keys change it and the page updates. On mobile: Menu, then the links, then Theme |
| Short screens (1440 × 560, 834 × 600) | Sidebar scrolls; Theme control reachable |
| No JavaScript | Device setting applies, Theme control hidden, all 13 sidebar links visible, roles card shown, no overflow, at 1440 and 320 px |
| Roles wording | Settings and `/dev/` cards are identical. The Team access table lists the four roles. No em dashes |
| Responsive audit (12 widths) | No problems after the 1280 px fix |
| Dev server | No hydration warnings or errors in the theme cases (System, Light, Dark, and each against the device). The only console messages were the dev server's live-reload connection, which this sandbox blocks |
| Dependencies | None added. No token values, logo assets or icons changed |

## 6. Evidence

Screenshots in `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `theme-dark-over-system-light-1440.png` | Dark chosen while the device is light |
| `theme-light-over-system-dark-1440.png` | Light chosen while the device is dark |
| `theme-menu-open-390.png` | Theme control inside the open Menu |
| `theme-keyboard-focus-1440.png` | Focus ring on the Theme control |
| `settings-roles-1440-light.png`, `settings-roles-390-dark.png` | Roles and publishing card |
| `settings-nojs-320-dark.png` | Settings without JavaScript |
| `dashboard-ready-1280-light.png` | Dashboard at 1280 px after the tile fix |

## 7. Open items

| Item | Status |
| --- | --- |
| Content Editor permissions | **TO CONFIRM** with Team 03 |
| Theme control placement and wording | Built as requested. Team 03 to confirm in review |
| Status colors, Empty and Loading designs | **PROVISIONAL**, unchanged |
