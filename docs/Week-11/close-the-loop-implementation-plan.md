# Week 11: Close the Loop, implementation plan

- **Branch:** `feat/week-11-review-task-loop`, from `main` at `be2042f` (PR #12 merged)
- **Date:** Nov 6, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme before any implementation starts.** Items marked **PROVISIONAL** or **DECISION** need a Team 03 answer.
- **Status:** plan **approved by Team 03 (Nov 6, 2026)**. **Feature 1 (Review Task Detail and the decision loop) is built** on this branch, waiting for its pull request and review. See `docs/Week-11/review-task-loop-implementation.md`. Feature 1 is **merged** (PR #13, Nov 10, 2026, deployed as `03af20a`). **Feature 2 (Accept Invitation and Account Setup, combined by Team 03) is built** on `feat/week-11-account-setup`; see `docs/Week-11/account-setup-implementation.md`.
- **Related:** `ARCHITECTURE.md` (how Admin Web is put together), `docs/Week-10/route-map.md` (current routes), `docs/Week-10/prototype-alignment-map.md` (Week 10 visual decisions).

## 0. Ground rules for Week 11

1. **Seeded local data only.** No Supabase, no database tables, no backend.
2. **No sign-in enforcement.** Screens can show what an invitation or account looks like, but nothing checks who you are.
3. **No invented permissions.** We use the approved four-role policy in `shared/content/admin-roles.ts` as **wording only**. Nothing is blocked or allowed because of a role.
4. **Week 10 visuals stay as they are.** Existing screens keep their layout, tokens and wording. Where a Week 11 feature has to touch an existing screen, the change is limited to **reading the shared review state** or **adding a link**. Each change is listed in section 4 and in the feature's pull request.
5. **One feature per branch, reviewed before merge** (professor's requirement). Each branch gets its own pull request into `main`, a teammate review, and only then a merge.
6. **`ARCHITECTURE.md` is kept up to date.** Once three or more new screens exist (planned: Review Task Detail, Accept Invitation, Account Setup), it is updated in the same pull request that adds each one.
7. CLAUDE.md content rules still apply: "may fit", no banned words, no em dashes in app copy, Partner content always labeled, no medical-review workflow, placeholder names only.

## 1. The loop

```
1. Accept invitation
        ↓
2. Account setup
        ↓
3. Review assigned task
        ↓
4. Approve or request changes
        ↓
5. Dashboard updates
        ↓
6. Review task detail (shows the recorded decision)
```

In plain words: a new team member accepts an invitation, sets up their account, finds a task assigned to them, makes a review decision, sees the Dashboard reflect it, and can open the task again to see what was decided.

**The person in the loop (PROVISIONAL):** a Reviewer. The approved policy says a Reviewer "reviews assigned content, adds notes, and approves items or requests changes. Cannot publish." So the loop ends at **approved**, not **published**. Publishing stays with Admin and Main Admin / Owner and is not in this loop.

## 2. Routes for each step

| Step | Screen | Route | Exists? | Notes |
| --- | --- | --- | --- | --- |
| 1 | Accept Invitation | `/accept-invitation/` | **Built (feature 2)** | One sample invitation (plus an expired one). Setup shell, no sidebar (W11-2 / A8) |
| 2 | Account Setup | `/account-setup/` | **Built (feature 2)** | Full name, work email, password and confirm password (never saved), password requirements, workspace and role summary. Nothing is saved to a server |
| 3 | Review Tasks (list) | `/review-tasks/` | **Reuse** (Week 10) | The assigned task is found here. Gains an "Open task" link to the detail page |
| 4 | Review Task Detail, decision panel | `/review-tasks/[taskId]/` | **New** | Approve, or Request changes with a required note |
| 5 | Dashboard | `/` | **Reuse** (Week 10) | Reads the shared review state, so the Review Queue counts and Needs attention table reflect the decision |
| 6 | Review Task Detail | `/review-tasks/[taskId]/` | **New** (same as step 4) | After a decision: the new status, the note, who and when (placeholders) |

**Detail route, how it works with GitHub Pages:** the site is a static export, so each detail page has to be built ahead of time. For the seeded data that's easy: one page per seeded task (`/review-tasks/seed-1/` to `/review-tasks/seed-5/`), created from the seed list with `generateStaticParams`. This also keeps the page readable without JavaScript, which Week 10 tested for. When live data arrives, task IDs won't be known at build time, so the route needs revisiting then (see W11-Q7).

**Breadcrumbs (PROVISIONAL):** Admin / Review Tasks / *task title*. Accept Invitation and Account Setup have no breadcrumb.

### Existing routes that are reused

| Route | Used for | Change needed |
| --- | --- | --- |
| `/` Dashboard | Step 5 | Read counts and rows from the shared review state instead of the fixed seed values. Optional: a link from each Needs attention item to its detail page |
| `/review-tasks/` Review Tasks | Step 3 | Read statuses from the shared review state. Add an "Open task" link in the selected-task panel |
| `/settings/` Settings / Team Access | Context only | No change in the first feature. Later: the accepted invitation could change "Invitation pending" to "Active" (deferred, see section 9) |

All other Week 10 routes are not part of the loop and are not touched.

### New routes still needed

| Route | Screen | Planned branch |
| --- | --- | --- |
| `/review-tasks/[taskId]/` | Review Task Detail (with the decision panel) | `feat/week-11-review-task-loop` (this branch) |
| `/accept-invitation/` | Accept Invitation | `feat/week-11-account-setup` (built) |
| `/account-setup/` | Account Setup | `feat/week-11-account-setup` (built) |

## 3. Screen ownership and state ownership

### Screen ownership

"Owns" means: this screen is the only place that changes that thing. Other screens can only read it.

| Screen | Owns (can change) | Reads only |
| --- | --- | --- |
| Accept Invitation | The invitation's accepted flag (seeded, this browser tab only) | The seeded invitation |
| Account Setup | Full name, work email and the account-created flag (this tab only). The password is checked on screen and never saved | The accepted invitation (workspace, role, invited email) |
| Review Tasks | Search text and selected row (as today, on the screen only) | The shared review state |
| **Review Task Detail** | **Review decisions** (the only screen that records Approve or Request changes) | The shared review state, the seeded checklist |
| Dashboard | Nothing new | The shared review state (counts and Needs attention rows) |

### State ownership

| State | Where it's defined | Where it lives while you use the site | Lasts until |
| --- | --- | --- | --- |
| Seeded review tasks | `shared/content/dashboard-review-queue.ts` (unchanged Week 10 data) | Built into the pages | Always the same |
| Review decisions (who decided what, when, with which note) | Types and rules: new `shared/review-loop/`. Store: new `admin-web/app/_reviewLoop/reviewStore.ts` | Browser **session storage**, one small list of decisions | The browser tab closes, or **Reset sample data** is used |
| Current task status, Dashboard counts, Needs attention rows | **Not stored.** Worked out each time from seed + decisions by one shared function | Calculated on each screen | (calculated) |
| Invitation accepted, account setup | Types: new `shared/content/invitation.ts`, `account-setup.ts`. Store: new `admin-web/app/_onboarding/onboardingStore.ts` | Browser session storage | The tab closes, or Reset |
| Screen-only state (search, selected row, open menus, form typing) | Each screen | Memory | You leave the page |
| Theme | Unchanged Week 10 `themeStore` | Local storage | Unchanged |

**Why session storage:** Admin Web uses plain links, so moving between screens reloads the page and memory is lost. Session storage keeps the decision across the loop in one tab, and clears itself when the tab closes, so every demo starts from the same seed. Nothing leaves the browser.

**Why statuses are calculated, not stored:** if the Dashboard and Review Tasks each kept their own copy, they could disagree. One function (`applyDecisions(seed, decisions)`) gives every screen the same answer.

**First paint:** pages are built with the seed only. After the page loads, the store adds this tab's decisions (the same pattern as the Week 10 theme store). Without JavaScript, every screen shows the plain seed, as today.

## 4. Changes to Week 10 screens (kept to a minimum)

| Screen | Change | Visual change? |
| --- | --- | --- |
| Dashboard | Counts and rows come from `applyDecisions(...)` instead of fixed values. An approved item leaves Needs attention | Only the data. Layout, tokens and wording unchanged |
| Dashboard | **W11-4, approved and built:** a temporary "Decision recorded" message after a decision, with View task and Dismiss | Yes, one new message, shown once |
| Dashboard | **W11-5, approved and built:** item titles in Needs attention link to their detail page | Underlined titles, 44 px tall |
| Review Tasks | Statuses come from `applyDecisions(...)` | Only the data |
| Review Tasks | An "Open task" link in the selected-task panel, and the panel title links to the task (built). Row titles still select the row | One secondary link; a one-line panel title grows to 44 px |
| Shared status label (`_review/ReviewShared.tsx`) | A new **Approved** status: success colors plus ✓, the same treatment Week 10 already uses for approved items on other screens | New status only; existing statuses unchanged |

**Dashboard counts today are fixed numbers** (3, 1, 1, 0). They happen to match the seed: 3 open items of type Guidance, Quiz or Sources; 1 Claims & safety; 1 Partner. The plan replaces the fixed numbers with that same calculation, so on first load the Dashboard looks exactly as it does now. **DECISION W11-3** asks Team 03 to confirm this mapping.

## 5. State transition: review action to Dashboard update

### Statuses

Week 10 statuses: In review, Needs changes, Pending disclosure, Needs review. Week 11 adds **Approved** (PROVISIONAL wording).

| From | Action | To | Note required? |
| --- | --- | --- | --- |
| In review, Needs review, Pending disclosure, Needs changes | **Approve** | Approved | No (optional) |
| In review, Needs review, Pending disclosure, Needs changes | **Request changes** | Needs changes | **Yes** |
| Approved | (none) | Approved | Decision panel shows the decision instead of the buttons |

No "undo" in v1. **Reset sample data** clears every decision in the tab (DECISION W11-6 on where it lives).

### Step by step

1. On `/review-tasks/seed-5/` (Validate source support for claim, Needs review, assigned to Reviewer B) the reviewer chooses **Request changes**, types a note and selects **Submit decision**.
2. The detail screen checks the note isn't empty. If it is: Dark Ruby ⚠ "Add a note so the editor knows what to change." and focus moves to the note.
3. The store adds one decision: `{ taskId: 'seed-5', decision: 'changes-requested', note, decidedBy: 'Reviewer B', decidedAt }`, and saves the list to session storage.
4. Every screen open in the tab is told about the change and recalculates with `applyDecisions(seed, decisions)`:
   - the task's status becomes the decision's status;
   - its "Updated" date becomes the decision date;
   - its history gains one entry.
5. The detail screen shows the success state (✓ "Decision recorded."), the new status, and a **Go to Dashboard** link.
6. **Dashboard** (on its next load reads the same storage):
   - **Approved:** the item leaves Needs attention, and its Review Queue count drops by 1 (for example "Content for review" 3 → 2).
   - **Needs changes:** the item stays, with the Needs changes label and the new date; counts stay the same.
   - If every item is approved, Needs attention shows its existing Empty state ("Nothing needs attention right now.").
7. **Review Task Detail** opened again shows the recorded decision, the note, and "Reviewer B, Nov 6, 2026" in its history.

### Rules as a function

```
applyDecisions(seedTasks, decisions) → tasks with current status, updated date and history
dashboardSummary(tasks)              → the four Review Queue counts
needsAttention(tasks)                → every task whose status is not Approved
```

These live in `shared/review-loop/` (CLAUDE.md: rules are defined in `shared/`), have no React in them, and get their own tests.

## 6. Loading, empty, error and success states

Week 10 already uses `?state=loading`, `?state=empty` and `?state=error` as a review aid. Week 11 screens follow the same pattern and add `?state=success` where a success state exists. All wording is **PROVISIONAL** (the board marks Empty and Loading as provisional).

| Feature | Loading | Empty | Error | Success |
| --- | --- | --- | --- | --- |
| **Accept Invitation** | ⋯ "Checking your invitation…" | ◌ "No invitation found. Ask an Admin to send a new one." | Dark Ruby ⚠ "Couldn't load this invitation. Check your connection, then reload the page." Also: **expired** ⚠ "This invitation has expired. Ask an Admin to send a new one." | ✓ "Invitation accepted." plus **Continue to account setup** |
| **Account Setup** | ⋯ "Loading your account details…" | (none: you only arrive here with an accepted invitation; without one it shows "Accept your invitation first." plus a link) | Field errors: Dark Ruby ⚠ beside the field ("Enter a display name.", "Confirm you've read the content and safety rules."). Load error: ⚠ "Couldn't load your account details…" | ✓ "Your account is set up." plus **Go to Review Tasks** |
| **Review Tasks** (reuse) | Unchanged Week 10 | Unchanged Week 10 | Unchanged Week 10 | (none) |
| **Review Task Detail** | ⋯ "Loading this task…" | **Unavailable:** ◌ "This task isn't available." plus **Go to Review Tasks** (`?state=unavailable`). An unbuilt task address shows the site's Page not found | ⚠ "Couldn't load this task. Check your connection, then reload the page." | (see decision panel) |
| **Decision panel** (inside detail) | ⋯ "Saving your decision…" (buttons disabled; brief, so it's visible in seeded mode only with `?state=saving`) | (none) | Note missing: ⚠ "Add a note so the editor knows what to change." Save failed: ⚠ "Couldn't save your decision. Try again." | ✓ "Decision recorded." plus the new status and **Go to Dashboard** |
| **Dashboard** (reuse) | Unchanged Week 10 | Unchanged Week 10 ("Nothing needs attention right now.") and now reachable for real by approving every item | Unchanged Week 10 | ✓ "Decision recorded for “*task*”. Status: *status*." with View task and Dismiss, once after a decision (built) |

Every state uses text or a symbol as well as color. Errors are Dark Ruby with ⚠ and a message. Messages use `role="status"` (loading, success) or `role="alert"` (errors), as in Week 10. One primary button per screen: **Accept invitation**, **Finish setup**, **Submit decision**.

## 7. Temporary seeded-data behavior

1. **Tasks:** the five Week 10 seed tasks, unchanged. IDs `seed-1` to `seed-5`.
2. **The reviewer persona (PROVISIONAL):** "Reviewer B", because seed-2 and seed-5 are already assigned to Reviewer B. "Assigned to me" means "assigned to Reviewer B" while sign-in doesn't exist.
3. **Invitation (as built, decisions A1 to A5):** one sample invitation for **Reviewer B**, role **Reviewer**, workspace "Cuidance Content Team", invited by "Team member A (Main Admin / Owner)", email `reviewer.b@example.com` (a reserved sample domain), expiring Nov 24, 2026. No real link token. A second sample invitation is expired (Nov 3, 2026) so that state can be reviewed (`?invite=expired`).
4. **Account setup (as built, A6 and A7, superseding the earlier acknowledgement-checkbox idea):** full name, work email (prefilled, must match the invitation), password (12+ characters, a letter and a number) and confirm password. The password is never saved or sent. No photo.
5. **Decisions:** saved in this browser tab only. Closing the tab, or **Reset sample data**, returns to the seed.
6. **Dates:** the decision date is today's date in the browser, formatted like the seed ("Nov 6, 2026").
7. **Sample-data note:** every new screen shows the same note as Week 10: "Sample data. Nothing here is connected to live content, and these screens are not part of participant testing."
8. **Nothing is sent anywhere.** No emails, no notifications, no network calls.

## 8. What needs authentication or Supabase later (intentionally deferred)

| Behavior | Seeded v1 | Needs later |
| --- | --- | --- |
| Invitation link and token | One fixed seeded invitation | **Supabase Auth** invite links, tokens, expiry checked by the server |
| Sending an invitation | Not built | Supabase Auth (Admin / Owner action), email delivery |
| Account creation, password or magic link | Display name only, in the tab | **Supabase Auth** sign-up and sign-in |
| "Who am I" (current user, profile menu name) | Fixed persona "Reviewer B" | Supabase Auth session |
| Role checks (Reviewer can approve, cannot publish) | Wording only, nothing enforced | Supabase roles and **row-level security**, plus checks in the app |
| Saving decisions | Session storage in one tab | **Supabase table** (for example `review_decisions`), shared by the team |
| Task list and assignment | Five seeded tasks, fixed assignees | Supabase tables, real assignment |
| Dashboard counts | Calculated in the browser from seed + decisions | Calculated from Supabase data (query or view) |
| History, audit trail | Decisions in this tab only | Supabase table, kept permanently |
| Team Access "Invitation pending" → "Active" | Not changed | Supabase Auth plus the members table |
| Detail pages for new tasks | Pre-built for seed IDs | A route that works for IDs not known at build time (W11-Q7) |
| Real-time updates between people | None | Supabase realtime or reload (v1.1 or later) |

Until Team 03 starts the Supabase step, none of these are built, and CLAUDE.md's "Not yet" rule stays in force.

## 9. Open questions and deferred v1.1 items

### Decisions for Team 03

**Answered by Team 03 (Nov 6, 2026):** W11-1 (yes, a Reviewer; cannot publish), W11-3 (counts calculated from shared state, starting at 3 / 1 / 1 / 0), W11-4 (Dashboard message, built), W11-5 (title links on Review Tasks and Dashboard, built), W11-8 (fixed placeholder "Reviewer B"). Also decided: Request changes needs a note, Approve has an optional note, decisions are kept in the browser session only, one static page per seeded task. W11-6 was built as proposed (Reset under the recorded decision). **Still open:** W11-7 (built as "Approved" for now), W11-9, W11-Q7. **W11-2 answered Nov 10, 2026** (decision A8: logo and Theme menu only, no sidebar). Feature 2 decisions A1 to A14 are recorded in `account-setup-implementation.md`.

| ID | Question | Proposal |
| --- | --- | --- |
| **W11-1** | Is a **Reviewer** the right person for this loop? | Yes. The approved policy gives Reviewers Approve and Request changes, and no publishing |
| **W11-2** | Should Accept Invitation and Account Setup show the sidebar and top bar? A new member isn't set up yet | Show the top bar logo and Theme menu only, no sidebar, via a small option in `AdminShell` for these two routes. No change to other screens |
| **W11-3** | Confirm the Dashboard count mapping: Content for review = Guidance, Quiz and Sources; Safety checks = Claims & safety; Partner content = Partner; Open questions = items marked open question | Yes (it matches today's numbers exactly) |
| **W11-4** | Show a success note on the Dashboard after a decision? | Yes, one line with a View task link. Needs approval because it adds to the Week 10 layout |
| **W11-5** | Link item titles in the Dashboard's Needs attention table to their detail pages? | Yes. Otherwise step 6 is only reachable through Review Tasks |
| **W11-6** | Where does **Reset sample data** live? | On the Review Task Detail page under the decision panel, as a ghost button, only while a decision exists |
| **W11-7** | Status wording: "Approved" or "Approved with notes" (used on Claims & Safety and Guidance Rules)? | "Approved", and "Approved with notes" when a note was added |
| **W11-8** | Placeholder people: Team Access uses "Team member A–G", review tasks use "Reviewer A–C". Which does the loop persona use? | "Reviewer B" for now, so it lines up with assigned tasks. Unify when Supabase arrives |
| **W11-9** | Does approving a Partner content item need an extra disclosure check (seed-4, "Pending disclosure")? | Show the existing checklist; no extra step in v1 |
| **W11-Q7** | Detail route for live data: keep `/review-tasks/[taskId]/` (needs a non-static host or a fallback) or switch to `/review-tasks/task/?id=` | Keep the clean route for v1; decide with the Supabase and hosting step |

### Deferred to v1.1

1. Publishing approved content (Admin and Main Admin / Owner).
2. Editor's side of the loop: seeing "Needs changes", editing, and resubmitting.
3. Reassigning tasks, due dates, task tabs.
4. Undo or change a decision.
5. Comments thread on a task (more than one note).
6. Notifications and emails.
7. Team Access updating after an invitation is accepted.
8. Sending invitations from Settings / Team Access.
9. Profile menu showing the account-setup display name.
10. Decisions shared between people and devices (Supabase).

## 10. Feature branches and order

Each feature: its own branch from the latest `main`, its own pull request, teammate review, then merge. No feature starts until the one before it is merged, unless Team 03 says otherwise.

| Order | Branch | Feature | Loop steps | New screens |
| --- | --- | --- | --- | --- |
| **1** | `feat/week-11-review-task-loop` | **Review Task Detail and the review decision**, with the shared review state read by Review Tasks and the Dashboard. **Built, awaiting pull request and review** | 3, 4, 5, 6 | 1 |
| 2 | `feat/week-11-account-setup` | **Accept Invitation and Account Setup, ending with Go to Review Tasks** (combined into one feature by Team 03, decision A14). **Built, awaiting pull request and review** | 1, 2 | 2 |

After feature 3 there are three new screens, so `ARCHITECTURE.md` is updated again (it is also updated in each feature's own pull request).

**Why the review loop first:** it reuses the Week 10 data and screens, and it proves the hardest part, the state change from a decision to the Dashboard. The invitation and account screens are mostly static forms whose real behavior needs sign-in anyway.

### Feature 1 scope (built Nov 6, 2026; see `review-task-loop-implementation.md`)

1. `shared/review-loop/`: decision types, the Approved status, `applyDecisions`, `dashboardSummary`, `needsAttention`.
2. `admin-web/app/_reviewLoop/reviewStore.ts`: session-storage store, the same pattern as the theme store.
3. `/review-tasks/[taskId]/`: task summary, checklist, decision panel, history, all states in section 6.
4. Review Tasks and Dashboard read the shared state; Review Tasks gets "Open task".
5. Tests: the rules on their own; the full loop in the browser (decide, go to the Dashboard, see the update, open the detail again); both builds; 1440, 834, 390, 320 px; light and dark; keyboard; no JavaScript; hydration; Week 10 suites still 0 failures.
6. Implementation note `docs/Week-11/review-task-loop-implementation.md`, evidence screenshots, and an `ARCHITECTURE.md` update.

## 11. Definition of done for each feature

- TypeScript, production build and GitHub Pages build pass.
- The full Week 10 browser suite still passes with 0 problems (proves Week 10 is unchanged).
- The feature's own tests pass in both builds, at 1440, 834, 390 and 320 px, light and dark.
- Every state in section 6 can be previewed.
- Keyboard, focus ring, 44 px targets, contrast and no-JavaScript checks pass.
- No new dependencies, no Supabase, no sign-in, no token or logo changes.
- `ARCHITECTURE.md` and the implementation note are updated.
- A pull request using the repo template, reviewed by a teammate before merge.
