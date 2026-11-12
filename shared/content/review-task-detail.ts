/*
 * Review Task Detail (Week 11, Close the Loop, feature 1): screen wording and paths.
 *
 * There's no hi-fi reference for this screen, so the layout and all wording here
 * are PROVISIONAL until Team 03 reviews them. It follows the Week 10 Review Tasks
 * details panel and the approved roles policy (admin-roles.ts).
 *
 * One static page is built for each seeded task: /review-tasks/seed-1/ to seed-5/.
 */

import { adminScreens } from './admin-web-screens';
import type { ReviewStatus } from './dashboard-review-queue';
import { reviewTasksSeed } from './review-tasks';

const trimSlash = (path: string) => path.replace(/\/+$/, '') || '/';

// Path from the site root, with the trailing slash the static export uses
export const reviewTaskPath = (taskId: string) => `${adminScreens['review-tasks'].path}${taskId}/`;

// Phase A2, Supabase mode: one static page reads the task ID from the address
// (/review-tasks/task/?id=…), because a static site can't build a page per database task
export const liveReviewTaskRoute = `${adminScreens['review-tasks'].path}task/`;
export const liveReviewTaskPath = (taskId: string) => `${liveReviewTaskRoute}?id=${encodeURIComponent(taskId)}`;

// The seeded task a path points at, if any (used for the breadcrumb)
export function reviewTaskFromPath(pathname: string) {
  const current = trimSlash(pathname);
  return reviewTasksSeed.find((task) => trimSlash(reviewTaskPath(task.id)) === current);
}

export const reviewTaskDetailCopy = {
  eyebrow: 'Review task',
  // Page title when the task can't be shown
  fallbackTitle: 'Review task',
  description: 'Review this task, then approve it or request changes. Reviewers cannot publish content.',
  pageTitle: (item: string) => `${item} · Review Tasks · Cuidance Admin Web`,
  sampleDataNote:
    'Sample data. Decisions are kept in this browser tab only, and these screens are not part of participant testing.',

  summary: {
    heading: 'Task summary',
    priority: (priority: string) => `${priority} priority`,
    type: 'Type',
    assignedTo: 'Assigned to',
    updated: 'Updated',
    taskContext: 'Task context',
    relatedContent: 'Related content',
    checklist: 'Review checklist',
    pending: 'To be confirmed by Team 03.',
  },

  history: {
    heading: 'Decision history',
    empty: 'No decisions recorded in this browser tab yet.',
    entry: (decision: string, by: string, at: string) => `${decision} by ${by}, ${at}`,
    noNote: 'No note added.',
  },

  decision: {
    heading: 'Review decision',
    reviewingAs: (reviewer: string) => `Reviewing as ${reviewer}. This is a placeholder until sign-in is connected.`,
    // From the approved roles policy (admin-roles.ts)
    policy: 'Reviewers approve items or request changes. Only an Admin or Main Admin / Owner publishes approved content.',
    legend: 'Decision',
    approve: 'Approve',
    requestChanges: 'Request changes',
    noteLabel: 'Reviewer note',
    noteHelperApprove: 'Optional when you approve.',
    noteHelperChanges: 'Required. Tell the editor what to change.',
    noteHelperNone: 'Required when you request changes. Optional when you approve.',
    submit: 'Submit decision',
    errors: {
      decision: 'Choose Approve or Request changes.',
      note: 'Add a note so the editor knows what to change.',
      save: "Couldn't save your decision. Try again.",
    },
    saving: 'Saving your decision…',
    noScript: 'Turn on JavaScript to record a decision.',
  },

  // Decision names as shown in history and success messages
  decisionNames: { approved: 'Approved', 'changes-requested': 'Changes requested' },

  recorded: {
    heading: 'Decision recorded.',
    status: (status: ReviewStatus) => `Status: ${status}`,
    note: 'Reviewer note',
    goToDashboard: 'Go to Dashboard',
    reset: 'Reset sample data',
    resetHelp: 'Clears every decision made in this browser tab and returns to the sample data.',
  },

  // PROVISIONAL state messages: the board marks Empty and Loading as provisional
  states: {
    loading: 'Loading this task…',
    empty: "This task isn't available.",
    emptyAction: 'Go to Review Tasks',
    error: "Couldn't load this task. Check your connection, then reload the page.",
  },

  openTask: 'Open task',
};

// Dashboard message shown once after a decision (approved by Team 03, Nov 6, 2026)
export const decisionNoticeCopy = {
  message: (item: string, status: ReviewStatus) => `Decision recorded for “${item}”. Status: ${status}.`,
  action: 'View task',
  dismiss: 'Dismiss',
};
