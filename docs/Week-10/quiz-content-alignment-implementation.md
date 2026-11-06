# Prototype alignment, Slice 3a: Quiz Content

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/content/quiz-content/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 hi-fi screenshot of Quiz Content (**A2**, attached Nov 6, 2026). The unreadable PDF supplied nothing.
- **Scope:** Quiz Content only. Other content screens are unchanged.

## 1. What changed

The screen was structure-only: title, scope note, "Structure only" note and a Related link. It now follows A2's layout.

1. **Header:**
   - The eyebrow is **"Internal tool"**, as in A2 and on the Dashboard. It used to be "Content".
   - The title and scope note are unchanged. The breadcrumb is in the shared top bar (Admin / Content / Quiz Content).
2. **Sample-data note**, the same wording as the Dashboard and Review Tasks.
3. **Toolbar:**
   - **Search questions**: a visible label, with A2's placeholder "Search questions, care areas, or keywords…".
   - **Status**: All statuses, Published, In review or Draft.
   - Search matches the question, type, care area and status. Both work together.
4. **Question list:**
   - A table captioned "Quiz questions (sample data)", with the columns Question, Type, Care area, Status and Last updated (the date, plus "by Team member A" and so on).
   - The selected row has the approved Compass Blue selected treatment. The question text is a button that selects the row (`aria-pressed`).
   - A count follows the list, for example "1–5 of 5 questions", and screen readers announce it when it changes.
5. **Question details** (A2's right panel):
   - The "QUESTION DETAILS" label, the question as the heading, its status, and "Last updated … by …".
   - **Type**, and **Care area** with A2's note for Universal ("Shown to all participants at the start of the quiz.").
   - **Answer options**: "To be confirmed by Team 03." (PROVISIONAL, see section 3).
   - From 1280 px it sits beside the list. Below that it sits under the list.
6. **Related:** the existing Review Tasks link card is unchanged.

**Statuses** (PROVISIONAL mapping, text always shown):
- Published: success colors plus ✓.
- In review: neutral.
- Draft: neutral with a dashed border.

Byzantium Plum isn't used for Draft, because it's reserved for Partner content.

## 2. States

| State | What shows | How to preview |
| --- | --- | --- |
| Ready | Toolbar, list, details | Default, including without JavaScript |
| Loading | ⋯ "Loading quiz questions…" (`role="status"`); toolbar disabled | `?state=loading` |
| Empty | ◌ "No quiz questions yet." plus **Go to Content** | `?state=empty` |
| Error | Dark Ruby ⚠ "Couldn't load quiz questions. Check your connection, then reload the page." (`role="alert"`) | `?state=error` |
| **No results** | ◌ "No questions match your search or filter." plus **Clear search and filter**, which resets both and returns focus to the search field. The count reads "0 of 5 questions" | Type a search with no matches |

All state wording is **PROVISIONAL**.

**Without JavaScript:** the full sample list and the first question's details show. The toolbar is hidden, because it can't work.

## 3. Sample data and PROVISIONAL items

**Sample rows:**
- All five come from A2: question text, type, care area, status and date as shown.
- A2's editor names are replaced by "Team member A/B/C", as the Dashboard does with reviewers.
- The wording and data are in `shared/content/quiz-content.ts`.

| Item | Why |
| --- | --- |
| **Three of A2's eight questions are left out** ("What's most important to you right now?", "How are you feeling in your day-to-day life?", "What would support you most right now?") | Their care areas, "Emotional Wellbeing" and "Practical Support", aren't Cuidance care areas (hair, skin, makeup, body care). **Team 03 to confirm** |
| **A2's answer options are left out** ("My emotional wellbeing", "Practical support", "Understanding a condition or topic", "Finding care and next steps") | Same reason. "Understanding a condition" also comes close to medical scope. The panel says "To be confirmed by Team 03." |
| **"Add question" button not built** | There's no create flow. It would be the screen's one primary button and would do nothing |
| **Row checkboxes not built** | No bulk actions are defined |
| **Row chevrons (›) and the "Guidance connections" link not built** | The detail and connection screens are deferred (map step 5, D9 and D10) |
| **Type icons not built** | No approved icon set (D6) |
| Details panel below the list under 1280 px | D14 |
| Table header style, the panel's 16 px corners and our 64 px margins | Approved tokens and the shared table, unchanged; A2 uses smaller values. A2 also has an outer panel behind the toolbar and list, which isn't built |
| Status color mapping and all state wording | No approved mapping yet; Empty and Loading are provisional on the board |
| Search label shown above the field | The board requires visible labels; the compact-search question is still open |
| A2's decorative artwork and sidebar items (Care Areas, Resources, People) | Not approved assets; the confirmed sidebar is kept |

## 4. Files

| File | Change |
| --- | --- |
| `shared/content/quiz-content.ts` | New: screen wording and the A2 sample rows |
| `admin-web/app/_quiz/QuizContentView.tsx` | New: toolbar, list, selection, details and states |
| `admin-web/app/_quiz/QuizStateFromUrl.tsx` | New: `?state=` preview |
| `admin-web/app/_quiz/quiz.module.css` | New. Tokens only |
| `admin-web/app/content/quiz-content/page.tsx` | Uses the new view in place of the structure-only note |
| `admin-web/app/_screens/ScreenPage.tsx` | Optional `eyebrow` override. Other screens unchanged |

**Unchanged:** routes, links, navigation, tokens, assets, dependencies and the other content screens.

## 5. Test results

| Check | Result |
| --- | --- |
| TypeScript, production build, GitHub Pages build | All passed |
| Full browser suite | **352 loads, 0 problems** (2 builds × 22 pages × 4 widths × light and dark) |
| Quiz Content tests | **0 failures.** In both builds, at 1440, 834, 390 and 320 px, in light and dark: <ul><li>5 rows, the first selected, its details, and the count.</li><li>Choosing another row updates the details and highlight.</li><li>Search ("scale") shows 1 row; Status = Draft shows 2.</li><li>A search with no matches shows the no-results panel; Clear restores 5 rows and returns focus to the search field.</li><li>Headers, caption and eyebrow; no structure-only note; the Related link.</li><li>No em dashes, no left-out care areas, no overflow, no console errors.</li></ul> |
| Preview states | Loading, empty and error in both builds and both themes: the right message, symbol and role; the toolbar disabled; Go to Content links to `/content/` |
| Keyboard | Order: top bar, sidebar, Search, Status, the table, then each question. Enter selects; a visible ring on every stop |
| No JavaScript | At 1440 and 320 px: 5 rows and the first details shown, the toolbar hidden, no overflow |
| Theme tests | 0 failures |
| Responsive audit | 12 widths from 1440 to 320 px, both builds: no sideways scrolling, nothing spilling out of its box, no target under 44 px |
| Contrast | Every Quiz Content text at least 4.8:1 in light and 7.3:1 in dark |
| Hydration | No warnings for the ready, loading, empty and error states in each theme setting |

## 6. Screenshots

In `docs/Week-10/evidence/`:

| File | What it shows |
| --- | --- |
| `quiz-content-compare-a2-1440-light.png`, `quiz-content-compare-a2-1440-dark.png` | A2 beside this screen |
| `quiz-content-aligned-{1440,834,390}-{light,dark}.png` | This screen, full page |
| `quiz-content-no-results-desktop.png`, `quiz-content-no-results-mobile.png` | No results |
| `quiz-content-loading-1440-light.png`, `quiz-content-empty-1440-light.png`, `quiz-content-error-1440-dark.png` | Preview states |
| `quiz-content-keyboard-dark.png` | A question selected from the keyboard |
