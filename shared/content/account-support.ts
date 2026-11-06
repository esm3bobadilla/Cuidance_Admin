/*
 * Account Support screen: wording and SAMPLE DATA (final alignment batch).
 *
 * Source: the approved Week 9 hi-fi screenshot of Account Support (attached Nov 6,
 * 2026). Ticket IDs, request types, masked user references, statuses, dates and
 * the first request's details are taken from it as shown, with these PROVISIONAL
 * changes:
 * - Staff names are replaced by "Team member A" to "D".
 * - User references stay masked exactly as in the hi-fi. No full emails,
 *   passwords or other personal information.
 * - "Close ticket", "Mark as resolved" and the top-bar search and notifications
 *   aren't built: the screen is read-only, with no approved support flow.
 * - The hi-fi shows details for one request only; the others show "To be
 *   confirmed by Team 03."
 * Limited internal support view only (CLAUDE.md): no account management.
 */

export type SupportStatus = 'New' | 'In progress' | 'Waiting for user' | 'Resolved';

export type SupportRequest = {
  id: string;
  ticket: string;
  requestType: string;
  userReference: string;
  status: SupportStatus;
  assignedTo: string;
  updated: string;
  details?: { summary: string; internalNotes: string; notesUpdated: string; nextAction: string };
};

export const accountSupportCopy = {
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  searchLabel: 'Search requests',
  searchPlaceholder: 'Search by ticket ID or masked email (e.g. u***@mail.com)',
  statusLabel: 'Status',
  allStatuses: 'All statuses',
  typeLabel: 'Request type',
  allTypes: 'All request types',
  requests: (n: number) => `${n} ${n === 1 ? 'request' : 'requests'}`,
  tableCaption: 'Account support requests (sample data)',
  columns: { ticket: 'Ticket ID', requestType: 'Request type', userReference: 'User reference', status: 'Status', assignedTo: 'Assigned to', updated: 'Last updated' },
  detail: {
    heading: 'Request details',
    userReference: 'User reference',
    summary: 'Request summary',
    privacy: 'Privacy note',
    internalNotes: 'Internal notes',
    nextAction: 'Next action',
    assignedTo: 'Assigned to',
    pending: 'To be confirmed by Team 03.',
  },
  // Hi-fi privacy note, shown for every request
  privacyNote: 'Protect user privacy. Do not request or view passwords, full email addresses, or sensitive personal information in support communications.',
  states: {
    loading: 'Loading support requests…',
    empty: 'No support requests right now.',
    emptyAction: 'Go to Dashboard',
    error: "Couldn't load support requests. Check your connection, then reload the page.",
    noResults: 'No requests match your search or filters.',
    clear: 'Clear search and filters',
  },
};

export const supportStatuses: SupportStatus[] = ['New', 'In progress', 'Waiting for user', 'Resolved'];

export const supportRequestSeed: SupportRequest[] = [
  {
    id: 's1',
    ticket: '#AS-10432',
    requestType: 'Cannot access account',
    userReference: 'u***@gmail.com',
    status: 'New',
    assignedTo: 'Team member A',
    updated: 'Oct 14, 2024 10:24 AM',
    details: {
      summary: 'User reports they are unable to sign in to their account. They see an error message and cannot access their account on web or mobile.',
      internalNotes:
        'User confirmed account email. Appears to be a sign-in error after recent password reset. Asked user to try clearing browser cache and confirm they are using the correct email. Waiting for their reply.',
      notesUpdated: 'Last updated by Team member A · Oct 14, 2024, 11:02 AM',
      nextAction: 'Follow up with user for their response. If issue persists, escalate to Platform team.',
    },
  },
  { id: 's2', ticket: '#AS-10431', requestType: 'Privacy settings question', userReference: 'p***@outlook.com', status: 'In progress', assignedTo: 'Team member B', updated: 'Oct 14, 2024 9:02 AM' },
  { id: 's3', ticket: '#AS-10430', requestType: 'Request to update account details', userReference: 'm***@yahoo.com', status: 'Waiting for user', assignedTo: 'Team member C', updated: 'Oct 13, 2024 4:37 PM' },
  { id: 's4', ticket: '#AS-10429', requestType: 'Guest preview question', userReference: 'u***@gmail.com', status: 'Resolved', assignedTo: 'Team member D', updated: 'Oct 12, 2024 2:18 PM' },
  { id: 's5', ticket: '#AS-10428', requestType: 'Cannot access account', userReference: 'l***@hotmail.com', status: 'In progress', assignedTo: 'Team member A', updated: 'Oct 11, 2024 11:06 AM' },
  { id: 's6', ticket: '#AS-10427', requestType: 'Privacy settings question', userReference: 'd***@gmail.com', status: 'Resolved', assignedTo: 'Team member B', updated: 'Oct 10, 2024 3:21 PM' },
];
