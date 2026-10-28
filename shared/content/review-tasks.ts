/*
 * Review Tasks screen copy and seed data (Week 10, after the Dashboard).
 *
 * There's no current hi-fi reference for this screen, so only the structure is
 * built: title, breadcrumb, back link, the review table and its states. The rows
 * are the approved Dashboard sample items, reused as they are. They're SAMPLE DATA
 * only. Supabase replaces them when Team 03 starts that step.
 */

import { needsAttentionSeed, type ReviewItem } from './dashboard-review-queue';

export const reviewTasksCopy = {
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  tableCaption: 'Review tasks (sample data)',
  // PROVISIONAL state messages: the board marks Empty and Loading as provisional
  states: {
    loading: 'Loading review tasks…',
    empty: 'No review tasks right now.',
    emptyAction: 'Go to Dashboard',
    error: "Couldn't load review tasks. Check your connection, then reload the page.",
  },
};

// The approved Dashboard sample items, unchanged
export const reviewTasksSeed: ReviewItem[] = needsAttentionSeed;
