/*
 * Week 11, Close the Loop: review decision rules.
 *
 * The one place that decides what a Reviewer's decision does. No React and no
 * browser code here, so every screen gets the same answer:
 * - Review Task Detail records decisions (the only screen that can).
 * - Review Tasks, the Dashboard and Review Task Detail read the result.
 *
 * Statuses, counts and the Needs attention list are never stored. They are worked
 * out each time from the Week 10 seed tasks plus this browser tab's decisions.
 *
 * Approved by Team 03 (Nov 6, 2026):
 * - A Reviewer can Approve or Request changes. A Reviewer cannot publish.
 * - Request changes needs a reviewer note. Approve may have an optional note.
 * - Decisions are kept in the current browser session only.
 * - The reviewer is the fixed placeholder "Reviewer B" until sign-in exists.
 * Nothing here checks permissions: there is no sign-in.
 */

import {
  reviewQueueSummary,
  type ReviewItem,
  type ReviewStatus,
} from '../content/dashboard-review-queue';

export type ReviewDecisionKind = 'approved' | 'changes-requested';

export type ReviewDecision = {
  taskId: string;
  decision: ReviewDecisionKind;
  // Empty when an approval has no note
  note: string;
  decidedBy: string;
  // Shown as written, in the seed's date style ("Nov 6, 2026")
  decidedAt: string;
};

// The task as every screen shows it: the seed task with this tab's decisions applied
export type ReviewTask = ReviewItem & {
  // This tab's decisions for the task, oldest first
  history: ReviewDecision[];
};

// Shown on the Dashboard once after a decision, then cleared
export type ReviewNotice = {
  taskId: string;
  decision: ReviewDecisionKind;
};

// Fixed placeholder until sign-in exists (Team 03, Nov 6, 2026). Not a real person.
export const placeholderReviewer = 'Reviewer B';

export const statusAfter: Record<ReviewDecisionKind, ReviewStatus> = {
  approved: 'Approved',
  'changes-requested': 'Needs changes',
};

export const isOpen = (task: ReviewItem) => task.status !== 'Approved';

// Seed tasks plus decisions, in the order they were made. The latest decision sets the status.
export function applyDecisions(seed: ReviewItem[], decisions: ReviewDecision[]): ReviewTask[] {
  return seed.map((item) => {
    const history = decisions.filter((entry) => entry.taskId === item.id);
    const latest = history.at(-1);
    return latest
      ? { ...item, status: statusAfter[latest.decision], updated: latest.decidedAt, history }
      : { ...item, history };
  });
}

// Every task that isn't approved, in seed order
export const needsAttention = <T extends ReviewItem>(tasks: T[]) => tasks.filter(isOpen);

/*
 * Review Queue counts (approved by Team 03, Nov 6, 2026). On the seed they give the
 * same 3 / 1 / 1 / 0 as the Week 10 fixed values:
 * - Content for review: open Guidance content, Quiz content and Sources tasks
 * - Safety checks: open Claims & safety tasks
 * - Partner content: open Partner content tasks
 * - Open questions: open tasks marked openQuestion
 */
const countRules: ((task: ReviewItem) => boolean)[] = [
  (task) => ['Guidance content', 'Quiz content', 'Sources'].includes(task.type),
  (task) => task.type === 'Claims & safety',
  (task) => task.type === 'Partner content',
  (task) => task.openQuestion,
];

export function dashboardSummary(tasks: ReviewItem[]): { label: string; value: number }[] {
  const open = needsAttention(tasks);
  // Labels and order stay the Week 10 ones
  return reviewQueueSummary.map((count, index) => ({ label: count.label, value: open.filter(countRules[index]).length }));
}

export type DecisionErrors = { decision?: 'missing'; note?: 'missing' };

// Request changes needs a note; Approve doesn't
export function validateDecision(decision: ReviewDecisionKind | null, note: string): DecisionErrors {
  const errors: DecisionErrors = {};
  if (!decision) errors.decision = 'missing';
  if (decision === 'changes-requested' && !note.trim()) errors.note = 'missing';
  return errors;
}

// The seed's date style: "Nov 6, 2026"
export const formatDecisionDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Reads what was saved in the browser. Anything unexpected is dropped, so a bad
// saved value can never break a screen.
export function parseReviewSession(raw: unknown, knownTaskIds: string[]): { decisions: ReviewDecision[]; notice: ReviewNotice | null } {
  const record = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const isKind = (value: unknown): value is ReviewDecisionKind => value === 'approved' || value === 'changes-requested';
  const isKnown = (value: unknown): value is string => typeof value === 'string' && knownTaskIds.includes(value);

  const decisions = (Array.isArray(record.decisions) ? record.decisions : []).filter(
    (entry): entry is ReviewDecision =>
      typeof entry === 'object' &&
      entry !== null &&
      isKnown(entry.taskId) &&
      isKind(entry.decision) &&
      typeof entry.note === 'string' &&
      typeof entry.decidedBy === 'string' &&
      typeof entry.decidedAt === 'string',
  );

  const notice = record.notice as Partial<ReviewNotice> | null | undefined;
  return {
    decisions,
    notice: notice && isKnown(notice.taskId) && isKind(notice.decision) ? { taskId: notice.taskId, decision: notice.decision } : null,
  };
}
