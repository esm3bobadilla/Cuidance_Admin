/*
 * Knowledge Sources screen: wording and SAMPLE DATA (prototype alignment, Batch 1).
 *
 * Source: the approved Week 9 hi-fi screenshot of Knowledge Sources. Titles,
 * source types, content areas, statuses, dates and the first source's details
 * are taken from it as shown, with these PROVISIONAL changes:
 * - The hi-fi's owner names are replaced by "Team member A" to "E".
 * - The hi-fi shows details for one source only; the others show "To be
 *   confirmed by Team 03." rather than invented details.
 * - "Open source" and "Add source" aren't built: there's no source address and
 *   no defined create flow.
 * Nothing here is live content. Supabase replaces this file later.
 */

export type SourceReviewStatus = 'Published' | 'In review' | 'Needs review' | 'Archived';

export type KnowledgeSource = {
  id: string;
  title: string;
  sourceType: string;
  contentAreas: string[];
  status: SourceReviewStatus;
  lastReviewed: string;
  owner: string;
  details?: { description: string; reviewNotes: string };
};

export const knowledgeSourcesCopy = {
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  searchLabel: 'Search sources',
  searchPlaceholder: 'Search sources by title, type, or content area…',
  tableCaption: 'Knowledge sources (sample data)',
  columns: { title: 'Title', sourceType: 'Source type', contentAreas: 'Content areas', status: 'Review status', lastReviewed: 'Last reviewed', owner: 'Owner' },
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} sources` : `1–${shown} of ${total} sources`),
  detail: {
    heading: 'Source details',
    sourceType: 'Source type',
    description: 'Description',
    contentAreas: 'Content areas',
    reviewNotes: 'Review notes',
    lastReviewed: 'Last reviewed',
    owner: 'Owner',
    pending: 'To be confirmed by Team 03.',
  },
  states: {
    loading: 'Loading knowledge sources…',
    empty: 'No knowledge sources yet.',
    emptyAction: 'Go to Content',
    error: "Couldn't load knowledge sources. Check your connection, then reload the page.",
    noResults: 'No sources match your search.',
    clear: 'Clear search',
  },
};

export const knowledgeSourceSeed: KnowledgeSource[] = [
  {
    id: 'k1',
    title: 'Ingredient reference guide',
    sourceType: 'Reference guide',
    contentAreas: ['Ingredients', 'Safety', 'Claims'],
    status: 'Published',
    lastReviewed: 'Aug 15, 2024',
    owner: 'Team member A',
    details: {
      description:
        'Comprehensive reference on commonly used ingredients in skin and body care, including plain-language descriptions, typical use, and relevant considerations for educational content and claims review.',
      reviewNotes: 'Reviewed for accuracy and alignment with current educational content. Next review in 12 months or sooner if significant updates are published.',
    },
  },
  { id: 'k2', title: 'Care education article', sourceType: 'Educational article', contentAreas: ['Skin Care', 'Routines'], status: 'In review', lastReviewed: 'Sep 3, 2024', owner: 'Team member B' },
  { id: 'k3', title: 'Product information page', sourceType: 'Product information', contentAreas: ['Products', 'Usage', 'Claims'], status: 'Needs review', lastReviewed: 'Jun 20, 2024', owner: 'Team member C' },
  { id: 'k4', title: 'Partner disclosure document', sourceType: 'Partner document', contentAreas: ['Disclosures', 'Partners'], status: 'Archived', lastReviewed: 'Mar 12, 2024', owner: 'Team member D' },
  { id: 'k5', title: 'Sun protection overview', sourceType: 'Educational article', contentAreas: ['Sun Care', 'Safety'], status: 'Published', lastReviewed: 'Aug 1, 2024', owner: 'Team member A' },
  { id: 'k6', title: 'Ingredient glossary', sourceType: 'Reference guide', contentAreas: ['Ingredients'], status: 'Published', lastReviewed: 'Jul 18, 2024', owner: 'Team member E' },
  { id: 'k7', title: 'Sustainable packaging overview', sourceType: 'Educational article', contentAreas: ['Sustainability', 'Packaging'], status: 'In review', lastReviewed: 'Aug 28, 2024', owner: 'Team member B' },
  { id: 'k8', title: 'Brand claim examples', sourceType: 'Reference guide', contentAreas: ['Claims', 'Compliance'], status: 'Needs review', lastReviewed: 'May 10, 2024', owner: 'Team member C' },
];
