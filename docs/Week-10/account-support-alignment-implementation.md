# Prototype alignment, final batch: Account Support

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/account-support/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Account Support (attached Nov 6, 2026). The unreadable PDF supplied nothing.

## 1. What changed

The screen was structure-only. It now follows the hi-fi as a **limited, read-only internal support view** (CLAUDE.md).

1. **Header:**
   - The eyebrow is "Internal tool".
   - The title and the approved scope note are unchanged: "A limited internal support view. No public user-account management."
2. **Toolbar:** **Search requests** (the hi-fi placeholder, "Search by ticket ID or masked email…"), **Status** and **Request type** filters.
3. **List** "Account support requests (sample data)", with the hi-fi's columns Ticket ID, Request type, User reference, Status, Assigned to, Last updated. All six hi-fi requests are included; a "6 requests" count follows.
4. **Request details:**
   - The ticket, status, date and request type.
   - User reference and Assigned to.
   - **Request summary**.
   - **Privacy note** (the hi-fi wording, shown on every request).
   - **Internal notes** with their last-updated line, and **Next action**.
5. **Statuses:** New (warning orange), In progress (neutral), Waiting for user (dashed), Resolved (success plus ✓).
6. **States:**
   - Loading, empty and error (`?state=`).
   - No results with **Clear search and filters**.
   - Without JavaScript, the list and the first request show.

**Privacy:**
- User references stay **masked** exactly as in the hi-fi (for example u***@gmail.com).
- There are no full email addresses, names, passwords or other personal information.
- Search only matches the masked reference.
- The privacy note shows on every request.
- **There's no sign-in or authentication behavior.**

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| **Staff names replaced** by "Team member A" to "D" | Placeholders |
| **Read-only:** Close ticket, Mark as resolved, the top-bar search and notifications not built | No approved support flow |
| **Details for five of the six requests** | The hi-fi shows one, so the others show "To be confirmed by Team 03." |
| Masked references keep real email-provider domains (gmail, outlook, yahoo, hotmail) as in the hi-fi | They're masked. Team 03 may prefer a neutral domain |
| The first request's notes mention a "password reset" | It's the hi-fi's description of the user's own step; no password is shown or handled |
| Hi-fi icons and artwork; status mapping; state wording | Not approved; provisional as elsewhere |

## 3. Files

- **New:**
  - `shared/content/account-support.ts`
  - `admin-web/app/_support/AccountSupportView.tsx` and `StateFromUrl.tsx`
- **Updated:** `admin-web/app/account-support/page.tsx`.

## 4. Tests

| Check | Result |
| --- | --- |
| Screen tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** <ul><li>6 requests; the first request's summary, privacy note, notes and next action.</li><li>Every request shows the privacy note.</li><li>Search "gmail" shows 3; Status = Resolved shows 2.</li><li>No results and Clear.</li><li>No staff names, unmasked email addresses, Close ticket or Mark as resolved.</li><li>No em dashes, no overflow, no console errors.</li></ul> |
| States, keyboard, no JavaScript | Pass: three states in both builds and themes; visible rings; the list without JavaScript at 1440 and 320 px |
| Contrast | At least 4.8:1 in light and 8.2:1 in dark |
| Hydration | No warnings |
| Final batch suite | TypeScript, production and GitHub Pages builds; full suite 352 loads, 0 problems; every earlier screen's tests; responsive and 44 px audit at 12 widths in both builds |

## 5. Screenshots

In `docs/Week-10/evidence/`:
- **Hi-fi beside this build:** `account-support-compare-hifi-1440-{light,dark}.png`
- **Full screen:** `account-support-aligned-{1440,834,390}-{light,dark}.png`
- **No results:** `account-support-aligned-no-results-{desktop,mobile}.png`
- **States:** `account-support-aligned-{loading,empty}-1440-light.png` and `account-support-aligned-error-1440-dark.png`
- **Keyboard:** `account-support-aligned-keyboard-dark.png`
