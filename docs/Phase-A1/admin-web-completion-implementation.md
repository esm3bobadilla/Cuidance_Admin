# Phase A1: Admin Web completion (sample mode)

_Nov 11, 2026. Branch `feat/phase-a1-admin-web-completion`. Visual source: the Phase A1 reference pack (`Cuidance_Admin_Phase_A1_Reference_Pack.zip`) and the two annotated screenshots in the request._

**Everything here is sample mode.** There's no Supabase Auth, no real data, no Edge Functions and no database calls. Sign-in and notifications are samples, and nothing is checked, saved on a server or sent.

## 1. What changed

### A1.1 Landing and sign-in entry
- **New routes:** `/sign-in/` (the Admin Web landing and sign-in entry) and `/create-account/`. Both use the setup shell (logo and theme controls only, no sidebar).
- **Flow:** Sign In → Create Account (invitation only) or Accept Invitation → Account Setup → Review Tasks.
- **Sign In:** Email and Password, a "Forgot password?" note (reset isn't connected), one primary **Sign in** and a secondary **Create an account**. A well-formed email and any password open the sample Dashboard. The password is cleared and never stored.
- **Create Account:** there are **no public sign-ups**. The screen looks for an invitation for the email (the sample invitation is `reviewer.b@example.com`) and then links to Accept Invitation. It never creates an account by itself.
- **States:**
  - Sign In: `?state=loading` and `?state=submit-error`.
  - Create Account: `?state=loading`, `found`, `not-found` and `submit-error`.
  - Both screens show validation errors (missing or invalid email, missing password). Each error has an icon and a message, and the first invalid field gets focus.
  - Accept Invitation and Account Setup keep their Week 11 states (expired, declined, missing invitation and so on).
- **Without JavaScript:** a note asks the person to turn it on. Buttons that can't work are hidden.
- **The Dashboard stays at `/`.** Sign In is the entry page, but a sample site has no session to check. So no redirect was added, and every existing route still works.

### A1.2 Navigation
- **Sidebar order:**
  - Dashboard;
  - Content (Quiz Content, Guidance Content, Product Information, Knowledge Sources, Partner Highlights);
  - Review Tasks (Guidance Rules Review, Claims & Safety Review);
  - Metrics (Content Metrics).
- **How groups open:**
  - A group opens by default when you're on its page or one of its children.
  - Each toggle is labelled "<Group> pages" and says whether it's open.
  - Metrics has no page of its own, so the whole row is the toggle.
- **Profile card:** above Settings. It shows the sample identity, **Account Support** and **Notifications** (with the unread count).
- **Settings** is last.
- **Removed:**
  - the "Admin Web · Internal" label;
  - duplicate labels;
  - Appearance in the profile menu (the old Theme menu, Profile menu and MenuButton components were deleted).
- **Defined once in** `shared/content/admin-web-screens.ts`: `sidebarNav`, `sidebarProfileLinks` and `sidebarFooter`.
- **Unchanged:**
  - routes, breadcrumbs and the Week 10 phone Menu;
  - Commercial Content, which is still reached from the Content landing.

### A1.3 Theme controls and Notifications
- **Theme controls:** icon-only **Light / Dark / System** controls in the top bar and the setup bar (`components/layout/ThemeSwitch.tsx`).
  - **System** uses the approved Cuidance symbol mark in one color, following the text color.
  - The three controls work as a radio group: one Tab stop, and the arrow keys, Home and End choose.
  - Each control has a full label (for example "System theme, follows your device") and a short tooltip on hover and focus.
  - The selected control is shown with Compass Blue plus an underline bar, so the state isn't shown by color alone.
  - Each control is a 44 px target.
  - The choice is still kept in local storage `cuidance-admin-theme`.
- **Profile button:** shows the initials and an unread dot. Its label is "Profile and notifications, 2 new".
- **Notifications panel** (`components/layout/ProfilePanel.tsx`):
  - It opens from the Profile button or from the sidebar's Notifications link.
  - Contents:
    - the sample identity;
    - the **Notifications** heading, which gets focus when the panel opens;
    - the unread count;
    - four sample notifications (2 unread marked "New" with a dot, 2 read);
    - a sample note.
  - Actions: **Mark all as read**, **Sign out** (goes to Sign In) and **Close notifications**.
  - It closes with Escape, the Close button or a click outside, and focus returns to the Profile button.
  - Read state is kept in session storage `cuidance-admin-notifications-read`.
  - Sample items are in `shared/content/notifications.ts`.

### A1.4 Visual polish
- **Illustrations:** approved flat illustrations from the reference pack are in `shared/brand/illustrations/` (see its README):
  - the Dashboard top display banner: hands and jar with a leaf, on a Warm Care arch;
  - sidebar area 5: leaf and hand;
  - the Sign In and Create Account hero: hand and stone;
  - the Accept Invitation and Account Setup steps panel: leaf and hand.
- **Setup and entry screens:** restrained Grounded Green, Care Terracotta and Warm Care corner shapes, from the Sign-in Entry reference. They're decorative, hidden on phones, and kept clear of text.
- **Product, not marketing:** Admin Web keeps its own product layout (sidebar, cards, tables) and doesn't borrow the Brand Website's marketing layout.
- **Tokens only.** No new tokens and no shadows.

### A1.5 Accessibility and responsive
- **Reduced motion:** a `prefers-reduced-motion` rule in `globals.css` turns transitions and animations off.
- **Checked:**
  - no page-level overflow from phone to desktop widths;
  - focus rings on every stop;
  - 44 px targets;
  - one h1 per page;
  - icon labels;
  - contrast in light and dark;
  - menus, the panel and group toggles by keyboard and with `aria-expanded`;
  - no-JS output.

## 2. Test changes (and why)

The Week 10 shell suite and the Feature 2 suite expected the old Theme menu, Profile menu and sidebar order. For A1, copies of those suites expect the approved new order and controls. Everything else they check is unchanged.

- **Shell suite:**
  - the new sidebar order;
  - the theme radio group in place of the "Theme" button;
  - the Profile button text "TM";
  - radio controls don't count as primary buttons;
  - the 44 px target check measures the whole row for list items.
- **Feature 2 suite:** the keyboard order now includes "System" (the theme group) in place of "Theme".
- **New A1 suite:** covers the header controls, the panel, the sidebar, Sign In, Create Account, the banner, reduced motion and no-JS.
- **Responsive audit:** skips decorative, `aria-hidden` shapes that their container clips on purpose. Any other element running off the page still fails.

## 3. Still provisional or open
- **Sign-in and the Sign out link are samples.** Real sign-in, sessions and route protection come in Phase A2.
- **Notifications are sample data.** Nothing is delivered, and there's no email.
- **Empty and Loading states** stay provisional until Team 03 confirms them.
- **The illustration placements** follow the annotated screenshots. Team 03 may want to adjust them.

## 4. Evidence
Screenshots are in `docs/Phase-A1/evidence/`:
- Sign In (light, dark, phone);
- Create Account (invitation found);
- Dashboard (light, dark);
- Notifications panel;
- Review Tasks with the sidebar.
