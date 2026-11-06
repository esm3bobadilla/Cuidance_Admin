/*
 * Product Information screen: wording and SAMPLE DATA (prototype alignment, Slice 4).
 *
 * Source: the approved Week 9 hi-fi screenshot of Product Information (A4).
 * Product names, categories, statuses, disclosures, dates and the selected
 * product's notes are taken from it as shown, with these PROVISIONAL changes:
 * - A4's brand names are replaced by "Brand A" to "Brand D". CLAUDE.md allows
 *   no real brand names, and these can't be confirmed as invented.
 * - A4's editor names are replaced by "Team member A/B", as on the Dashboard.
 * - A4's second sentence of the educational description ("A good option for
 *   those looking for…") is left out: it reads as a recommendation, which the
 *   copy rules avoid. Team 03 to confirm.
 * - A4 shows details for one product only. The others show "To be confirmed
 *   by Team 03." rather than invented notes.
 * Product availability and retailer information stay out (VERIFY, CLAUDE.md).
 * Nothing here is live content. Supabase replaces this file later.
 */

export type InformationStatus = 'Complete' | 'Needs update';
export type SourceStatus = 'Reviewed' | 'In review';
// Partner content always carries the Partner label (Byzantium Plum plus text)
export type Disclosure = 'Educational information' | 'Partner content';

export type ProductRecord = {
  id: string;
  name: string;
  brand: string;
  category: string;
  informationStatus: InformationStatus;
  sourceStatus: SourceStatus;
  disclosure: Disclosure;
  updated: string;
  // Only where A4 shows them
  details?: {
    ingredientNotes: string;
    educationalDescription: string;
    sourceReference: { title: string; accessed: string };
    lastUpdatedBy: string;
    lastReviewed: string;
    lastReviewedBy: string;
  };
};

export const productInformationCopy = {
  eyebrow: 'Internal tool',
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  searchLabel: 'Search products',
  searchPlaceholder: 'Search products, brands, or keywords…',
  tableCaption: 'Product information (sample data)',
  columns: {
    name: 'Product name',
    brand: 'Brand',
    category: 'Category',
    informationStatus: 'Information status',
    sourceStatus: 'Source status',
    disclosure: 'Disclosure',
    updated: 'Last updated',
  },
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} products` : `1–${shown} of ${total} products`),
  detail: {
    heading: 'Product details',
    disclosure: 'Disclosure',
    ingredientNotes: 'Ingredient notes',
    educationalDescription: 'Educational description',
    sourceReference: 'Source reference',
    accessed: (date: string) => `Accessed ${date}`,
    informationStatus: 'Information status',
    sourceStatus: 'Source status',
    lastUpdated: (date: string, by?: string) => (by ? `Last updated ${date} by ${by}` : `Last updated ${date}`),
    lastReviewed: (date: string, by: string) => `Last reviewed ${date} by ${by}`,
    // PROVISIONAL: A4 shows these details for one product only
    pending: 'To be confirmed by Team 03.',
  },
  // Disclosure text. Educational wording from A4; Partner wording isn't in A4 (PROVISIONAL)
  disclosureText: {
    'Educational information': 'This product information is provided for educational purposes only. No commercial relationship exists with this brand.',
    'Partner content': 'Partner disclosure wording to be confirmed by Team 03.',
  } as Record<Disclosure, string>,
  // PROVISIONAL state messages: the board marks Empty and Loading as provisional
  states: {
    loading: 'Loading product information…',
    empty: 'No product information yet.',
    emptyAction: 'Go to Content',
    error: "Couldn't load product information. Check your connection, then reload the page.",
    noResults: 'No products match your search.',
    clear: 'Clear search',
  },
};

export const productSeed: ProductRecord[] = [
  {
    id: 'p1',
    name: 'Gentle cleanser',
    brand: 'Brand A',
    category: 'Cleanser',
    informationStatus: 'Complete',
    sourceStatus: 'Reviewed',
    disclosure: 'Educational information',
    updated: 'Oct 14, 2024',
    details: {
      ingredientNotes:
        'A gentle, sulfate-free cleanser with glycerin and plant-derived surfactants. Formulated to cleanse without stripping the skin barrier. Includes soothing ingredients such as oat extract and allantoin.',
      educationalDescription:
        "A mild, everyday cleanser that helps remove dirt, oil, and makeup while supporting the skin's moisture barrier.",
      sourceReference: { title: 'Brand A Gentle Cleanser – Product Page', accessed: 'Oct 2, 2024' },
      lastUpdatedBy: 'Team member A',
      lastReviewed: 'Oct 12, 2024',
      lastReviewedBy: 'Team member B',
    },
  },
  { id: 'p2', name: 'Lightweight moisturizer', brand: 'Brand B', category: 'Moisturizer', informationStatus: 'Complete', sourceStatus: 'In review', disclosure: 'Partner content', updated: 'Oct 10, 2024' },
  { id: 'p3', name: 'Leave-in conditioner', brand: 'Brand C', category: 'Hair Care', informationStatus: 'Complete', sourceStatus: 'Reviewed', disclosure: 'Educational information', updated: 'Oct 8, 2024' },
  { id: 'p4', name: 'Buildable coverage foundation', brand: 'Brand D', category: 'Makeup', informationStatus: 'Needs update', sourceStatus: 'In review', disclosure: 'Educational information', updated: 'Oct 5, 2024' },
];
