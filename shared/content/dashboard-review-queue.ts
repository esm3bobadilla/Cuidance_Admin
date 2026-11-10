/*
 * Dashboard / Review Queue: screen copy and seed data (Week 10 Step 3).
 *
 * Source: the Team 03 Dashboard / Review Queue hi-fi screen
 * (T03_W09_AdminWeb_HiFiScreen_DashboardReviewQueue_Cuidance_v01_ART646).
 * Wording is taken from the hi-fi. The review items are SAMPLE DATA for the first
 * implementation only. Three Review Queue counts are fixed seed values. Open questions
 * is counted from the seed items explicitly marked openQuestion: true. No other review
 * logic lives here. Supabase replaces this file when Team 03 starts that step.
 */

import type { AdminScreenId } from './admin-web-screens';

export const dashboardCopy = {
  eyebrow: 'Internal tool',
  title: 'Cuidance Admin Web',
  description: 'Manage educational content, product information, sources, and safety review for the Cuidance app.',
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  reviewQueue: {
    title: 'Review Queue',
    description: 'Content and changes that need attention from your team.',
    action: 'View review tasks',
  },
  keyAreas: {
    title: 'Key Areas',
    description: 'Quick access to manage Cuidance content and information.',
  },
  needsAttention: {
    title: 'Needs attention',
    description: 'Items that require review or action.',
    tableCaption: 'Items that need attention (sample data)',
    action: 'View all review tasks',
  },
  reminder: {
    title: 'Keep guidance accurate, helpful, and safe.',
    body: 'Review content regularly, ensure claims are supported by reliable sources, and maintain clear disclosures.',
  },
  // PROVISIONAL state messages: the board marks Empty and Loading as provisional
  states: {
    loading: 'Loading review items…',
    empty: 'Nothing needs attention right now.',
    emptyAction: 'Go to Review Tasks',
    error: "Couldn't load review items. Check your connection, then reload the page.",
  },
};

// Key Areas cards, in hi-fi order. Names come from the approved screen list.
export const dashboardKeyAreas: { id: AdminScreenId; description: string }[] = [
  { id: 'quiz-content', description: 'Manage quiz questions, answer guidance, and outcomes.' },
  { id: 'guidance-content', description: 'Create and update educational articles and guidance.' },
  { id: 'product-information', description: 'Manage product details, attributes, and educational context.' },
  { id: 'knowledge-sources', description: 'Maintain source library and references.' },
  { id: 'partner-highlights', description: 'Manage partner and sponsored educational content.' },
  { id: 'claims-safety-review', description: 'Review claims, safety notes, and required disclosures.' },
];

// Status and priority labels as shown in the hi-fi
// "Approved" is added in Week 11 (Close the Loop): a Reviewer's decision can set it.
// No seed item starts as Approved.
export type ReviewStatus = 'In review' | 'Needs changes' | 'Pending disclosure' | 'Needs review' | 'Approved';
export type ReviewPriority = 'High' | 'Medium' | 'Low';

export type ReviewItem = {
  id: string;
  item: string;
  type: string;
  status: ReviewStatus;
  priority: ReviewPriority;
  assignedTo: string;
  updated: string;
  // Explicitly marks an item as an open question. Only these count toward "Open questions".
  openQuestion: boolean;
};

// Types, statuses and priorities follow the hi-fi rows. Item titles come from the
// other current hi-fi screens. Reviewers are placeholders, not real people.
export const needsAttentionSeed: ReviewItem[] = [
  {
    id: 'seed-1',
    item: 'Understanding sensitive skin',
    type: 'Guidance content',
    status: 'In review',
    priority: 'High',
    assignedTo: 'Reviewer A',
    updated: 'Oct 26, 2026',
    openQuestion: false,
  },
  {
    id: 'seed-2',
    item: 'Review ingredient benefit wording',
    type: 'Claims & safety',
    status: 'Needs changes',
    priority: 'High',
    assignedTo: 'Reviewer B',
    updated: 'Oct 26, 2026',
    openQuestion: false,
  },
  {
    id: 'seed-3',
    item: 'Which care areas would you like guidance on?',
    type: 'Quiz content',
    status: 'In review',
    priority: 'Medium',
    assignedTo: 'Reviewer A',
    updated: 'Oct 25, 2026',
    openQuestion: false,
  },
  {
    id: 'seed-4',
    item: 'Check partner disclosure is visible',
    type: 'Partner content',
    status: 'Pending disclosure',
    priority: 'Medium',
    assignedTo: 'Reviewer C',
    updated: 'Oct 24, 2026',
    openQuestion: false,
  },
  {
    id: 'seed-5',
    item: 'Validate source support for claim',
    type: 'Sources',
    status: 'Needs review',
    priority: 'Low',
    assignedTo: 'Reviewer B',
    updated: 'Oct 23, 2026',
    openQuestion: false,
  },
];

// Open questions: the number of seed items explicitly marked openQuestion: true.
// No seed item is an open question today, so the count is 0.
export const openQuestionCount = (items: ReviewItem[]) => items.filter((item) => item.openQuestion).length;

// Review Queue summary counts. The first three are fixed seed values (not calculated).
// Open questions is counted from the seed rows with openQuestion: true.
export const reviewQueueSummary: { label: string; value: number }[] = [
  { label: 'Content for review', value: 3 },
  { label: 'Safety checks', value: 1 },
  { label: 'Partner content', value: 1 },
  { label: 'Open questions', value: openQuestionCount(needsAttentionSeed) },
];
