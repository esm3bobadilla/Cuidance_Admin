/*
 * Consolidated Content workspace (Phase B1, Team 03 decision: one Content workspace).
 *
 * One list of every content item from the existing sample data, with search, filters
 * and a New content editor. Sample mode only: nothing is saved or published. Each row
 * links to the existing content page that holds its details.
 * Partner items keep their "Partner" label and stay separate from guidance.
 *
 * Phase 2 PR 1: Quiz, Guidance, Product, Claims and safety, Sources, Partners and Media
 * are content types and filters here, not separate sidebar pages. Product records live
 * in the Product Library, switched to with the contextual Content navigation.
 */
import type { AdminScreenId } from './admin-web-screens';
import { claimsSeed } from './claims-safety-review';
import { guidanceSeed } from './guidance-content';
import { knowledgeSourceSeed } from './knowledge-sources';
import { partnerHighlightSeed } from './partner-highlights';
import { productSeed } from './product-information';
import { quizQuestionSeed } from './quiz-content';

export type WorkspaceType = 'Guidance' | 'Quiz' | 'Product' | 'Claims and safety' | 'Source' | 'Partner' | 'Media';

export type WorkspaceItem = {
  id: string;
  title: string;
  type: WorkspaceType;
  screen: AdminScreenId;
  status: string;
  updated: string;
  partner: boolean;
};

export const workspaceTypes: WorkspaceType[] = ['Guidance', 'Quiz', 'Product', 'Claims and safety', 'Source', 'Partner', 'Media'];

// Sample media items: approved illustrations already used in Admin Web (sample data, not a media library)
const mediaSeed = [
  { id: 'm1', title: 'Content hero illustration', status: 'Approved', updated: 'Nov 12, 2026' },
  { id: 'm2', title: 'Content category tiles', status: 'Approved', updated: 'Nov 10, 2026' },
  { id: 'm3', title: 'Empty state illustration', status: 'In review', updated: 'Nov 9, 2026' },
];

export const workspaceItems: WorkspaceItem[] = [
  ...guidanceSeed.map((g) => ({ id: g.id, title: g.title, type: 'Guidance' as const, screen: 'guidance-content' as const, status: g.status, updated: g.updated, partner: false })),
  ...quizQuestionSeed.map((q) => ({ id: q.id, title: q.question, type: 'Quiz' as const, screen: 'quiz-content' as const, status: q.status, updated: q.updated, partner: false })),
  ...productSeed.map((p) => ({ id: p.id, title: p.name, type: 'Product' as const, screen: 'product-library' as const, status: p.informationStatus, updated: p.updated, partner: false })),
  ...knowledgeSourceSeed.map((s) => ({ id: s.id, title: s.title, type: 'Source' as const, screen: 'knowledge-sources' as const, status: s.status, updated: s.lastReviewed, partner: false })),
  ...partnerHighlightSeed.map((p) => ({ id: p.id, title: p.title, type: 'Partner' as const, screen: 'partner-highlights' as const, status: p.status, updated: p.updated, partner: true })),
  ...claimsSeed.map((c) => ({ id: `claims-${c.id}`, title: c.item, type: 'Claims and safety' as const, screen: 'claims-safety-review' as const, status: c.status, updated: c.updated, partner: false })),
  ...mediaSeed.map((m) => ({ id: `media-${m.id}`, title: m.title, type: 'Media' as const, screen: 'content' as const, status: m.status, updated: m.updated, partner: false })),
];

export const workspaceStatuses = Array.from(new Set(workspaceItems.map((i) => i.status)));

// Browse by area: the illustrated left column of the Content workspace (Content workspace
// visual reference, Nov 24, 2026). Each area opens the page that holds that content.
export type WorkspaceAreaImage = 'articles' | 'product' | 'app' | 'web' | 'partner';
export const workspaceAreas: { key: string; name: string; screen: AdminScreenId; image: WorkspaceAreaImage; note: string; partner?: boolean }[] = [
  { key: 'guidance', name: 'Guidance', screen: 'guidance-content', image: 'articles', note: 'Care how-tos, routines and guidance.' },
  { key: 'products', name: 'Products', screen: 'product-library', image: 'product', note: 'Product details, benefits and usage.' },
  { key: 'app', name: 'App content', screen: 'live-app', image: 'app', note: 'In-app education, tips and care support.' },
  { key: 'website', name: 'Website', screen: 'live-website', image: 'web', note: 'Public site content, articles and resources.' },
  { key: 'partner', name: 'Partner content', screen: 'partner-highlights', image: 'partner', note: 'Shared guidance, co-branded content and partner resources.', partner: true },
];

// More areas: compact text links under the five area cards, for the two content pages
// that have no area card. Link text is each page's own name.
export const workspaceMoreAreas: AdminScreenId[] = ['commercial-content', 'guidance-rules-review'];

// Contextual Content navigation (approved prototype): switches between the two Content views
export const contentNavCopy = {
  label: 'Content views',
  items: [
    { screen: 'content' as const, label: 'Content Workspace' },
    { screen: 'product-library' as const, label: 'Product Library' },
  ],
};

export const contentWorkspaceCopy = {
  heroTitle: 'Create and manage guidance',
  heroSubtitle: 'Draft, organize, review and publish trusted care content across Cuidance.',
  libraryEyebrow: 'Content library',
  libraryText: 'Create, edit, assign and prepare content for review.',
  newContent: 'New content',
  workspaceTitle: 'Content workspace',
  workspaceIntro: 'Every content item, with its type, status and last update.',
  count: (shown: number, total: number) => (shown === total ? `${total} items` : `${shown} of ${total} items`),
  searchLabel: 'Search content',
  searchPlaceholder: 'Search content by title or type',
  filter: 'Filter',
  filterCount: (n: number) => `Filter (${n})`,
  tableCaption: 'Content items (sample data)',
  columns: { title: 'Content', type: 'Type', status: 'Status', updated: 'Last updated' },
  partnerLabel: 'Partner',
  noResults: 'No content matches your search and filters.',
  clearAll: 'Clear search and filters',
  areasTitle: 'Browse by area',
  moreAreasTitle: 'More areas',
  sampleNote: 'Sample data. Nothing here is saved or published, and these screens are not part of participant testing.',
  filterDrawer: {
    title: 'Filter content',
    eyebrow: 'Content workspace',
    type: 'Content type',
    status: 'Status',
    reset: 'Reset',
    apply: 'Show results',
  },
  editor: {
    title: 'New content',
    eyebrow: 'Content workspace',
    description: 'Sample mode: your draft stays on this page and is not saved.',
    titleLabel: 'Title',
    titleError: 'Add a title.',
    typeLabel: 'Content type',
    bodyLabel: 'Draft',
    bodyHelper: 'Use "may fit" and "based on what you selected". Keep the evidence label and source link with every claim.',
    reviewerLabel: 'Send for review to',
    reviewerHelper: (who: string) => `You can choose ${who}. You can't review your own content.`,
    reviewerNone: 'Choose a reviewer',
    reviewerError: 'Choose a reviewer before sending for review.',
    priorityLabel: 'Priority',
    dueLabel: 'Due date',
    saveDraft: 'Save draft',
    send: 'Send for review',
    cancel: 'Cancel',
    savedDraft: (title: string) => `Draft saved on this page: ${title}.`,
    sent: (title: string, who: string) => `Sent for review to ${who}: ${title}. Sample mode, not saved.`,
  },
};
