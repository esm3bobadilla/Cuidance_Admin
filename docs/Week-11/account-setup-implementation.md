# Week 11, Feature 2: Accept Invitation and Account Setup

- **Branch:** `feat/week-11-account-setup`, from `main` at `03af20a` (PR #13 merged and deployed)
- **Date:** Nov 10, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme** before the pull request merges. Items marked **PROVISIONAL** need a Team 03 decision.
- **Plan:** `docs/Week-11/close-the-loop-implementation-plan.md`. Decisions A1 to A14 approved by Team 03 on Nov 10, 2026.
- **Visual source:** none for these screens (no hi-fi reference). The layout is **PROVISIONAL** and uses the approved Admin Web visual system.
- **PROTOTYPE ONLY.** No Supabase, no sign-in, no password storage, no invitation tokens, no email, no backend, no permission checks, no real account creation.

## 0. Team 03 decisions (Nov 10, 2026)

| # | Decision |
| --- | --- |
| A1 | The invited person is the placeholder **Reviewer B**, role **Reviewer** (lines up with the Review Task Decision Loop) |
| A2 | Invited email `reviewer.b@example.com` (`example.com` is reserved for samples) |
| A3 | Workspace "Cuidance Content Team" |
| A4 | Invited by "Team member A (Main Admin / Owner)" |
| A5 | Sample expiry dates: Nov 24, 2026 (valid) and Nov 3, 2026 (expired) |
| A6 | Password: at least 12 characters, at least one letter, at least one number |
| A7 | Work email is prefilled, editable, must be a valid email and must match the invitation |
| A8 | Setup screens show the logo and the Theme menu only: no sidebar, Menu, breadcrumb or profile |
| A9 | **Compass Blue** for primary buttons (as everywhere in Admin Web). **Grounded Green** for branding, the logo, dark surfaces and supporting elements |
| A10 | The setup name doesn't replace "Reviewer B" anywhere yet (v1.1) |
| A11 | "Request a new invitation" shows a message only; nothing is sent |
| A12 | Team Access stays unchanged (no "Invitation pending" to "Active" yet) |
| A13 | Prototype notice on both screens |
| A14 | Both screens on one branch, `feat/week-11-account-setup` |

## 1. What changed

### Setup shell (both screens)

- `/accept-invitation/` and `/account-setup/` use a slim top bar: the official Cuidance logo (the same approved lockup as the phone top bar) and the **Theme** menu. There's **no sidebar, Menu, breadcrumb or profile**. The skip link still works.
- `AdminShell` decides this from the address (`isSetupPath` in `shared/content/admin-web-screens.ts`). **Every other route renders exactly as before**, and the Week 10 suite confirms it (352 loads, 0 problems).
- The page is a **Grounded Green welcome panel** ("Cuidance Admin Web", a one-line description, and the three steps: Accept your invitation, Set up your account, Start reviewing tasks) beside a **white form card** on the Quiet Paper background. The current step is a filled circle in bold (`aria-current="step"`), not color alone. Below 1024 px the panel sits above the card.
- Headings use Newsreader, interface text Archivo, eyebrows Care Terracotta, the access summary the Warm Care surface.

### Accept Invitation (`/accept-invitation/`)

1. **Valid invitation:** "You’re invited to Cuidance Admin Web", then Workspace, Invited person, Invited email, Assigned role (with the approved Reviewer summary), Invited by and Invitation expires. Then the prototype notice, **Accept invitation** (the one primary button) and **Decline invitation**.
2. **Accept:** ✓ "Invitation accepted", "Next, set up your account." and **Continue to account setup**. Focus moves to the heading.
3. **Already accepted** (opened again): "This invitation has already been accepted" with **Continue to account setup**, or **Go to Review Tasks** once the account exists.
4. **Decline:** "Invitation declined", with **Request a new invitation** and **Reset sample data**.
5. **Expired** (`?invite=expired`): Dark Ruby ⚠ "It expired on Nov 3, 2026. Ask an Admin to send a new invitation.", the details, and **Request a new invitation**.
6. **Not found** (`?invite=` anything unknown): ◌ "This invitation link isn’t valid. Ask an Admin to send a new invitation." and **Request a new invitation**.
7. **Request a new invitation:** "Ask an Admin to send a new invitation. No email is sent from this prototype." (`role="status"`). Nothing is sent.

### Account Setup (`/account-setup/`)

1. **Missing invitation** (no accepted invitation in this tab): ◌ "Accept your invitation first" with **Go to your invitation**.
2. **Form:** "Set up your account", the **Your access** summary (Workspace, Role with its summary, Invited by) on the Warm Care surface, then **Full name**, **Work email** (prefilled, with "Use the email this invitation was sent to."), **Password** with the live **Password requirements** list, and **Confirm password**. Then the prototype notice, **Create account** (primary) and **Back** (to the invitation).
3. **Password requirements:** each shows □ until met, then ✓ in Steady Olive, and screen readers hear "met" or "not met yet". The list is linked to the password field (`aria-describedby`).
4. **Errors** (Dark Ruby ⚠ beside the field, `aria-invalid`, read with the field; focus moves to the first one, in form order):
   - "Enter your full name."
   - "Enter your work email." / "Enter a valid email address, like name@example.com." / "Use the email this invitation was sent to: reviewer.b@example.com."
   - "Enter a password." / "Use a password that meets all three requirements."
   - "Enter your password again." / "Passwords don’t match."
   - Each error clears when its field changes.
5. **Submission error:** ⚠ "Couldn't create your account. Try again." (`role="alert"`), when the browser refuses to save.
6. **Account created:** ✓ "Account created", "Welcome, *name*. Your Reviewer access to Cuidance Content Team is ready.", "Prototype only: this account exists in this browser tab only. Nothing was saved or sent.", **Go to Review Tasks** (primary) and **Reset sample data**. Focus moves to the heading. The password fields are cleared from memory.
7. **Go to Review Tasks** opens `/review-tasks/`, where the sidebar and the normal Admin Web shell start.

## 2. States and previews

| Screen | State | How to see it |
| --- | --- | --- |
| Accept Invitation | Valid | Default, including without JavaScript (buttons hidden; "Turn on JavaScript to accept or decline this invitation.") |
| | Loading | `?state=loading` (⋯ "Checking your invitation…", `role="status"`) |
| | Expired | `?invite=expired`, or the preview `?state=expired` |
| | Declined | Decline, or `?state=declined` |
| | Not found | `?invite=` with any unknown value, or `?state=not-found` |
| | Already accepted | Accept, then reload, or `?state=accepted` |
| | Request a new invitation | From expired, declined or not found |
| Account Setup | Loading | `?state=loading` (⋯ "Loading your account details…") |
| | Missing invitation | Default before accepting (and without JavaScript), or `?state=missing` |
| | Field errors | Create account with empty or wrong fields |
| | Submission error | `?state=submit-error`, or when the browser refuses to save |
| | Account created | Create account, or `?state=success` |

Previews never save anything. All wording is **PROVISIONAL**.

## 3. State model

| What | Where | Lasts until |
| --- | --- | --- |
| Invitation answer (`accepted` / `declined`), "requested a new invitation", account `{ fullName, email }` | Session storage `cuidance-admin-onboarding` (`app/_onboarding/onboardingStore.ts`) | The tab closes, or **Reset sample data** |
| **Password and confirm password** | **The form fields only. Never saved** in any storage, the address or the page; cleared after success | Leaving the page |
| Which invitation shows | `?invite=` (none or `sample`: valid; `expired`; anything else: not found) | The address |
| Rules: password requirements, email check, `validateSetup`, `invitationView`, `setupView`, `parseOnboardingSession` | `shared/onboarding/onboarding-rules.ts` (no React) | (rules) |

The onboarding store is separate from the review decisions store: setting up an account doesn't change any review decision, and Reset on these screens only clears onboarding.

## 4. PROVISIONAL items

| Item | Why |
| --- | --- |
| Layout and all wording | No hi-fi reference |
| Full name starts empty | The invited name is a placeholder; the person types their own |
| Decline has no "are you sure" step | No flow defined; Reset sample data undoes it in the prototype |
| The expired and not-found states don't offer Accept | There's nothing valid to accept |
| No "show password" toggle | Not requested |
| Theme menu is the only control in the setup bar | A8 |

## 5. Files

| File | Change |
| --- | --- |
| `shared/content/invitation.ts` | **New.** Sample invitations, `invitationFromParam`, Accept Invitation wording, the prototype notice |
| `shared/content/account-setup.ts` | **New.** Account Setup wording |
| `shared/onboarding/onboarding-rules.ts` | **New.** Password and email rules, validation, state rules, saved-data reader |
| `shared/content/admin-web-screens.ts` | Adds the two screens (no parent, not in the sidebar) and `setupScreens` / `isSetupPath` |
| `admin-web/app/accept-invitation/page.tsx`, `admin-web/app/account-setup/page.tsx` | **New routes** |
| `admin-web/app/_onboarding/` | **New.** `onboardingStore.ts`, `AcceptInvitationView.tsx`, `AccountSetupView.tsx`, `SetupFrame.tsx`, `OnboardingStateFromUrl.tsx`, `onboarding.module.css` (tokens only) |
| `admin-web/components/layout/AdminShell.tsx` | Uses the setup shell on the two setup routes |
| `admin-web/components/layout/SetupBar.tsx`, `.module.css` | **New.** Logo and Theme menu |
| `admin-web/app/globals.css` | `.app-setup` grid (top bar, then the page) |
| `ARCHITECTURE.md`, `README.md`, `docs/Week-11/close-the-loop-implementation-plan.md` | Updated |

**Unchanged:** every Week 10 screen, Dashboard, Review Tasks, Review Task Detail, the review decisions store and counts, the sidebar, top bar, theme behavior, tokens, logo files, dependencies (`package.json` and the lockfile), the deploy workflow. The Cuidance Brand Website and the public app repository are not touched.

## 6. Test results

| Check | Result |
| --- | --- |
| TypeScript, production build, GitHub Pages build | All passed. `/accept-invitation/` and `/account-setup/` are static pages in both builds |
| **Week 10 regression** | Full suite **352 loads, 0 problems**. Theme, Review Tasks and Settings, Quiz Content, Product Information, Claims & Safety Review, Content landing, Content Metrics and the six list screens: **0 failures each** |
| **Week 11 Review Task Decision Loop** | **0 failures:** 80 detail loads, 96 preview loads, 16 full loops (Approve, Request changes, required note, Dashboard counts, reset, keyboard, no JavaScript) |
| **Feature 2 rules** (no browser) | **0 failures:** every password requirement (11 vs 12 characters, no letter, no number), mismatch, email format, spaces, case, mismatch, every invitation and setup state, `?invite=` values, saved-data reader drops a password and bad values, sample values match A1 to A5, setup routes |
| **Feature 2 browser tests** | **0 failures.** Both builds, 1440, 834, 390 and 320 px, light and dark: 32 page loads, 192 preview loads, 16 full flows. Setup shell (no sidebar, breadcrumb, Menu or profile; logo and Theme visible; skip link); every invitation field; one primary button per state; every state; Decline, Request a new invitation, Reset; Accept, Already accepted, Continue; missing invitation; each field error with focus, `aria-invalid` and `aria-describedby`; live requirement marks; submission error; Account created; **the password is never in session storage, local storage, the address or the page**; review decisions untouched; Go to Review Tasks lands on Review Tasks **with** the sidebar; Back; a new tab starts fresh; **no requests to any other site**; no console errors; no em dashes or banned words; symbols hidden from screen readers |
| Keyboard | Both builds, light and dark: skip link, Theme, Accept invitation, Decline invitation in order with the focus ring; Enter accepts and focus moves to the heading; Continue; then Full name, Work email, Password, Confirm password, Create account, Back; Enter with errors focuses the first error; typing and Enter create the account and focus the heading. The Theme menu in the setup bar switches the theme |
| No JavaScript | 1440 and 320 px, both builds: Accept Invitation shows the invitation and the "Turn on JavaScript" message with no buttons; Account Setup shows the missing-invitation state with a working link; no sidebar; no sideways scrolling |
| Responsive audit | 12 widths from 1440 to 320 px, both builds, in 5 saved states (fresh, review decision made, invitation accepted, account created, declined), 49 addresses each: **no issues**. No sideways scrolling, nothing spilling out of its box, nothing off-screen, no target under 44 px. The audit now skips 1 px screen-reader-only text (the hidden "met / not met yet" words), which its spill check had counted |
| Contrast | All text at least **4.8:1** (light) and **7.5:1** (dark) in every state, including errors and Account created; field borders at least 4.5:1; the step circles at least 11.9:1 |
| Hydration | **256 dev-server loads** (16 addresses, including Dashboard, Review Tasks and a task detail page; 4 saved states; 4 theme setups): no warnings or errors |

## 7. Screenshots

In `docs/Week-11/evidence/`:

| File | What it shows |
| --- | --- |
| `accept-invitation-{1440-light,1440-dark,834-light,390-dark}.png` | The valid invitation |
| `accept-invitation-accepted-1440-light.png`, `accept-invitation-already-accepted-390-light.png` | After Accept, and opened again |
| `accept-invitation-declined-1440-dark.png`, `accept-invitation-expired-1440-light.png`, `accept-invitation-not-found-390-light.png`, `accept-invitation-request-new-1440-light.png` | Declined, expired, not found, Request a new invitation |
| `account-setup-{1440-light,1440-dark,834-light,390-dark}.png` | The form |
| `account-setup-errors-1440-light.png`, `account-setup-email-and-password-errors-390-light.png`, `account-setup-password-mismatch-1440-dark.png` | Validation |
| `account-setup-missing-invitation-1440-light.png`, `account-setup-loading-1440-dark.png`, `account-setup-submit-error-1440-light.png` | Missing invitation, loading, submission error |
| `account-created-1440-light.png`, `account-created-390-dark.png` | Account created |
| `review-tasks-after-setup-1440-light.png` | Review Tasks after Go to Review Tasks, with the sidebar |
| `account-setup-keyboard-dark.png` | Keyboard focus on the password field |
