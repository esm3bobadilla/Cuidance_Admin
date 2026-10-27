/*
 * Admin Web screen names, parents and scope notes (Week 10 Step 2 route map).
 *
 * The single place these names are defined. Admin Web routes, breadcrumbs and
 * links read from here. See docs/Week-10/route-map.md for the route map and the
 * open wireframe questions for Team 03.
 */

export type AdminScreenId =
  | 'dashboard'
  | 'content'
  | 'quiz-content'
  | 'guidance-content'
  | 'product-information'
  | 'knowledge-sources'
  | 'partner-highlights'
  | 'commercial-content'
  | 'guidance-rules-review'
  | 'claims-safety-review'
  | 'content-metrics'
  | 'account-support'
  | 'review-tasks'
  | 'settings';

export type AdminScreen = {
  id: AdminScreenId;
  name: string;
  // Path from the site root, with the trailing slash the static export uses
  path: string;
  // Parent screen. Top-level screens sit under Dashboard.
  parent?: AdminScreenId;
  scopeNote: string;
  // Screens linked from this one, for the connected review path
  related?: AdminScreenId[];
};

export const adminScreens: Record<AdminScreenId, AdminScreen> = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/',
    scopeNote: 'The landing page. Each Admin Web section starts here.',
  },
  content: {
    id: 'content',
    name: 'Content',
    path: '/content/',
    parent: 'dashboard',
    scopeNote: 'Parent section for the content the Cuidance team reviews and maintains. Choose a content area below.',
  },
  'quiz-content': {
    id: 'quiz-content',
    name: 'Quiz Content',
    path: '/content/quiz-content/',
    parent: 'content',
    scopeNote: 'Questions, answer cards and mixing rules for the Cuidance quiz.',
    related: ['review-tasks'],
  },
  // Visually verified against the current Guidance Content hi-fi reference (Week 10 Step 2)
  'guidance-content': {
    id: 'guidance-content',
    name: 'Guidance Content',
    path: '/content/guidance-content/',
    parent: 'content',
    scopeNote: 'Review educational articles, care guidance, and explanations that help people make better-informed choices.',
  },
  'product-information': {
    id: 'product-information',
    name: 'Product Information',
    path: '/content/product-information/',
    parent: 'content',
    scopeNote:
      'Product types for Barcode / Label Lookup. Product lookup only. Availability and retailer information are future scope (VERIFY).',
  },
  'knowledge-sources': {
    id: 'knowledge-sources',
    name: 'Knowledge Sources',
    path: '/content/knowledge-sources/',
    parent: 'content',
    scopeNote: 'Source links behind each guidance claim, with their evidence labels.',
  },
  'partner-highlights': {
    id: 'partner-highlights',
    name: 'Partner Highlights',
    path: '/content/partner-highlights/',
    parent: 'content',
    scopeNote: 'Partner content, always labeled "Partner" and kept separate from guidance.',
  },
  'commercial-content': {
    id: 'commercial-content',
    name: 'Commercial Content',
    path: '/content/commercial-content/',
    parent: 'content',
    scopeNote: 'Commercial labels and disclosures (Partner, Sponsored), kept separate from guidance.',
  },
  'guidance-rules-review': {
    id: 'guidance-rules-review',
    name: 'Guidance Rules Review',
    path: '/guidance-rules-review/',
    parent: 'dashboard',
    scopeNote: 'Review of the rules that build a guidance result. Admin Web never generates picks for people.',
  },
  'claims-safety-review': {
    id: 'claims-safety-review',
    name: 'Claims & Safety Review',
    path: '/claims-safety-review/',
    parent: 'dashboard',
    scopeNote:
      'Guidance claims with their evidence labels and source links, plus safety notes. The emergency line stays on every result. No diagnosis or medical review.',
  },
  'content-metrics': {
    id: 'content-metrics',
    name: 'Content Metrics',
    path: '/content-metrics/',
    parent: 'dashboard',
    scopeNote: 'A limited internal view of content activity. No analytics expansion.',
  },
  'account-support': {
    id: 'account-support',
    name: 'Account Support',
    path: '/account-support/',
    parent: 'dashboard',
    scopeNote: 'A limited internal support view. No public user-account management.',
  },
  'review-tasks': {
    id: 'review-tasks',
    name: 'Review Tasks',
    path: '/review-tasks/',
    parent: 'dashboard',
    scopeNote: 'Tasks for the Cuidance team to review content before it reaches the public app.',
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    path: '/settings/',
    parent: 'dashboard',
    scopeNote: 'Internal settings for Admin Web.',
  },
};

// Shown on every screen until its content is built
export const structureOnlyNote = 'Structure only. Screen content and data are not built yet.';

// Top-level sections in navigation order. Content is the only parent with child pages.
export const topLevelScreenIds: AdminScreenId[] = [
  'content',
  'guidance-rules-review',
  'claims-safety-review',
  'content-metrics',
  'account-support',
  'review-tasks',
  'settings',
];

// Persistent sidebar (confirmed by Team 03, Week 10 Step 2), in display order.
// Commercial Content keeps its route but stays out of the sidebar until Team 03 confirms it.
export type SidebarItem = {
  id: AdminScreenId;
  children?: AdminScreenId[];
};

export const sidebarNav: SidebarItem[] = [
  { id: 'dashboard' },
  {
    id: 'content',
    children: ['quiz-content', 'guidance-content', 'product-information', 'knowledge-sources', 'partner-highlights'],
  },
  { id: 'guidance-rules-review' },
  { id: 'claims-safety-review' },
  { id: 'content-metrics' },
  { id: 'account-support' },
  { id: 'review-tasks' },
  { id: 'settings' },
];

export function childScreens(id: AdminScreenId): AdminScreen[] {
  return Object.values(adminScreens).filter((screen) => screen.parent === id);
}

// Dashboard first, ending with the screen itself
export function screenTrail(id: AdminScreenId): AdminScreen[] {
  const trail: AdminScreen[] = [];
  for (let screen: AdminScreen | undefined = adminScreens[id]; screen; screen = screen.parent ? adminScreens[screen.parent] : undefined) {
    trail.unshift(screen);
  }
  return trail;
}
