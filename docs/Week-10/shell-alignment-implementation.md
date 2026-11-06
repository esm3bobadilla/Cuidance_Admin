# Prototype alignment, Slice 1: shared Admin Web shell

- **Branch:** `feat/admin-web-prototype-alignment` (from `main` at `9764127`)
- **Date:** Nov 5, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Plan:** `docs/Week-10/prototype-alignment-map.md`, step 1. Content screens are **not** changed in this slice.

## 1. What changed

**Sources:**
- **Shell:** the Cuidance Admin Responsive Prototype, which is the source of truth for the shell under D1.
- **Kept as approved:** the sidebar destinations, the blue active item, the dark-mode sidebar, the theme behavior and the role wording.

1. **Top bar on every page:**
   - The breadcrumb on the left, starting with **"Admin"**, which links to the Dashboard. Then the screen's parents and the current page.
   - The Dashboard appears only when it's the current page ("Admin / Dashboard"). Elsewhere: for example "Admin / Content / Quiz Content" and "Admin / Settings".
   - `/dev/` shows "Admin / Component Preview". The 404 page shows "Admin / Page not found".
   - The **Theme** button and the **profile** circle on the right.
2. **Back links removed.** The "‹ Back to …" links are gone from every page. The breadcrumb and the sidebar replace them (Team 03 approval, Nov 5; this settles C2, C3 and D4).
3. **Sidebar:**
   - **"ADMIN WEB · INTERNAL"** as plain text under the logo. It's written once in `shared/content/admin-web-screens.ts` and shown in capitals.
   - Destinations, the blue active item, the Content toggle and the dark-mode sidebar are **unchanged**.
4. **Profile menu** (prototype F13). The "TM" circle opens:
   - "**Team member** · Sign-in isn't connected yet."
   - **Appearance:** Light, Dark and System as a three-part choice, with Compass Blue plus a ✓ on the current one.
   - "Saved on this device."
   - It shares **one saved preference** with the Theme menu. Changing either one updates the other immediately.
   - **Not included:** Sign out, Team Access, workspace switching and role switching.
5. **Theme menu:** unchanged in behavior. It's text-based, System is the default, the choice is saved on the device and applied before first paint. It now uses the same shared menu behavior as the profile menu.
6. **Phones (under 768 px):**
   - One top bar with **Menu**, the **logo**, **Theme** and the **profile**. The breadcrumb is hidden there, as in the prototype.
   - The logo in that bar sits on the page background, so it uses the Grounded Green lockup in the light theme and the Quiet Paper reversed lockup in the dark theme (approved v04 files, used as supplied).
   - Menu opens the same sidebar list below the bar.
7. **Tablet (768 to 1279 px):** keeps the 240 px sidebar.
8. **Without JavaScript:**
   - The sidebar list is always shown.
   - Menu, Theme and the profile menu are hidden, because they can't work.
   - The breadcrumb still works.
   - The device's light or dark setting applies.

**Keyboard:**
- **Tab order:** the skip link, the top bar (breadcrumb links, Theme, profile), the sidebar, then the page. On phones: Menu, then Theme and profile, then the list once it's open.
- **Both menus:**
  - Enter, Space or an arrow key opens the menu on the current choice.
  - The arrow keys, Home and End move.
  - Enter or Space chooses.
  - Escape closes the menu and returns focus to its button. Tab closes it.
  - A click outside also closes it.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| Phone top bar wraps onto two lines below about 480 px | Menu, the 160 px minimum logo, "Theme: System" and the profile don't fit on one line at 390 or 320 px. Theme and the profile move to a second line, on the right. The prototype fits one line by using icons and a smaller logo, and neither is approved |
| Breadcrumb hidden on phones | Follows the prototype. The Menu list is the way around on phones |
| Profile initials "TM" | Placeholder until sign-in exists |
| Menus have a border, not a shadow | The board has no shadow value |
| Tab order puts the top bar before the sidebar | The top bar comes first in the page so that phones have the right order (Menu before the list) |
| The prototype's workspace card, "View as" role switcher, "PROTOTYPE · SAMPLE DATA" label and icons | Not built (D16 and D6 are still open) |

## 3. Files

| File | Change |
| --- | --- |
| `admin-web/components/layout/AdminShell.tsx` | New: the shell (top bar, sidebar, page) and the phone Menu state |
| `admin-web/components/layout/TopBar.tsx`, `.module.css` | Breadcrumb, Menu and the logo on phones, Theme and profile |
| `admin-web/components/layout/MenuButton.tsx`, `.module.css` | New: shared menu behavior and panel |
| `admin-web/components/layout/ProfileMenu.tsx`, `.module.css` | New: profile menu with Appearance |
| `admin-web/components/layout/themeStore.ts` | New: one shared saved theme preference |
| `admin-web/components/layout/ThemeMenu.tsx`, `.module.css` | Uses the shared menu and preference |
| `admin-web/components/layout/Sidebar.tsx`, `.module.css` | "ADMIN WEB · INTERNAL" label; the Menu button moved to the top bar; destinations and styles unchanged |
| `admin-web/components/layout/PageHeader.tsx` | No breadcrumb slot (it's in the top bar now) |
| `admin-web/app/_screens/ScreenPage.tsx` | Breadcrumb and back link removed |
| `admin-web/app/dev/page.tsx` | Breadcrumb removed (it's in the top bar now) |
| `admin-web/app/layout.tsx`, `globals.css` | Shell layout; a second logo pair for the phone bar |
| `shared/content/admin-web-screens.ts` | Shell wording: "Admin", the sidebar label, Menu, and the breadcrumb names for `/dev/` and 404 |
| `shared/content/profile.ts` | Profile menu wording |

**Unchanged:** tokens, logo files, routes, dependencies, role wording, the deploy workflow and content-screen layouts.

## 4. Test results

| Check | Result |
| --- | --- |
| TypeScript, production build, GitHub Pages build | All passed |
| Full browser suite | **352 loads, 0 problems.** That's 2 builds × 22 pages × 1440, 834, 390 and 320 px × light and dark. It now also checks:<ul><li>The breadcrumb trail on every page.</li><li>The breadcrumb is hidden on phones.</li><li>No back links.</li><li>The sidebar label.</li><li>The Theme button and the profile side by side.</li><li>The right logo for each width and theme.</li></ul> |
| Breadcrumb navigation | 18 of 18 parent links land on the right page, in both builds |
| Theme tests | 0 failures. System light and dark; Light over a dark device and Dark over a light device; reload, a sidebar link and a new tab; back to System. Desktop, tablet and mobile, both builds |
| Profile menu | 0 failures at 1440, 834, 390 and 320 px, both builds. The exact identity line, the Appearance options, the current choice and focus. Choosing Dark there updates the Theme button and the saved choice; choosing System in the Theme menu updates the profile. The menu stays on screen, has no Sign out or Team Access, and closes on an outside click |
| Keyboard | Both menus: open, move (arrows, Home, End), choose, Escape and Tab, focus returning, and visible focus rings in light and dark |
| Responsive audit | 12 widths from 1440 to 320 px, both builds: no sideways scrolling, nothing spilling out, no target under 44 px |
| Contrast | Theme menu at least 6.4:1, profile menu at least 6.8:1, light and dark |
| No JavaScript | At 1440 and 320 px: all 13 sidebar links shown; Menu, Theme and profile hidden; one logo; no overflow |
| Hydration | No warnings or errors in the dev server (System, Light and Dark, each against the device). The only messages were the sandbox's live-reload connection notices |

## 5. Screenshots

In `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `shell-compare-1440-light.png`, `shell-compare-1440-dark.png` | Prototype F08 beside this build, desktop |
| `shell-compare-834-light.png`, `shell-compare-834-dark.png` | Tablet |
| `shell-compare-390-light.png`, `shell-compare-390-dark.png` | Phone |
| `shell-compare-theme-menu-1440-light.png` | Theme menu beside the prototype's F14 |
| `shell-compare-profile-menu-1440-dark.png`, `shell-compare-profile-menu-390-light.png` | Profile menu beside the prototype's F13 |
| `shell-menu-open-390-dark.png` | Phone with Menu open |
| `shell-profile-keyboard-1440-dark.png` | Profile menu opened from the keyboard |

**Differences from the prototype that remain on purpose:**
- The blue active sidebar item and the light dark-mode sidebar (D3 and D7).
- Text buttons instead of icons (D6).
- No workspace card or role switcher (D16).
- The Dashboard content itself, which is step 2.
