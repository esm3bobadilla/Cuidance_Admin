/*
 * Commercial Content screen: wording and data (Batch 2). Approved by Team 03 (C7).
 *
 * There's no hi-fi for this screen, so the LAYOUT IS PROVISIONAL: it reuses the
 * approved list-and-details pattern. Nothing is invented: the list is every
 * commercially labeled item that already exists in approved sample data
 *   - the five Partner Highlights items (Partner content or Sponsored), and
 *   - the Partner content product on Product Information,
 * each with its label, disclosure, status and a link to the screen it lives on.
 * Disclosure wording that no source supplies shows "To be confirmed by Team 03."
 * No create, edit, publishing or approval actions.
 */
import { partnerHighlightSeed, type PartnerHighlight } from './partner-highlights';
import { productSeed } from './product-information';
import type { AdminScreenId } from './admin-web-screens';

export type CommercialLabel = 'Partner content' | 'Sponsored';

export type CommercialItem = {
  id: string;
  title: string;
  label: CommercialLabel;
  screen: AdminScreenId;
  disclosure: string;
  status: string;
  // The status's name on its own screen, for the details panel
  statusName: string;
  updated: string;
  partner?: string;
  placement?: string;
};

export const commercialCopy = {
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  // Approved rule wording: CLAUDE.md and the Partner Highlights hi-fi banner
  bannerTitle: 'Partner content must remain visibly separate from neutral guidance.',
  bannerText: 'Commercial content must be clearly labeled and kept separate from guidance. Use clear labels (Partner content or Sponsored) and follow placement and disclosure guidelines.',
  searchLabel: 'Search commercial content',
  searchPlaceholder: 'Search titles, labels, or screens…',
  labelFilter: 'Label',
  allLabels: 'All labels',
  tableCaption: 'Commercially labeled content (sample data)',
  columns: { title: 'Content title', label: 'Label', screen: 'Appears on', disclosure: 'Disclosure', status: 'Status', updated: 'Last updated' },
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} items` : `1–${shown} of ${total} items`),
  detail: {
    heading: 'Commercial details',
    label: 'Label',
    screen: 'Appears on',
    open: (screen: string) => `Go to ${screen}`,
    partner: 'Partner',
    placement: 'Placement',
    disclosure: 'Disclosure',
    disclosureWording: 'Disclosure wording',
    status: 'Status',
    updated: 'Last updated',
    pending: 'To be confirmed by Team 03.',
  },
  states: {
    loading: 'Loading commercial content…',
    empty: 'No commercial content yet.',
    emptyAction: 'Go to Content',
    error: "Couldn't load commercial content. Check your connection, then reload the page.",
    noResults: 'No commercial content matches your search or filter.',
    clear: 'Clear search and filter',
  },
};

export const commercialLabels: CommercialLabel[] = ['Partner content', 'Sponsored'];

const fromHighlight = (h: PartnerHighlight): CommercialItem => ({
  id: `c-${h.id}`,
  title: h.title,
  label: h.label,
  screen: 'partner-highlights',
  disclosure: h.disclosureType,
  status: h.status,
  statusName: 'Review status',
  updated: h.updated,
  partner: h.partner,
  placement: h.placement,
});

export const commercialItems: CommercialItem[] = [
  ...partnerHighlightSeed.map(fromHighlight),
  ...productSeed
    .filter((p) => p.disclosure === 'Partner content')
    .map((p) => ({
      id: `c-${p.id}`,
      title: p.name,
      label: 'Partner content' as const,
      screen: 'product-information' as const,
      disclosure: p.disclosure,
      status: p.informationStatus,
      statusName: 'Information status',
      updated: p.updated,
      partner: p.brand,
    })),
];
