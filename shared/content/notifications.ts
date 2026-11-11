/*
 * Profile / Notifications panel (Phase A1, sample mode): wording and sample notifications.
 *
 * SAMPLE DATA ONLY. Nothing is sent or delivered: there's no sign-in, email or
 * backend yet. Read and unread are kept in this browser tab only. Names are the
 * existing placeholders (Reviewer A to C, Team member A to G), not real people.
 * All wording is PROVISIONAL until Team 03 reviews it.
 */

export type SampleNotification = {
  id: string;
  message: string;
  // Shown as written
  when: string;
  // Path from the site root; the base path is added by the app
  href: string;
  // The state the sample starts in
  unread: boolean;
};

export const notificationsSeed: SampleNotification[] = [
  {
    id: 'n1',
    message: 'New task assigned to you: “Validate source support for claim”.',
    when: '2 hours ago',
    href: '/review-tasks/seed-5/',
    unread: true,
  },
  {
    id: 'n2',
    message: 'Changes were requested on “Review ingredient benefit wording”.',
    when: 'Today',
    href: '/review-tasks/seed-2/',
    unread: true,
  },
  {
    id: 'n3',
    message: '“Check partner disclosure is visible” is waiting on a Partner disclosure.',
    when: 'Yesterday',
    href: '/review-tasks/seed-4/',
    unread: false,
  },
  {
    id: 'n4',
    message: 'Team member F’s invitation is still pending.',
    when: 'Oct 30, 2026',
    href: '/settings/',
    unread: false,
  },
];

export const notificationsCopy = {
  heading: 'Notifications',
  sampleNote: 'Sample notifications. Nothing is sent or delivered yet.',
  unreadCount: (count: number) => (count === 0 ? 'No new notifications' : count === 1 ? '1 new' : `${count} new`),
  unreadLabel: 'New',
  readLabel: 'Read',
  markAllRead: 'Mark all as read',
  empty: 'You’re all caught up.',
  close: 'Close notifications',
  sidebarButton: 'Notifications',
};
