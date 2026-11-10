# Week 11, Feature 1: Review Task Detail and the decision loop

- **Branch:** `feat/week-11-review-task-loop`, from `main` at `be2042f`
- **Date:** Nov 6, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme** before the pull request merges. Items marked **PROVISIONAL** need a Team 03 decision.
- **Plan:** `docs/Week-11/close-the-loop-implementation-plan.md` (approved Nov 6, 2026).
- **Visual source:** none for the new screen (no hi-fi reference). It follows the Week 10 Review Tasks details panel, so its layout is **PROVISIONAL**.
- **Scope:** loop steps 3 to 6. Accept Invitation and Account Setup stay planned and are not built.

## 0. Team 03 decisions used (Nov 6, 2026)

1. A Reviewer can **Approve** or **Request changes**. A Reviewer **cannot publish**.
2. **Request changes needs a note.** Approve can have an **optional** note.
3. Decisions are kept in **this browser tab only** (session storage).
4. The reviewer is the fixed placeholder **"Reviewer B"** until sign-in exists.
5. Dashboard counts are **calculated from the shared review state** and still start at **3 / 1 / 1 / 0**.
6. **Approve** removes the task from Needs attention and lowers its Review Queue count.
7. **Request changes** keeps the task in Needs attention with the **Needs changes** status.
8. A temporary **"Decision recorded"** message shows on the Dashboard after a decision.
9. **Task titles link to the detail page** on Review Tasks and on the Dashboard.
10. **One static detail page per seeded task** (five pages).

## 1. What changed

### New: Review Task Detail (`/review-tasks/seed-1/` to `/review-tasks/seed-5/`)

1. **Header:** "Review task" eyebrow, the task title, and "Review this task, then approve it or request changes. Reviewers cannot publish content."
2. **Breadcrumb** in the shared top bar: Admin / Review Tasks / *task title*. In the sidebar, Review Tasks is shown as the section you're in (the same "parent of current" style Content uses), not as the current page.
3. **Sample-data note:** "Sample data. Decisions are kept in this browser tab only, and these screens are not part of participant testing."
4. **Task summary:** status, priority, Type, Assigned to, Updated, and Task context, Related content and Review checklist, as in the Week 10 Review Tasks panel ("To be confirmed by Team 03." where Week 10 had nothing).
5. **Decision history:** each decision made in this tab ("Changes requested by Reviewer B, Nov 6, 2026" and the note), or "No decisions recorded in this browser tab yet."
6. **Review decision panel:**
   - "Reviewing as Reviewer B. This is a placeholder until sign-in is connected."
   - The publishing rule from the approved roles policy: "Reviewers approve items or request changes. Only an Admin or Main Admin / Owner publishes approved content." There is **no Publish action**.
   - **Decision:** two options, Approve and Request changes. Neither is chosen at the start.
   - **Reviewer note:** its hint changes with the choice ("Optional when you approve." / "Required. Tell the editor what to change.").
   - **Submit decision**, the screen's one primary button.
   - From 1280 px the panel sits beside the summary; below that it sits under it.
7. **After a decision:** ✓ "Decision recorded.", the new status, who and when, the note, **Go to Dashboard**, and **Reset sample data** with "Clears every decision made in this browser tab and returns to the sample data." Focus moves to "Decision recorded." so screen readers read it.

### Changed Week 10 screens (data and links only)

| Screen | Change |
| --- | --- |
| **Dashboard** | Review Queue counts and Needs attention rows come from the seed plus this tab's decisions. With no decisions: 3 / 1 / 1 / 0 and five rows, exactly as before. Item titles are now links to their detail page (underlined, 44 px tall). If every task is approved, the existing Empty panel shows ("Nothing needs attention right now."). |
| **Dashboard** | New "Decision recorded" message above the Review Queue, once after a decision: ✓ "Decision recorded for “*task*”. Status: *status*." with **View task** and **Dismiss**. It's cleared after it shows, so a reload or a later visit doesn't show it again. Dismiss moves focus to the page content. |
| **Review Tasks** | Statuses and dates come from the shared state. In the selected-task panel, the title is now a link to the detail page, and an **Open task** button is added at the bottom. The row titles in the table still **select** the row, as in Week 10. |
| **Shared status label** | New **Approved** status: success colors plus ✓. The four Week 10 statuses are unchanged. |
| **Top bar** | Builds the breadcrumb for detail pages. Other breadcrumbs are unchanged. |

**One small visual change on Review Tasks:** the selected-task title is now at least 44 px tall so the link meets the target size. A one-line title grows from its 34 px line to 44 px; titles that wrap are unchanged.

**Why the Review Tasks row titles still select instead of linking:** in Week 10 the row title is the button that chooses which task the panel shows (with its keyboard and screen-reader behavior). Turning it into a link would remove that. So the task title link sits in the panel heading, next to **Open task**. Team 03 can ask for the row titles to link instead (see section 4).

## 2. How a decision moves through the screens

| Start status | Decision | New status | Note | Needs attention | Review Queue count |
| --- | --- | --- | --- | --- | --- |
| In review, Needs review, Pending disclosure or Needs changes | **Approve** | Approved | Optional | Removed | Its count drops by 1 |
| In review, Needs review, Pending disclosure or Needs changes | **Request changes** | Needs changes | **Required** | Stays | Unchanged |

**Which count drops when a task is approved:**

| Task | Type | Count that drops | After approving |
| --- | --- | --- | --- |
| seed-1 Understanding sensitive skin | Guidance content | Content for review | 2 / 1 / 1 / 0 |
| seed-2 Review ingredient benefit wording | Claims & safety | Safety checks | 3 / 0 / 1 / 0 |
| seed-3 Which care areas would you like guidance on? | Quiz content | Content for review | 2 / 1 / 1 / 0 |
| seed-4 Check partner disclosure is visible | Partner content | Partner content | 3 / 1 / 0 / 0 |
| seed-5 Validate source support for claim | Sources | Content for review | 2 / 1 / 1 / 0 |
| All five | | All | 0 / 0 / 0 / 0, Empty panel |

**Step by step:**
1. Review Task Detail checks the form: a decision must be chosen, and Request changes needs a note that isn't only spaces.
2. It saves the decision `{ task, decision, note, "Reviewer B", today's date }` to session storage. Only then do the screens change.
3. Every screen works out the task list with the same shared function (`applyDecisions`). The latest decision sets the status, and the decision date becomes "Updated".
4. The Dashboard reads the same storage on its next load, shows the message once, and recalculates the counts (`dashboardSummary`) and Needs attention (`needsAttention`).
5. Opening the task again shows the recorded decision and its history.
6. **Reset sample data** clears every decision in the tab: back to the seed and the form.
7. After a decision, a task shows its recorded decision instead of the form. To decide again, use Reset (no undo or re-decision in v1).

## 3. States

| State | What shows | How to preview |
| --- | --- | --- |
| Ready | Summary, history, decision form | Default, including without JavaScript (the form is hidden; "Turn on JavaScript to record a decision.") |
| Loading | ⋯ "Loading this task…" (`role="status"`) | `?state=loading` |
| Error | Dark Ruby ⚠ "Couldn't load this task. Check your connection, then reload the page." (`role="alert"`) | `?state=error` |
| **Unavailable** | ◌ "This task isn't available." plus **Go to Review Tasks** | `?state=unavailable`. A task address that wasn't built (for example `/review-tasks/seed-9/`) shows the site's "Page not found" |
| Needs a decision | Dark Ruby ⚠ "Choose Approve or Request changes." Focus moves to Approve | Submit with nothing chosen |
| **Note required** | Dark Ruby ⚠ "Add a note so the editor knows what to change." Focus moves to the note; the error clears when you type | Request changes with an empty note |
| Saving | ⋯ "Saving your decision…"; the form is disabled | `?state=saving` (saving is instant with session storage, so this is a preview only) |
| Save error | Dark Ruby ⚠ "Couldn't save your decision. Try again." (`role="alert"`); nothing changes | `?state=save-error`, or when the browser refuses to save (for example, storage turned off) |
| Success | ✓ "Decision recorded." with the status, who and when, the note, Go to Dashboard and Reset | `?state=success` (preview, nothing saved), or make a decision |

Previews never save anything. All state wording is **PROVISIONAL**.

## 4. PROVISIONAL items for Team 03

| Item | Why |
| --- | --- |
| **Detail screen layout** | No hi-fi reference. Built from the Week 10 Review Tasks panel |
| **All new wording**, including the Dashboard message and the reset help text | No approved copy yet |
| **Review Tasks row titles still select the row**; the link is in the panel title plus Open task | Keeps the Week 10 selection behavior. Team 03 can choose row-title links instead |
| **One decision per task per tab**; Reset is the only way to decide again | No re-decision or undo flow is defined (v1.1) |
| **"Approved"** status even when a note is added | W11-7 suggested "Approved with notes"; not confirmed, so the simpler label is used |
| **Reviewer B can decide on any task**, including those assigned to Reviewer A or C | No permissions are enforced (approved rule). The assignee is shown |
| **Decision date** is the browser's date | No server time yet |
| **Radio buttons** are a new control (round, 24 px, Compass Blue with a filled dot when chosen) | The board has a checkbox but no radio. Same size, stroke and colors as the checkbox |
| **Task context and Related content** still read "To be confirmed by Team 03." | No content for them yet |

## 5. Files

| File | Change |
| --- | --- |
| `shared/review-loop/review-decisions.ts` | **New.** Decision types, the Reviewer B placeholder, `applyDecisions`, `needsAttention`, `dashboardSummary`, `validateDecision`, date format, and a safe reader for saved data |
| `shared/content/review-task-detail.ts` | **New.** Detail screen wording, the Dashboard message wording, and detail paths |
| `shared/content/dashboard-review-queue.ts` | Adds the **Approved** status. Seed data unchanged |
| `admin-web/app/review-tasks/[taskId]/page.tsx` | **New.** The detail route: one static page per seeded task |
| `admin-web/app/_reviewLoop/reviewStore.ts` | **New.** Session-storage store (same pattern as the theme store) |
| `admin-web/app/_reviewLoop/ReviewTaskDetailView.tsx` | **New.** Summary, history, decision form, recorded decision, states |
| `admin-web/app/_reviewLoop/ReviewTaskDetailStateFromUrl.tsx` | **New.** `?state=` previews |
| `admin-web/app/_reviewLoop/DecisionNotice.tsx` | **New.** Dashboard "Decision recorded" message |
| `admin-web/app/_reviewLoop/reviewLoop.module.css` | **New.** Tokens only |
| `admin-web/app/_dashboard/DashboardContent.tsx` | Reads the shared state; shows the message; Empty panel when all approved |
| `admin-web/app/_reviewTasks/ReviewTasksContent.tsx`, `reviewTasks.module.css` | Reads the shared state; panel title link and Open task |
| `admin-web/app/_review/ReviewShared.tsx`, `review.module.css` | Approved status; Dashboard title links |
| `admin-web/components/layout/TopBar.tsx` | Breadcrumb for detail pages |

**Unchanged:** every other Week 10 screen, tokens, logo, routes in the route map, the deploy workflow, `package.json` and the lockfile. No new dependencies, no Supabase, no sign-in, no permission checks, nothing sent off the browser.

## 6. Test results

| Check | Result |
| --- | --- |
| TypeScript, production build, GitHub Pages build | All passed. Both builds list `/review-tasks/seed-1/` to `seed-5/` as static pages |
| **Full Week 10 browser suite** | **352 loads, 0 problems** (2 builds × 22 pages × 4 widths × light and dark), plus its sidebar, keyboard and no-JavaScript checks |
| Week 10 screen suites | Theme, Review Tasks and Settings, Quiz Content, Product Information, Claims & Safety Review, Content landing, Content Metrics, and the six list screens: **0 failures each** |
| **Shared rules** (no browser) | **0 failures.** Starts at 3 / 1 / 1 / 0, the same as the Week 10 fixed values and labels; approve and request changes for each of the five tasks (status, Needs attention, counts, date, history); approve all gives 0 / 0 / 0 / 0; the latest decision wins; validation; bad saved data is ignored |
| **Review Task Detail, all five tasks** | **80 loads, 0 failures** (2 builds × 5 tasks × 1440, 834, 390, 320 px × light and dark): title, page title, eyebrow, breadcrumb, sidebar, status, type, assignee, checklist (seed-2), empty history, form, one primary button, Reviewer B and the publishing rule, no Publish action, no em dashes or banned words, symbols hidden from screen readers, no sideways scrolling |
| **Preview states** | **96 loads, 0 failures:** loading, error, unavailable, saving, save error and success, each in both builds, 4 widths and both themes; none saves anything. An unbuilt task address returns 404 |
| **The full loop** | **16 runs, 0 failures** (both builds, 4 widths, light and dark): Dashboard titles link correctly; Review Tasks panel links follow the selected task; Open task lands on the detail page; "choose a decision" and "note required" errors (including a note of only spaces) with focus and `aria-invalid`; Request changes keeps the task with Needs changes and today's date and leaves the counts; the Dashboard message shows once; Review Tasks shows the new status; Approve without a note (Content for review 3 → 2) and with a note (Safety checks 1 → 0); Dismiss; reopening a task shows its decision; a new tab starts from the seed; Reset returns everything to 3 / 1 / 1 / 0; approving all five shows the Empty panel and 0 / 0 / 0 / 0; a refused save shows the save error and changes nothing; no console errors |
| Keyboard | Both builds, light and dark: Approve, Reviewer note, Submit decision in order, each with the focus ring; arrow keys choose an option; Enter with an empty note moves focus to the note; Enter submits; focus lands on "Decision recorded."; then Go to Dashboard and Reset sample data; Reset moves focus to "Review decision". Dashboard title links have the ring and are 44 px tall |
| No JavaScript | 1440 and 320 px, both builds: all five detail pages show the task and the message, with the form hidden; no sideways scrolling; the Dashboard's five title links work |
| Responsive audit | 12 widths from 1440 to 320 px, both builds, with and without saved decisions (Dashboard message, recorded panel): 38 addresses, no sideways scrolling, nothing spilling out of its box, no target under 44 px. Radio buttons count their 44 px row as the target, as checkboxes already did |
| Contrast | All enabled text at least 4.8:1 in light and 6.5:1 in dark; field and radio borders at least 4.5:1. In the Saving preview the disabled "Reviewer note" label is 3.6:1 (light) and 3.4:1 (dark), using the Week 10 disabled-ink style; disabled controls are exempt, as with the Previous button on Claims & Safety Review |
| Hydration | 104 dev-server loads (Dashboard, Review Tasks, five detail pages and six previews; 4 theme setups; with and without saved decisions): no warnings or errors |

## 7. Screenshots

In `docs/Week-11/evidence/`:

| File | What it shows |
| --- | --- |
| `review-task-detail-{1440-light,1440-dark,834-light,390-dark}.png` | The detail page with the decision form |
| `review-tasks-open-task-1440-light.png` | Review Tasks with the panel title link and Open task |
| `review-task-detail-note-required-1440-light.png` | Request changes without a note |
| `review-task-detail-changes-recorded-1440-light.png` | After Request changes |
| `dashboard-after-request-changes-1440-light.png` | Dashboard: message, task still listed as Needs changes, counts unchanged |
| `review-task-detail-approved-{1440-light,1440-dark,390-light}.png` | After Approve (with and without a note) |
| `dashboard-after-approve-{1440-light,1440-dark,390-light}.png` | Dashboard: message, task removed, Content for review 2 |
| `dashboard-all-approved-1440-light.png` | Every task approved: Empty panel and 0 counts |
| `review-task-detail-{saving,save-error}-1440-light.png`, `review-task-detail-{unavailable,error,loading}-1440-dark.png` | Preview states |
| `review-task-detail-keyboard-dark.png` | Request changes chosen with the arrow keys, with the focus ring |
