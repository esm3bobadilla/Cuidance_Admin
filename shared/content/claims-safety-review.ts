/*
 * Claims & Safety Review screen: wording and SAMPLE DATA (prototype alignment, Slice 5).
 *
 * Source: the approved Week 9 hi-fi screenshot of Claims & Safety Review (A5).
 * Items, content areas, review types, statuses, priorities, dates and the
 * selected item's details are taken from it as shown, with these PROVISIONAL
 * changes:
 * - A5's reviewer initials (ES, MR, CL, JT) are replaced by Reviewer A to D,
 *   as on the Dashboard.
 * - A5's source reference names a real organization with a web address that
 *   can't be confirmed. It's shown as text, with no link, marked VERIFY.
 * - A5 shows details for one item only. The others show "To be confirmed by
 *   Team 03." rather than invented details.
 * - A5's Status dropdown, "Add note" and "Mark as in review" aren't built:
 *   no review workflow is defined. Status shows as a read-only label.
 * Nothing here is live content. Supabase replaces this file later.
 */

export type ClaimsStatus = 'Needs review' | 'In review' | 'Needs changes' | 'Approved with notes';
export type ClaimsPriority = 'High' | 'Medium' | 'Low';

export type ClaimsItem = {
  id: string;
  item: string;
  contentArea: string;
  reviewType: string;
  status: ClaimsStatus;
  priority: ClaimsPriority;
  reviewer: { name: string; initials: string };
  updated: string;
  // Only where A5 shows them
  details?: {
    flaggedStatement: string;
    context: string;
    sourceReference: string;
    reviewerNote: string;
    requiredAction: string;
  };
};

// Tabs. PROVISIONAL meaning, chosen to match A5, where Review Queue lists every open item:
// Review Queue = everything not fully approved; Approved = approved items (with notes);
// Needs Changes = items sent back; All Items = everything.
export type ClaimsTab = 'queue' | 'approved' | 'changes' | 'all';

export const claimsTabs: { id: ClaimsTab; label: string; statuses: ClaimsStatus[] | null }[] = [
  { id: 'queue', label: 'Review Queue', statuses: ['Needs review', 'In review', 'Needs changes', 'Approved with notes'] },
  { id: 'approved', label: 'Approved', statuses: ['Approved with notes'] },
  { id: 'changes', label: 'Needs Changes', statuses: ['Needs changes'] },
  { id: 'all', label: 'All Items', statuses: null },
];

const A = { name: 'Reviewer A', initials: 'RA' };
const B = { name: 'Reviewer B', initials: 'RB' };
const C = { name: 'Reviewer C', initials: 'RC' };
const D = { name: 'Reviewer D', initials: 'RD' };

export const claimsCopy = {
  eyebrow: 'Internal tool',
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  tabsLabel: 'Review lists',
  areaLabel: 'Content area',
  allAreas: 'All content areas',
  searchLabel: 'Search items',
  searchPlaceholder: 'Search items…',
  tableCaption: 'Claims and safety review items (sample data)',
  columns: {
    item: 'Item',
    contentArea: 'Content area',
    reviewType: 'Review type',
    status: 'Status',
    priority: 'Priority',
    reviewer: 'Assigned reviewer',
    updated: 'Last updated',
  },
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} items` : `1–${shown} of ${total} items`),
  detail: {
    heading: 'Review details',
    position: (index: number, total: number) => `Item ${index} of ${total}`,
    previous: 'Previous item',
    next: 'Next item',
    priority: (priority: string) => `${priority} priority`,
    flaggedStatement: 'Flagged statement',
    context: 'Context',
    sourceReference: 'Source reference',
    reviewerNote: 'Reviewer note',
    requiredAction: 'Required action',
    status: 'Status',
    pending: 'To be confirmed by Team 03.',
  },
  // A5's banner wording
  disclaimer: 'Cuidance provides educational guidance. It does not diagnose conditions or replace professional medical advice.',
  // PROVISIONAL state messages: the board marks Empty and Loading as provisional
  states: {
    loading: 'Loading review items…',
    empty: 'Nothing to review right now.',
    emptyAction: 'Go to Dashboard',
    error: "Couldn't load review items. Check your connection, then reload the page.",
    noResults: 'No items match your search or filter.',
    clear: 'Clear search and filter',
  },
};

export const claimsSeed: ClaimsItem[] = [
  {
    id: 'c1',
    item: 'Review ingredient benefit wording',
    contentArea: 'Ingredient content',
    reviewType: 'Claims review',
    status: 'Needs review',
    priority: 'High',
    reviewer: A,
    updated: 'Oct 14, 2024 10:24 AM',
    details: {
      flaggedStatement: '“Helps support healthy looking skin by nourishing with antioxidants.”',
      context: 'Appears in ingredient section for green tea extract. Used in guidance content about ingredient benefits.',
      sourceReference: 'National Institutes of Health. Green Tea and Health. Published 2022. (VERIFY: sample reference, not checked)',
      reviewerNote: 'Consider simplifying the benefit wording and ensure it stays educational. Avoid implying guaranteed results.',
      requiredAction:
        'Revise wording to be educational and non-promotional. Confirm a source is cited and that the claim is accurately represented. Route back for re-review.',
    },
  },
  { id: 'c2', item: 'Confirm product description is educational', contentArea: 'Product content', reviewType: 'Educational framing', status: 'In review', priority: 'Medium', reviewer: B, updated: 'Oct 14, 2024 9:11 AM' },
  { id: 'c3', item: 'Check partner disclosure is visible', contentArea: 'Partner content', reviewType: 'Disclosure review', status: 'Needs changes', priority: 'High', reviewer: C, updated: 'Oct 13, 2024 4:20 PM' },
  { id: 'c4', item: 'Review safety boundary language', contentArea: 'Safety notes', reviewType: 'Safety review', status: 'In review', priority: 'High', reviewer: A, updated: 'Oct 13, 2024 1:03 PM' },
  { id: 'c5', item: 'Validate source support for claim', contentArea: 'Educational article', reviewType: 'Source review', status: 'Approved with notes', priority: 'Medium', reviewer: D, updated: 'Oct 12, 2024 3:18 PM' },
  { id: 'c6', item: 'Review general wellness wording', contentArea: 'Collection page', reviewType: 'Claims review', status: 'Needs review', priority: 'Medium', reviewer: B, updated: 'Oct 12, 2024 11:09 AM' },
  { id: 'c7', item: 'Confirm imagery and language alignment', contentArea: 'Product content', reviewType: 'Editorial review', status: 'Approved with notes', priority: 'Low', reviewer: C, updated: 'Oct 11, 2024 5:42 PM' },
  { id: 'c8', item: 'Check safety note prominence', contentArea: 'Guidance experience', reviewType: 'Safety review', status: 'Needs changes', priority: 'High', reviewer: A, updated: 'Oct 11, 2024 2:16 PM' },
];
