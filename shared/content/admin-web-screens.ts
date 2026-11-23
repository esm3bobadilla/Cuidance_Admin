/*
 * Admin Web screen names, parents and scope notes (Week 10 Step 2 route map).
 *
 * The single place these names are defined. Admin Web routes, breadcrumbs and
 * links read from here. See docs/Week-10/route-map.md for the route map and the
 * open wireframe questions for Team 03.
 */

import type { CuIconName } from '../brand/icons/cu-icons';

export type AdminScreenId =
  | 'dashboard'
  | 'content'
  | 'product-library'
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
  | 'settings'
  | 'profile'
  | 'manage-team'
  // Phase 2 PR 1: Communication (Email, Live App and Brand Website)
  | 'email'
  | 'live-app'
  | 'live-website'
  // Week 11 feature 2 and Phase A1: before the person enters Admin Web (no sidebar)
  | 'sign-in'
  | 'create-account'
  | 'forgot-password'
  | 'accept-invitation'
  | 'account-setup';

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
  // Shorter or clearer label where the sidebar lists the screen under its parent
  navName?: string;
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
    navName: 'Content Workspace',
  },
  // Phase 2 PR 1: product records inside Content (no separate sidebar item)
  'product-library': {
    id: 'product-library',
    name: 'Product Library',
    path: '/content/product-library/',
    parent: 'content',
    scopeNote:
      'Product records with ingredients, claims, sources, images and linked guidance. Product information only: no pricing, orders or availability.',
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
    name: 'Metrics',
    path: '/content-metrics/',
    parent: 'dashboard',
    scopeNote: 'App, Website and Communication numbers (sample data, not connected). Real analytics are deferred.',
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
  profile: {
    id: 'profile',
    name: 'Profile',
    path: '/profile/',
    parent: 'dashboard',
    scopeNote: 'Your profile, notifications and recent account activity.',
  },
  'manage-team': {
    id: 'manage-team',
    name: 'Manage Team',
    path: '/manage-team/',
    parent: 'dashboard',
    scopeNote: 'Workspace access, roles and invitations for the Cuidance team. Super Admins and Admins only.',
  },
  email: {
    id: 'email',
    name: 'Email',
    path: '/email/',
    parent: 'dashboard',
    scopeNote: 'Email templates, drafts and previews. Sample only: no email is sent or scheduled until an email provider is approved.',
  },
  'live-app': {
    id: 'live-app',
    name: 'Cuidance App',
    path: '/live/app/',
    parent: 'dashboard',
    scopeNote: 'A static preview of the Cuidance App and its update history. Sample only: nothing is pushed to the app.',
  },
  'live-website': {
    id: 'live-website',
    name: 'Brand Website',
    path: '/live/website/',
    parent: 'dashboard',
    scopeNote: 'A static preview of the Brand Website and its update history. Sample only: nothing is published.',
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    path: '/settings/',
    parent: 'dashboard',
    scopeNote: 'Internal settings for Admin Web.',
  },
  // Week 11 feature 2 (prototype only). No parent: these come before the Admin Web
  // screens, so they aren't in the sidebar or the breadcrumb trail.
  // Phase A1 (prototype only, sample mode): the Admin Web landing and sign-in entry
  'sign-in': {
    id: 'sign-in',
    name: 'Sign In',
    path: '/sign-in/',
    scopeNote: 'Sign in to Cuidance Admin Web. Prototype only: sign-in isn\'t connected yet.',
  },
  'create-account': {
    id: 'create-account',
    name: 'Create Account',
    path: '/create-account/',
    scopeNote: 'Accounts are invitation only. Find your invitation to set up your account. Prototype only.',
  },
  // Phase 3: Forgot password as its own screen (it was a toggle on Sign In)
  'forgot-password': {
    id: 'forgot-password',
    name: 'Forgot Password',
    path: '/forgot-password/',
    scopeNote: 'Ask for a link to choose a new password. In sample mode nothing is sent.',
  },
  'accept-invitation': {
    id: 'accept-invitation',
    name: 'Accept Invitation',
    path: '/accept-invitation/',
    scopeNote: 'Accept or decline an invitation to Cuidance Admin Web. Prototype only.',
  },
  'account-setup': {
    id: 'account-setup',
    name: 'Account Setup',
    path: '/account-setup/',
    scopeNote: 'Set up an Admin Web account after accepting an invitation. Prototype only.',
  },
};

// Week 11 feature 2 (Team 03 decision A8): these screens use the setup shell, with the
// logo and the Theme menu only. No sidebar, Menu, breadcrumb or profile. The sidebar
// starts once the person has set up their account and enters Admin Web.
export const setupScreens: AdminScreenId[] = ['sign-in', 'create-account', 'forgot-password', 'accept-invitation', 'account-setup'];

export function isSetupPath(pathname: string) {
  const current = pathname.replace(/\/+$/, '') || '/';
  return setupScreens.some((id) => (adminScreens[id].path.replace(/\/+$/, '') || '/') === current);
}

// Shown on every screen until its content is built
export const structureOnlyNote = 'Structure only. Screen content and data are not built yet.';

// Admin Web navigation (Phase B1 shell, from the approved Admin Web prototype).
// Sections and icons follow the prototype. Phase 2 PR 1: Content lists only Content
// Workspace and Product Library (content areas are types and filters inside the
// workspace), and the Communication section adds Email and Live (Cuidance App, Brand
// Website). Account Support and the area pages stay reachable from the Content
// Workspace, by URL and by workspace search.
export type NavItem = {
  // Unique key, also used for the expand state and element ids
  key: string;
  // The page the item opens
  id: AdminScreenId;
  label: string;
  icon: CuIconName;
  // Pages listed under the item when it's expanded
  children?: AdminScreenId[];
  // Shown only to roles the permission matrix allows (shared/content/permissions.ts)
  requires?: 'seeManageTeam';
};

export type NavSection = { key: string; label: string; items: NavItem[] };

export const adminNav: NavSection[] = [
  {
    key: 'main',
    label: 'Main',
    items: [
      { key: 'dashboard', id: 'dashboard', label: 'Dashboard', icon: 'home' },
      {
        key: 'content',
        id: 'content',
        label: 'Content',
        icon: 'doc',
        children: ['content', 'product-library'],
      },
      { key: 'review-tasks', id: 'review-tasks', label: 'Review Tasks', icon: 'review' },
      { key: 'metrics', id: 'content-metrics', label: 'Metrics', icon: 'bars' },
    ],
  },
  {
    key: 'communication',
    label: 'Communication',
    items: [
      { key: 'email', id: 'email', label: 'Email', icon: 'mail' },
      { key: 'live', id: 'live-app', label: 'Live', icon: 'live', children: ['live-app', 'live-website'] },
    ],
  },
  {
    key: 'account',
    label: 'Account',
    items: [
      { key: 'profile', id: 'profile', label: 'Profile', icon: 'person' },
      { key: 'manage-team', id: 'manage-team', label: 'Manage Team', icon: 'team', requires: 'seeManageTeam' },
      { key: 'settings', id: 'settings', label: 'Settings', icon: 'gear' },
    ],
  },
];

export const navCopy = {
  navLabel: 'Admin navigation',
  collapse: 'Collapse sidebar',
  expand: 'Expand sidebar',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  menuDialogLabel: 'Admin menu',
  home: 'Cuidance Admin home',
  expandItem: (label: string) => `Show ${label} pages`,
  collapseItem: (label: string) => `Hide ${label} pages`,
  signedInAs: 'Signed in as',
};

export const searchCopy = {
  label: 'Search workspace',
  placeholder: 'Search workspace',
  openSearch: 'Open search',
  closeSearch: 'Close search',
  noResults: (query: string) => `No pages match "${query}".`,
  resultCount: (count: number) => (count === 1 ? '1 page found.' : `${count} pages found.`),
  hint: 'Searches page names and descriptions in Admin Web.',
};

// Pages the workspace search can find: every screen except the setup pages
export function searchableScreens(): AdminScreen[] {
  return Object.values(adminScreens).filter((screen) => !setupScreens.includes(screen.id));
}

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

// Shared shell wording (current prototype). Breadcrumbs start at "Admin", which links to the Dashboard.
export const shellCopy = {
  breadcrumbRoot: 'Admin',
  // Eyebrow on screens aligned with the hi-fi references
  internalToolEyebrow: 'Internal tool',
  // Breadcrumb names for the two pages that aren't route-map screens
  devPreviewName: 'Component Preview',
  notFoundName: 'Page not found',
};
