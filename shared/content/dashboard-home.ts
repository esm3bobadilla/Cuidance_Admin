/*
 * Dashboard (Phase B1, approved Admin Web prototype): hero, Today at a glance,
 * Quick work and Recent activity. Wording and sample values only.
 *
 * Sample values are clearly labeled. Email and Live are deferred (no provider or
 * integrations approved), so their glance cards show sample numbers and link nowhere.
 * Names are placeholders (Team member A, B, C), never real staff.
 */

import type { AdminScreenId } from './admin-web-screens';
import type { CuIconName } from '../brand/icons/cu-icons';

export const dashboardHomeCopy = {
  eyebrow: 'Cuidance Admin',
  greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', fallback: 'Welcome back' },
  subtitle: 'Guidance that helps beauty feel clearer.',
  glanceTitle: 'Today at a glance',
  sampleBadge: 'Sample data',
  quickWorkTitle: 'Quick work',
  quickWorkNote: (role: string) => `Shortcuts for ${role}`,
  liveTitle: 'Live status',
  liveNote: 'Sample status for layout review. Not connected to the Cuidance App or Brand Website.',
  liveStateLabel: (state: string) => `${state} (sample)`,
  // Phase 2 PR 1: the static Live previews exist, so the rows link to them
  livePreviewLink: (name: string) => `Open the ${name} preview`,
  activityTitle: 'Recent activity',
  activityNote: 'Sample data. Not connected to live activity.',
};

// Phase 2 PR 2: the Email, App and Website numbers come from the demo (this browser
// session), so Email and Live actions change them. Items for review stays the review queue,
// and its detail adds the product records awaiting approval in the demo.
export type GlanceCard = {
  key: 'review' | 'email' | 'app' | 'web';
  label: string;
  detail: string;
  demo: boolean;
};

export const glanceCards: GlanceCard[] = [
  { key: 'review', label: 'Items for review', detail: 'Open tasks in the review queue', demo: false },
  { key: 'email', label: 'Scheduled communication', detail: 'Demo mode: not sent for real', demo: true },
  { key: 'app', label: 'App updates ready', detail: 'Publishing unavailable in demo mode', demo: true },
  { key: 'web', label: 'Website updates ready', detail: 'Publishing unavailable in demo mode', demo: true },
];

export const glanceDemoCopy = {
  badge: 'Demo data',
  productsAwaiting: (n: number) => (n === 1 ? 'Plus 1 product record awaiting approval (demo)' : `Plus ${n} product records awaiting approval (demo)`),
};

export type QuickLink = {
  label: string;
  icon: CuIconName;
  screen: AdminScreenId;
  // Extra query, e.g. to open the New content drawer
  query?: string;
  requires?: 'seeManageTeam';
};

export const quickLinks: QuickLink[] = [
  { label: 'New content', icon: 'doc', screen: 'content', query: '?new=1' },
  { label: 'Open review queue', icon: 'review', screen: 'review-tasks' },
  { label: 'Create an email', icon: 'mail', screen: 'email', query: '?new=1' },
  { label: 'Preview Cuidance App', icon: 'phone', screen: 'live-app' },
  { label: 'Preview Brand Website', icon: 'web', screen: 'live-website' },
  { label: 'View metrics', icon: 'bars', screen: 'content-metrics' },
  { label: 'Manage team', icon: 'team', screen: 'manage-team', requires: 'seeManageTeam' },
];

export const recentActivity = [
  { who: 'Team member A', what: 'drafted', item: 'Understanding sensitive skin', area: 'Content', when: '12 min ago' },
  { who: 'Team member B', what: 'requested changes on', item: 'Ingredient benefit wording', area: 'Review task', when: '1 hr ago' },
  { who: 'Team member C', what: 'approved', item: 'Partner disclosure overview', area: 'Review task', when: 'Yesterday' },
];

// Live status (approved prototype). Sample values only: Live publishing and previews are
// deferred, so these rows link nowhere.
export const liveStatus = [
  { key: 'app', screen: 'live-app' as AdminScreenId, name: 'Cuidance App', state: 'Live', detail: (ready: number) => `iOS and Android · v2.4.0 · ${ready} ${ready === 1 ? 'update' : 'updates'} ready (demo)`, icon: 'phone' as CuIconName },
  { key: 'web', screen: 'live-website' as AdminScreenId, name: 'Brand Website', state: 'Live', detail: (ready: number) => `Homepage and care guides · ${ready} awaiting publish (demo)`, icon: 'web' as CuIconName },
];
