/*
 * Guidance Content screen: wording and SAMPLE DATA (prototype alignment, Batch 1).
 *
 * Source: the approved Week 9 hi-fi screenshot of Guidance Content (A3). Titles,
 * summaries, care areas, types, statuses, dates and the first item's details are
 * taken from it as shown, with these PROVISIONAL changes:
 * - A3's source note ("Based on dermatology-reviewed educational resources and
 *   expert input…") and review line ("Reviewed by clinical content lead…") are
 *   left out: CLAUDE.md rules out medical-review and clinical sign-off workflows.
 *   They show "To be confirmed by Team 03."
 * - A3 shows details for one item only; the others show "To be confirmed by
 *   Team 03." rather than invented details.
 * - A3 shows no evidence labels (Strong, Moderate, Limited, Assumption). Each
 *   guidance claim needs one (CLAUDE.md); where they appear is to be confirmed.
 * Nothing here is live content. Supabase replaces this file later.
 */

export type GuidanceStatus = 'Published' | 'In review' | 'Draft';

export type GuidanceItem = {
  id: string;
  title: string;
  summary: string;
  careArea: string;
  type: string;
  status: GuidanceStatus;
  updated: string;
  details?: { source: string; longSummary: string };
};

export const guidanceCopy = {
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  searchLabel: 'Search guidance content',
  searchPlaceholder: 'Search guidance content…',
  statusLabel: 'Status',
  allStatuses: 'All statuses',
  tableCaption: 'Guidance content (sample data)',
  columns: { title: 'Title', careArea: 'Care area', type: 'Type', status: 'Status', updated: 'Last updated' },
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} items` : `1–${shown} of ${total} items`),
  detail: {
    heading: 'Guidance details',
    careArea: 'Care area',
    type: 'Content type',
    source: 'Source',
    reviewStatus: 'Review status',
    lastUpdated: (date: string) => `Last updated ${date}`,
    summary: 'Summary',
    evidence: 'Evidence labels',
    pending: 'To be confirmed by Team 03.',
  },
  states: {
    loading: 'Loading guidance content…',
    empty: 'No guidance content yet.',
    emptyAction: 'Go to Content',
    error: "Couldn't load guidance content. Check your connection, then reload the page.",
    noResults: 'No guidance content matches your search or filter.',
    clear: 'Clear search and filter',
  },
};

export const guidanceStatuses: GuidanceStatus[] = ['Published', 'In review', 'Draft'];

export const guidanceSeed: GuidanceItem[] = [
  {
    id: 'g1',
    title: 'Understanding sensitive skin',
    summary: 'What sensitive skin can look and feel like, common triggers, and ways to care for it.',
    careArea: 'Skin',
    type: 'Educational article',
    status: 'Published',
    updated: 'Apr 12, 2024',
    details: {
      source: 'Cuidance editorial team',
      longSummary:
        'This article explains what sensitive skin can look and feel like, common factors that may contribute to sensitivity, and practical ways to care for sensitive skin, including ingredient and product considerations.',
    },
  },
  { id: 'g2', title: 'Finding a starting point for textured hair', summary: 'Gentle ways to build a hair care routine that works for your texture and goals.', careArea: 'Hair', type: 'How-to guide', status: 'In review', updated: 'Apr 9, 2024' },
  { id: 'g3', title: 'How ingredient notes support better choices', summary: "A guide to common ingredient notes and what they can (and can't) tell you.", careArea: 'Ingredients', type: 'Explainer', status: 'Published', updated: 'Apr 5, 2024' },
  { id: 'g4', title: 'Choosing makeup coverage and shade family', summary: 'Key things to consider when selecting coverage and finding a shade family.', careArea: 'Makeup', type: 'Educational article', status: 'Draft', updated: 'Mar 28, 2024' },
  { id: 'g5', title: 'Caring for your skin barrier', summary: 'What the skin barrier is and everyday habits that can help support it.', careArea: 'Skin', type: 'Explainer', status: 'Published', updated: 'Mar 20, 2024' },
  { id: 'g6', title: 'Build a simple, consistent routine', summary: 'How to create a manageable routine that fits your needs and lifestyle.', careArea: 'General care', type: 'How-to guide', status: 'Draft', updated: 'Mar 14, 2024' },
  { id: 'g7', title: 'Understanding hair porosity', summary: 'What hair porosity means and how it can inform your product and care choices.', careArea: 'Hair', type: 'Explainer', status: 'In review', updated: 'Mar 8, 2024' },
  { id: 'g8', title: 'Reading product labels with confidence', summary: 'Tips for spotting key information on product labels.', careArea: 'Ingredients', type: 'How-to guide', status: 'Published', updated: 'Feb 26, 2024' },
];
