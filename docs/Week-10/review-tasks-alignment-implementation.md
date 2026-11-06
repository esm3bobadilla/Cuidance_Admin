# Prototype alignment, Batch 1: Review Tasks

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/review-tasks/` (unchanged)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Visual source:** the approved Week 9 Review Tasks hi-fi screenshot (attached Nov 6, 2026). It replaces the earlier structure-only build (`review-tasks-screen-implementation.md`).

## 1. What changed

1. **Header:** the eyebrow is "Internal tool", as in the hi-fi. The title and scope note are unchanged.
2. **Search:** "Search tasks", with a visible label and the hi-fi's placeholder, "Search tasks, content, or assignee…". It matches the item, type, status, priority and reviewer.
3. **Table:**
   - The existing table is unchanged: same caption, columns, five sample rows and status labels.
   - It's now selectable, with the approved Compass Blue row treatment; the item text selects the row.
   - It uses the compact cell padding.
   - A live count follows it.
4. **Task panel** (the hi-fi's right panel), beside the table from 1280 px and below it on smaller screens:
   - The "TASK" label, the task as the heading, its status label and "… priority".
   - Type, Assigned to and Updated.
   - **Task context**, **Related content** and **Review checklist**.
   - The checklist comes from the hi-fi and shows for "Review ingredient benefit wording", the task the hi-fi shows it for. It's read-only: □ is the approved Default symbol, and nothing is ticked or saved.
5. **States:**
   - Loading, empty and error are unchanged (`?state=`).
   - **No results** is new: ◌ "No tasks match your search." plus **Clear search**, which returns focus to the search field.
   - Without JavaScript, all tasks show and the search is hidden.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| **Sample data stays the five Dashboard items** | Existing approved sample data, so the Dashboard and Review Tasks can't drift apart. The hi-fi's 8 rows, statuses ("Not started", "In progress", "Blocked", "Complete") and assignee names aren't used |
| **Task context and Related content: "To be confirmed by Team 03."** | The hi-fi's context and related article are about ashwagandha "for everyday stress support". That's outside Cuidance's beauty and personal-care scope and close to wellness claims |
| **Tabs not built** (All tasks, Assigned to me, Due soon, Completed) | "Assigned to me" needs sign-in, "Due soon" needs due dates the sample data doesn't have, and none of the sample tasks is completed |
| **Not built:** Due date column, task ID, row checkboxes, the close (×) button, the reviewer note box, "Mark as in progress", the "…" menu, "Open in content editor" | No due dates in the sample data; no defined task workflow, editor or bulk actions |
| **At 1280 to 1439 px the table scrolls up to 31 px inside its panel** | Same behavior as Product Information. It fits from 1440 px |
| Hi-fi icons, artwork and sidebar items | Not approved (D6, D16); the confirmed sidebar is kept |

## 3. Files

- **New:** `admin-web/app/_reviewTasks/reviewTasks.module.css`.
- **Updated:**
  - `admin-web/app/_reviewTasks/ReviewTasksContent.tsx` (now the search, table and task panel view)
  - `admin-web/app/review-tasks/page.tsx` (eyebrow)
  - `shared/content/review-tasks.ts` (new wording and the checklist)
- The Dashboard and its sample data are unchanged.

## 4. Tests

| Check | Result |
| --- | --- |
| Review Tasks tests (both builds × 1440, 834, 390, 320 px × light and dark) | **0 failures.** <ul><li>5 rows, the first selected.</li><li>The Review ingredient task shows the four checklist items, Needs changes and Reviewer B.</li><li>Search "reviewer b" shows 2.</li><li>No results, then Clear returns focus to the search field.</li><li>No ashwagandha, stress, task ID, due date or "Mark as in progress".</li><li>No em dashes, no overflow, no console errors.</li></ul> |
| States | Loading, empty and error in both builds and both themes |
| Keyboard | Search, then the table, then each task; Enter selects; visible rings |
| No JavaScript | 5 rows at 1440 and 320 px, the search hidden, no overflow |
| Contrast | At least 5.4:1 in light and 7.5:1 in dark |
| Hydration | No warnings |
| Batch 1 suite | See `prototype-alignment-map.md` (Batch 1) |

## 5. Screenshots

In `docs/Week-10/evidence/`:
- **Hi-fi beside this build:** `review-tasks-compare-hifi-1440-{light,dark}.png`
- **Full screen:** `review-tasks-aligned-{1440,834,390}-{light,dark}.png`
- **Checklist:** `review-tasks-checklist-1440-light.png`
- **No results:** `review-tasks-no-results-{desktop,tablet,mobile,small}.png`
- **States:** `review-tasks-aligned-{loading,empty}-1440-light.png` and `review-tasks-aligned-error-1440-dark.png`
- **Keyboard:** `review-tasks-keyboard-dark.png`
