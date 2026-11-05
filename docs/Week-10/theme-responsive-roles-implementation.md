# Week 10: Theme control, responsive check and role wording

- **Branch:** `feat/admin-web-theme-responsive`, from `main` at `2d929b7` (after PR #10)
- **Date:** Nov 5, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked PROVISIONAL need a Team 03 decision.
- **Not included:** Supabase, sign-in, live permissions, invitations, account creation, profile or avatar artwork, new routes, new dependencies, and Cuidance Mobile changes.

## 1. Theme control (Light, Dark or System)

**Placement update (Nov 5, 2026):** the first version put a Theme dropdown at the bottom of the sidebar. It's now **beside the profile area**, in a new top bar above every page, following the current responsive prototype (screen F14). The sidebar, navigation, routes and dark-mode sidebar are back exactly as they were on `main`.

**What people see:**
1. A **top bar** at the top right of every page with two things:
   - A **"Theme: System"** button. It shows the current choice.
   - The **profile area** beside it, using the initials treatment: a brand-colored circle with placeholder initials **"TM"** (team member). There's no sign-in, so it isn't a real person and opens nothing. No avatar artwork.
2. The button opens a **Theme menu**, styled like the prototype:
   - A "THEME" heading.
   - **Light**: "Always use the light theme".
   - **Dark**: "Always use the dark theme".
   - **System**: "Follows your device (now light)" or "(now dark)".
   - The current choice gets the Compass Blue selected surface plus a ✓.
   - A "Saved on this device." note at the bottom.
3. On phones, the top bar sits under the sidebar's logo and Menu row. The menu stays on screen down to 320 px.

**What's different from the prototype, on purpose:**
- **No icons.** The prototype's sun and moon icons come from the Material Symbols icon library, which isn't approved. The button uses text instead, and the selected mark is the approved ✓.
- **No drop shadow.** The board has no shadow value, so the menu uses a border.
- **System stays the default.** The prototype falls back to Light when nothing is saved.
- **Not built yet:** the profile menu (prototype screen F13), with its Appearance control, Team Access and Sign out links. It's part of the later prototype alignment.

**How it behaves:**
- **Mouse:** click the button to open the menu. Click a choice to apply it. Clicking anywhere else closes the menu.
- **Keyboard:**
  - Tab reaches the button right after the sidebar.
  - Enter, Space or an arrow key opens the menu, with focus on the current choice.
  - Up and Down arrows move between choices; Home and End jump to the first and last.
  - Enter or Space chooses.
  - Escape closes the menu and returns focus to the button. Tab closes it.
- **System** follows the device setting and updates when the device setting changes.
- **Light** or **Dark** stays chosen even when the device uses the other setting.
- **The choice is remembered.** It's kept in the browser (`localStorage`, key `cuidance-admin-theme`, the same key the prototype uses), so it survives reloads, page changes and later visits. Choosing System clears it.
- **No flash.** A short script in the page `<head>` applies the saved choice before the page draws.
- **The logo follows the theme.** The approved v04 lockups are used as supplied:
  - Light theme: the Quiet Paper reversed lockup on the green sidebar.
  - Dark theme: the Grounded Green lockup on the light sidebar.
  - Both images are in the page, and CSS shows the one that matches.
- **Without JavaScript,** the Theme button is hidden, because it can't work, and the device setting applies. The profile area still shows.
- **Before the page finishes loading,** the button can read "Theme: System" for a moment on a page with a saved choice. The colors are already right during that moment. Only the button's label catches up.

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
| Content Editor | Creates and edits educational content, sources, product information, and partner content. Submits content for review. **Can:** create and edit content; manage sources, product information, and partner content; submit content for review. **Cannot:** approve content, publish content independently, manage team members, assign roles |
| Reviewer | **Can:** review assigned content, add notes, approve items, request changes. **Cannot:** publish independently, manage team members, assign roles, edit core content |

- **Publishing rule shown on the card:** "Admin and Main Admin / Owner publish approved content."
- **Policy only:** "Policy description only. Roles aren't connected yet: there's no sign-in, and nothing here changes what anyone can do."
- **Nothing is enforced:** no sign-in, role assignment, invitations or permissions.

## 4. Files changed

| File | Change |
| --- | --- |
| `shared/design-tokens/tokens.css` | Reorganized so a manual Light or Dark choice works. No values changed |
| `shared/design-tokens/README.md` | Note about the Theme control and the two dark copies |
| `shared/content/theme.ts` | New: Theme menu wording, options, storage key and the before-paint script |
| `shared/content/admin-roles.ts` | New: role names, summaries, can and cannot lists, publishing rule |
| `admin-web/app/layout.tsx` | Before-paint script, the two logo images, and the top bar above each page |
| `admin-web/app/globals.css` | Shows the logo that matches the theme; page column for the top bar |
| `admin-web/components/layout/TopBar.tsx`, `.module.css` | New: top bar with the Theme menu beside the profile area |
| `admin-web/components/layout/ThemeMenu.tsx`, `.module.css` | New: the Light / Dark / System menu |
| `shared/content/profile.ts` | New: the profile placeholder initials and label |
| `admin-web/components/layout/Sidebar.tsx`, `Sidebar.module.css` | Unchanged from `main` (the earlier bottom-of-sidebar control was removed) |
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
| Theme: Light while the device is dark, Dark while the device is light | Chosen from the Theme menu. Right colors, logo and button label immediately, after reload, after a sidebar link, and in a new tab. Applied before React loads (no flash). Desktop, tablet and mobile, both builds |
| Back to System | Clears the saved choice; follows the device again |
| Device setting changes | System follows it; a manual choice stays |
| Keyboard | Tab reaches the Theme button right after the sidebar, with a visible focus ring. Enter opens the menu on the current choice; the arrow keys, Home and End move; Enter and Space choose; Escape and Tab close it; focus goes back to the button. A click outside also closes it. Desktop and mobile |
| Menu fit and contrast | The menu stays inside the screen from 1440 to 320 px. All menu text is at least 6.4:1 contrast, in light and dark |
| No JavaScript | Device setting applies, Theme button hidden, profile initials shown, all 13 sidebar links visible, roles card shown, no overflow, at 1440 and 320 px |
| Roles wording | Settings and `/dev/` cards are identical, including the approved Content Editor wording. The Team access table lists the four roles with the same summaries. No em dashes |
| Responsive audit (12 widths) | No problems after the 1280 px fix |
| Dev server | No hydration warnings or errors in the theme cases (System, Light, Dark, and each against the device). The only console messages were the dev server's live-reload connection, which this sandbox blocks |
| Dependencies | None added. No token values, logo assets or icons changed |

## 6. Evidence

Screenshots in `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `theme-dark-over-system-light-1440.png` | Dark chosen while the device is light |
| `theme-light-over-system-dark-1440.png` | Light chosen while the device is dark |
| `theme-menu-open-390.png` | Theme menu open on a phone |
| `theme-keyboard-focus-1440.png` | Theme menu opened from the keyboard, focus on the current choice |
| `settings-roles-1440-light.png`, `settings-roles-390-dark.png` | Roles and publishing card |
| `settings-nojs-320-dark.png` | Settings without JavaScript |
| `dashboard-ready-1280-light.png` | Dashboard at 1280 px after the tile fix |

## 7. Open items

| Item | Status |
| --- | --- |
| Theme control | Placed beside the profile area as in the prototype (F14), with text in place of the prototype's icons. Team 03 to confirm in review |
| Profile placeholder initials "TM" | **PROVISIONAL** until sign-in exists |
| Profile menu (F13) and the rest of the prototype | Later, on `feat/admin-web-prototype-alignment` |
| Status colors, Empty and Loading designs | **PROVISIONAL**, unchanged |
