/*
 * Consolidated Content workspace (Phase B1, Team 03 decision: one Content workspace).
 *
 * One list of every content item from the existing sample data, with search, filters
 * and a New content editor. Sample mode only: nothing is saved or published. Each row
 * links to the existing content page that holds its details.
 * Partner items keep their "Partner" label and stay separate from guidance.
 */
import type { AdminScreenId } from './admin-web-screens';
import { guidanceSeed } from './guidance-content';
import { knowledgeSourceSeed } from './knowledge-sources';
import { partnerHighlightSeed } from './partner-highlights';
import { productSeed } from './product-information';
import { quizQuestionSeed } from './quiz-content';

export type WorkspaceType = 'Guidance' | 'Quiz' | 'Product information' | 'Source' | 'Partner';

export type WorkspaceItem = {
  id: string;
  title: string;
  type: WorkspaceType;
  screen: AdminScreenId;
  status: string;
  updated: string;
  partner: boolean;
};

export const workspaceTypes: WorkspaceType[] = ['Guidance', 'Quiz', 'Product information', 'Source', 'Partner'];

export const workspaceItems: WorkspaceItem[] = [
  ...guidanceSeed.map((g) => ({ id: g.id, title: g.title, type: 'Guidance' as const, screen: 'guidance-content' as const, status: g.status, updated: g.updated, partner: false })),
  ...quizQuestionSeed.map((q) => ({ id: q.id, title: q.question, type: 'Quiz' as const, screen: 'quiz-content' as const, status: q.status, updated: q.updated, partner: false })),
  ...productSeed.map((p) => ({ id: p.id, title: p.name, type: 'Product information' as const, screen: 'product-information' as const, status: p.informationStatus, updated: p.updated, partner: false })),
  ...knowledgeSourceSeed.map((s) => ({ id: s.id, title: s.title, type: 'Source' as const, screen: 'knowledge-sources' as const, status: s.status, updated: s.lastReviewed, partner: false })),
  ...partnerHighlightSeed.map((p) => ({ id: p.id, title: p.title, type: 'Partner' as const, screen: 'partner-highlights' as const, status: p.status, updated: p.updated, partner: true })),
];

export const workspaceStatuses = Array.from(new Set(workspaceItems.map((i) => i.status)));

// Category tiles (approved prototype illustrations)
export const workspaceAreas: { screen: AdminScreenId; image: 'quiz' | 'articles' | 'product' | 'review' | 'saved' | 'media'; note: string }[] = [
  { screen: 'quiz-content', image: 'quiz', note: 'Questions, answer cards and mixing rules' },
  { screen: 'guidance-content', image: 'articles', note: 'Articles, care guidance and explanations' },
  { screen: 'product-information', image: 'product', note: 'Product lookup only' },
  { screen: 'knowledge-sources', image: 'saved', note: 'Sources and evidence labels' },
  { screen: 'partner-highlights', image: 'media', note: 'Labeled "Partner", kept separate' },
  { screen: 'commercial-content', image: 'review', note: 'Commercial labels and disclosures' },
];

export const contentWorkspaceCopy = {
  heroTitle: 'Create and manage guidance',
  heroSubtitle: 'Draft, organize, review and publish trusted care content across Cuidance.',
  libraryEyebrow: 'Content library',
  libraryText: 'Create, edit, assign and prepare content for review.',
  newContent: 'New content',
  workspaceTitle: 'Content workspace',
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
