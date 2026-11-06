/*
 * Partner Highlights screen: wording and SAMPLE DATA (prototype alignment, Batch 1).
 *
 * Source: the approved Week 9 hi-fi screenshot of Partner Highlights. Titles,
 * labels, placements, disclosure types, statuses, dates, the banner and the first
 * item's details are taken from it as shown, with these PROVISIONAL changes:
 * - Partner brand names (Willow & Sage, Luma Care, Rivermere, Orchard Health) are
 *   replaced by "Partner A" to "D": CLAUDE.md allows no real brand names, and these
 *   can't be confirmed as invented (same decision as Product Information's Brand A to D).
 * - The editor name is replaced by "Team member A".
 * - Thumbnails and the preview image aren't built (no approved artwork).
 * - "Add partner content", "Edit content", "View full content" and the row menus
 *   aren't built: no defined create, edit or publishing flow.
 * - The hi-fi shows details for one item only; the others show "To be confirmed
 *   by Team 03."
 * Every item keeps its Partner content or Sponsored label (Byzantium Plum plus text).
 */

export type PartnerLabel = 'Partner content' | 'Sponsored';
export type PartnerStatus = 'Approved' | 'In review' | 'Draft';

export type PartnerHighlight = {
  id: string;
  title: string;
  label: PartnerLabel;
  partner: string;
  placement: string;
  disclosureType: string;
  status: PartnerStatus;
  updated: string;
  details?: { sourceApproval: string; updatedBy: string; preview: { title: string; text: string } };
};

export const partnerHighlightsCopy = {
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  // Hi-fi banner
  bannerTitle: 'Partner content must remain visibly separate from neutral guidance.',
  bannerText: 'Use clear labels (Partner content or Sponsored) and follow placement and disclosure guidelines.',
  searchLabel: 'Search partner content',
  searchPlaceholder: 'Search content or partners…',
  tableCaption: 'Partner highlights (sample data)',
  columns: { title: 'Content title', partner: 'Partner', placement: 'Placement', disclosureType: 'Disclosure type', status: 'Review status', updated: 'Last updated' },
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} items` : `1–${shown} of ${total} items`),
  detail: {
    heading: 'Partner content details',
    partner: 'Partner',
    placement: 'Placement',
    disclosureType: 'Disclosure type',
    sourceApproval: 'Source / approval',
    lastUpdated: 'Last updated',
    updatedBy: (date: string, by: string) => `${date} by ${by}`,
    preview: 'Content preview',
    pending: 'To be confirmed by Team 03.',
  },
  states: {
    loading: 'Loading partner content…',
    empty: 'No partner content yet.',
    emptyAction: 'Go to Content',
    error: "Couldn't load partner content. Check your connection, then reload the page.",
    noResults: 'No partner content matches your search.',
    clear: 'Clear search',
  },
};

export const partnerHighlightSeed: PartnerHighlight[] = [
  {
    id: 'ph1',
    title: 'Ingredient education spotlight',
    label: 'Partner content',
    partner: 'Partner A',
    placement: 'Article in guidance library',
    disclosureType: 'Educational partnership',
    status: 'Approved',
    updated: 'Mar 8, 2025 10:24 AM',
    details: {
      sourceApproval: 'Content provided by partner and reviewed by Cuidance content team.',
      updatedBy: 'Team member A',
      preview: {
        title: 'A closer look at bakuchiol',
        text: "Learn what bakuchiol is, how it's used in skincare, and what to know as you consider whether it may be right for you.",
      },
    },
  },
  { id: 'ph2', title: 'Care category partner highlight', label: 'Sponsored', partner: 'Partner B', placement: 'Topic hub module', disclosureType: 'Sponsored content', status: 'In review', updated: 'Mar 6, 2025 2:17 PM' },
  { id: 'ph3', title: 'Product information feature', label: 'Partner content', partner: 'Partner C', placement: 'Related content module', disclosureType: 'Product information', status: 'Approved', updated: 'Mar 1, 2025 11:03 AM' },
  { id: 'ph4', title: 'Seasonal care partner spotlight', label: 'Sponsored', partner: 'Partner D', placement: 'Homepage highlight', disclosureType: 'Sponsored content', status: 'Draft', updated: 'Feb 26, 2025 9:41 AM' },
  { id: 'ph5', title: 'Care routine education series', label: 'Partner content', partner: 'Partner A', placement: 'Guidance collection', disclosureType: 'Educational partnership', status: 'Approved', updated: 'Feb 20, 2025 4:08 PM' },
];
