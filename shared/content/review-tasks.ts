/*
 * Review Tasks screen copy and seed data.
 *
 * Layout: aligned with the approved Week 9 Review Tasks hi-fi screenshot (Batch 1).
 * The rows are still the approved Dashboard sample items, reused as they are, so
 * the two screens can't drift apart. They're SAMPLE DATA only. Supabase replaces
 * them when Team 03 starts that step.
 *
 * From the hi-fi: the search placeholder and the review checklist (shown for
 * "Review ingredient benefit wording", the task the hi-fi shows it for).
 * Left out, PROVISIONAL: the hi-fi's task context and related content (an
 * ashwagandha "stress support" article, outside Cuidance's beauty and personal-care
 * scope), its task ID, tabs, due dates and actions (no defined flow).
 */

import { needsAttentionSeed, type ReviewItem } from './dashboard-review-queue';

export const reviewTasksCopy = {
  eyebrow: 'Internal tool',
  searchLabel: 'Search tasks',
  searchPlaceholder: 'Search tasks, content, or assignee…',
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} tasks` : `1–${shown} of ${total} tasks`),
  detail: {
    heading: 'Task',
    priority: (priority: string) => `${priority} priority`,
    type: 'Type',
    assignedTo: 'Assigned to',
    updated: 'Updated',
    taskContext: 'Task context',
    relatedContent: 'Related content',
    checklist: 'Review checklist',
    pending: 'To be confirmed by Team 03.',
  },
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  tableCaption: 'Review tasks (sample data)',
  // PROVISIONAL state messages: the board marks Empty and Loading as provisional
  states: {
    loading: 'Loading review tasks…',
    empty: 'No review tasks right now.',
    emptyAction: 'Go to Dashboard',
    error: "Couldn't load review tasks. Check your connection, then reload the page.",
    noResults: 'No tasks match your search.',
    clear: 'Clear search',
  },
};

// Review checklist from the hi-fi, keyed by task title (only where the hi-fi shows one)
export const reviewChecklists: Record<string, string[]> = {
  'Review ingredient benefit wording': [
    'Confirm claims are supported by reliable sources',
    'Ensure wording is balanced and non-promotional',
    'Check for required disclosures',
    'Verify alignment with safety guidelines',
  ],
};

// The approved Dashboard sample items, unchanged
export const reviewTasksSeed: ReviewItem[] = needsAttentionSeed;
