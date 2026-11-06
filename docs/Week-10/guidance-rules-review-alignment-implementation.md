# Prototype alignment, final batch: Guidance Rules Review

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/guidance-rules-review/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Guidance Rules Review (attached Nov 6, 2026). The unreadable PDF supplied nothing.

## 1. D9 placement decision (recorded Nov 6, 2026)

1. **This screen is Guidance Rules Review.** It shows how quiz responses connect to educational guidance.
2. **It stays a top-level screen** at `/guidance-rules-review/`, with its sidebar item as before.
3. **The PDF's §02 "Branch & Routing Rules" isn't a separate screen:** its subject is covered here.
4. **The breadcrumb keeps the approved name**, "Admin / Guidance Rules Review", where the hi-fi shows "Admin / Guidance Rules".

## 2. What changed

The screen was structure-only. It now follows the hi-fi.

1. **Header:**
   - The eyebrow is "Internal tool".
   - The title and the approved scope note are unchanged: "Review of the rules that build a guidance result. Admin Web never generates picks for people."
2. **Banner** (hi-fi): "Rules are reviewed by people. Guidance explains what may be useful; it does not diagnose or make unquestionable automated judgments."
3. **Toolbar:** **Search rules** (the hi-fi placeholder), **Care area** and **Status** filters.
4. **List** "Guidance rules (sample data)", with the hi-fi's columns Rule name, Trigger or answer, Care area, Linked guidance, Status, Reviewer, Last updated. All four hi-fi rules are included.
5. **Rule details:**
   - The status and version, and the rule name.
   - **Question or answer trigger**, with "From: How would you describe your skin?".
   - **Linked guidance content**.
   - **Explanation**.
   - **Safety boundary**: the hi-fi wording, on every rule.
   - **Reviewer notes**, and the last-updated line.
6. **Statuses:** Draft (dashed), In review (neutral), Approved with notes (success plus ✓), Needs changes (Dark Ruby plus ⚠).
7. **States:**
   - Loading, empty and error (`?state=`).
   - No results with **Clear search and filters**.
   - Without JavaScript, the list and the first rule show.

**Educational and non-diagnostic:** the banner and the safety boundary state it on the screen. Nothing here generates picks or makes automated judgments.

## 3. PROVISIONAL

| Item | Why |
| --- | --- |
| **Reviewer names replaced** by "Reviewer A" to "D" | Placeholders |
| **Question and Version filters not built** | The hi-fi doesn't say which questions or versions exist |
| **Not built:** Mark in review, Edit rule, the "…" menu, the version switcher, the linked-content open icon | No approved review, edit or publishing flow; no approved icons |
| **Details for three of the four rules** | The hi-fi shows one, so the others show "To be confirmed by Team 03." |
| The hi-fi's safety-boundary text has a typo ("automertal"); the banner's spelling, "automated", is used | Same sentence |
| Status mapping, state wording, details position below 1280 px; at 1280 px the table scrolls 32 px inside its panel | As on the other screens |

## 4. Files

- **New:**
  - `shared/content/guidance-rules-review.ts`
  - `admin-web/app/_rules/GuidanceRulesView.tsx` and `StateFromUrl.tsx`
- **Updated:**
  - `admin-web/app/guidance-rules-review/page.tsx`
  - `admin-web/app/_listDetail/listDetail.module.css` (new `.notice` style)

## 5. Tests

| Check | Result |
| --- | --- |
| Screen tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** <ul><li>4 rules; the banner.</li><li>The first rule's version, trigger and question, explanation, safety boundary and reviewer notes.</li><li>The safety boundary shows on every rule.</li><li>Search "hair" shows 1; Status = Needs changes shows 1.</li><li>No results and Clear.</li><li>No hi-fi names, Mark in review, Edit rule, Publish or Approve.</li><li>No em dashes, no overflow, no console errors.</li></ul> |
| States, keyboard, no JavaScript | Pass: three states in both builds and themes; visible rings; the list without JavaScript at 1440 and 320 px |
| Contrast | At least 4.8:1 in light and 7.8:1 in dark |
| Hydration | No warnings |
| Final batch suite | TypeScript, production and GitHub Pages builds; full suite 352 loads, 0 problems; every earlier screen's tests; responsive and 44 px audit at 12 widths in both builds |

## 6. Screenshots

In `docs/Week-10/evidence/`:
- **Hi-fi beside this build:** `guidance-rules-review-compare-hifi-1440-{light,dark}.png`
- **Full screen:** `guidance-rules-review-aligned-{1440,834,390}-{light,dark}.png`
- **No results:** `guidance-rules-review-aligned-no-results-{desktop,mobile}.png`
- **States:** `guidance-rules-review-aligned-{loading,empty}-1440-light.png` and `guidance-rules-review-aligned-error-1440-dark.png`
- **Keyboard:** `guidance-rules-review-aligned-keyboard-dark.png`
