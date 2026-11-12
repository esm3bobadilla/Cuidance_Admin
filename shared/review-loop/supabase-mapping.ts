/*
 * Phase A2: turns Supabase rows into the review tasks every screen already shows.
 *
 * The database stores short codes (enums from the Phase 2.1 migrations). The screens
 * keep the Week 10 / Week 11 labels, so this is the only place the two meet. No React
 * and no Supabase client here: plain data in, plain data out.
 *
 * Statuses, counts and Needs attention are still worked out by review-decisions.ts.
 * In Supabase mode the database trigger has already set each task's status from its
 * latest decision (the same rule as statusAfter), so the rows are used as they are.
 */

import type { ReviewPriority, ReviewStatus } from '../content/dashboard-review-queue';
import { formatDecisionDate, type ReviewDecision, type ReviewDecisionKind, type ReviewTask } from './review-decisions';

// Database codes (supabase/migrations/20261111060000_types.sql) to the screen labels
export const taskTypeLabels: Record<string, string> = {
  guidance_content: 'Guidance content',
  claims_safety: 'Claims & safety',
  quiz_content: 'Quiz content',
  partner_content: 'Partner content',
  sources: 'Sources',
};

export const taskStatusLabels: Record<string, ReviewStatus> = {
  in_review: 'In review',
  needs_review: 'Needs review',
  pending_disclosure: 'Pending disclosure',
  needs_changes: 'Needs changes',
  approved: 'Approved',
};

export const taskPriorityLabels: Record<string, ReviewPriority> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const decisionFromDb: Record<string, ReviewDecisionKind> = {
  approved: 'approved',
  changes_requested: 'changes-requested',
};

export const decisionToDb: Record<ReviewDecisionKind, 'approved' | 'changes_requested'> = {
  approved: 'approved',
  'changes-requested': 'changes_requested',
};

// Shown when a task has no assignee, or a person has no name yet
export const unassignedLabel = 'Unassigned';
export const unnamedLabel = 'Team member';

// The columns read from Supabase (kept here so the query and the mapping can't drift)
export const reviewTaskSelect =
  'id, workspace_id, title, type, status, priority, open_question, assigned_to, updated_at, created_at, ' +
  'assignee:profiles!review_tasks_assigned_to_fkey(full_name), ' +
  'review_decisions(id, decision, note, decided_by, decided_at, decider:profiles!review_decisions_decided_by_fkey(full_name))';

type NameRow = { full_name: string | null } | null;

export type ReviewDecisionRow = {
  id: string;
  decision: string;
  note: string | null;
  decided_by: string;
  decided_at: string;
  decider: NameRow;
};

export type ReviewTaskRow = {
  id: string;
  workspace_id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  open_question: boolean;
  assigned_to: string | null;
  updated_at: string;
  created_at: string;
  assignee: NameRow;
  review_decisions: ReviewDecisionRow[] | null;
};

// A Supabase task, as the screens show it, plus what Supabase mode needs to save a decision
export type LiveReviewTask = ReviewTask & {
  workspaceId: string;
  assignedToId: string | null;
};

const nameOf = (row: NameRow, fallback: string) => row?.full_name?.trim() || fallback;

// Anything the screens don't know is left out, so a new database value can never break a screen
export function rowToTask(row: ReviewTaskRow): LiveReviewTask | null {
  const type = taskTypeLabels[row.type];
  const status = taskStatusLabels[row.status];
  const priority = taskPriorityLabels[row.priority];
  if (!type || !status || !priority) return null;

  const history: ReviewDecision[] = (row.review_decisions ?? [])
    .filter((entry) => decisionFromDb[entry.decision])
    .sort((a, b) => a.decided_at.localeCompare(b.decided_at))
    .map((entry) => ({
      taskId: row.id,
      decision: decisionFromDb[entry.decision],
      note: entry.note ?? '',
      decidedBy: nameOf(entry.decider, unnamedLabel),
      decidedAt: formatDecisionDate(new Date(entry.decided_at)),
    }));

  return {
    id: row.id,
    item: row.title,
    type,
    status,
    priority,
    assignedTo: row.assigned_to ? nameOf(row.assignee, unnamedLabel) : unassignedLabel,
    updated: formatDecisionDate(new Date(row.updated_at)),
    openQuestion: row.open_question,
    history,
    workspaceId: row.workspace_id,
    assignedToId: row.assigned_to,
  };
}

// Oldest first, as the seed is ordered
export function rowsToTasks(rows: ReviewTaskRow[]): LiveReviewTask[] {
  return [...rows]
    .sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id))
    .map(rowToTask)
    .filter((task): task is LiveReviewTask => task !== null);
}

// D12: a task can be decided again after Needs changes, until it's Approved.
// D4: only the assigned Reviewer records a decision (the database checks this too).
export function canDecide(task: LiveReviewTask, userId: string | null, role: string | null) {
  return task.status !== 'Approved' && !!userId && task.assignedToId === userId && role === 'reviewer';
}

// Task IDs in Supabase mode are UUIDs
export const isTaskId = (value: string | null | undefined): value is string =>
  !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

// Up to two initials for the Profile button ("Reviewer B" → "RB"; an email uses its first letter)
export function initialsOf(name: string): string {
  const words = name.replace(/@.*$/, '').split(/[\s._-]+/).filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? '').slice(0, 2);
  return letters.toUpperCase() || '?';
}
