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
  livePreviewPending: 'Preview not available yet. It arrives with the Live phase.',
  activityTitle: 'Recent activity',
  activityNote: 'Sample data. Not connected to live activity.',
};

export type GlanceCard = {
  key: 'review' | 'email' | 'app' | 'web';
  label: string;
  // null = filled in from live review data (Items for review)
  value: string | null;
  detail: string;
  sample: boolean;
};

export const glanceCards: GlanceCard[] = [
  { key: 'review', label: 'Items for review', value: null, detail: 'Open tasks in the review queue', sample: false },
  { key: 'email', label: 'Scheduled communication', value: '4', detail: 'Email sending is not connected yet', sample: true },
  { key: 'app', label: 'App updates live', value: '3', detail: 'Cuidance App (sample)', sample: true },
  { key: 'web', label: 'Website updates', value: '5', detail: '2 awaiting publish (sample)', sample: true },
];

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
  { key: 'app', name: 'Cuidance App', state: 'Live', detail: 'iOS and Android · v2.4.0 · 2 updates ready (sample)', icon: 'phone' as CuIconName },
  { key: 'web', name: 'Brand Website', state: 'Live', detail: 'Homepage and care guides · 2 awaiting publish (sample)', icon: 'web' as CuIconName },
];
