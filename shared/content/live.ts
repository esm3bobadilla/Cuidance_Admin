/*
 * Live: Cuidance App and Brand Website (Communication / Live), Phase 2 PR 1.
 *
 * From the approved Admin Web prototype. STATIC PREVIEWS AND SAMPLE DATA ONLY: nothing is
 * pushed to the app, published to the website or sent to any service. Publishing and push
 * integrations are deferred, so "Publish" never changes anything here.
 *
 * People are sample roster placeholders. Partner items keep their "Partner" label.
 * Roles (permissions.ts): everyone views previews, prepares updates and submits them for
 * review; Team Members edit only their own updates. Only Super Admins and Admins approve,
 * request changes, publish (not connected) and archive. No one approves their own update.
 */

export type LiveSurface = 'app' | 'website';
export type LiveStatus = 'draft' | 'review' | 'changes' | 'ready' | 'published' | 'archived';

export type LiveHistoryEntry = { what: string; whoId: string; when: string };

export type LiveUpdate = {
  id: string;
  surface: LiveSurface;
  title: string;
  area: string;
  summary: string;
  // What the preview shows when this update is previewed
  previewHeadline: string;
  partner: boolean;
  status: LiveStatus;
  ownerId: string;
  updated: string;
  changeNote: string;
  history: LiveHistoryEntry[];
};

// Link to the Brand Website prototype. VERIFY: Team 03 to confirm the address. While it is
// empty, the screen says the link isn't set yet instead of guessing an address.
export const brandWebsitePrototypeUrl = '';

export const liveAreas = ['Guidance', 'Quiz', 'Partner', 'Homepage', 'Article', 'Footer', 'Onboarding'];

export const liveStatusMeta: Record<LiveStatus, { label: string; icon: 'doc' | 'review' | 'alert' | 'check' | 'live' | 'lock' }> = {
  draft: { label: 'Draft', icon: 'doc' },
  review: { label: 'In review', icon: 'review' },
  changes: { label: 'Needs changes', icon: 'alert' },
  ready: { label: 'Ready to publish', icon: 'check' },
  published: { label: 'Published', icon: 'live' },
  archived: { label: 'Archived', icon: 'lock' },
};

export const liveCurrent: Record<LiveSurface, { headline: string; facts: { label: string; value: string }[] }> = {
  app: {
    headline: 'Beauty guidance that fits you.',
    facts: [
      { label: 'Version', value: '2.4.0 (sample)' },
      { label: 'Last update', value: 'Nov 12 by Team member C' },
      { label: 'Platforms', value: 'iOS and Android' },
    ],
  },
  website: {
    headline: 'Thoughtful guidance for everyday care.',
    facts: [
      { label: 'Address', value: 'Brand Website (sample)' },
      { label: 'Last publish', value: 'Nov 11 by Team member B' },
      { label: 'Pages', value: 'Home, About, Explore, What is new' },
    ],
  },
};

export const liveUpdatesSeed: LiveUpdate[] = [
  {
    id: 'a1',
    surface: 'app',
    title: 'Quiz answer choices for "Which care areas"',
    area: 'Quiz',
    summary: 'Adds a "Not sure yet" answer so people can continue without choosing an area.',
    previewHeadline: 'Explore what may fit, at your own pace.',
    partner: false,
    status: 'review',
    ownerId: 'm-d',
    updated: 'Today',
    changeNote: '',
    history: [
      { what: 'Submitted for review', whoId: 'm-d', when: 'Today, 9:12 AM' },
      { what: 'Draft created', whoId: 'm-d', when: 'Yesterday' },
    ],
  },
  {
    id: 'a2',
    surface: 'app',
    title: 'Building a simple morning routine (new section)',
    area: 'Guidance',
    summary: 'A short guidance section with three steps and the evidence label for each claim.',
    previewHeadline: 'A simple morning routine, one step at a time.',
    partner: false,
    status: 'ready',
    ownerId: 'm-e',
    updated: 'Yesterday',
    changeNote: '',
    history: [
      { what: 'Approved', whoId: 'm-b', when: 'Yesterday, 4:40 PM' },
      { what: 'Submitted for review', whoId: 'm-e', when: 'Nov 18' },
    ],
  },
  {
    id: 'a3',
    surface: 'app',
    title: 'Mineral sunscreen spotlight card',
    area: 'Partner',
    summary: 'A partner card in the Explore tab. It must carry the "Partner" label and stay separate from guidance.',
    previewHeadline: 'Partner spotlight: mineral sunscreen.',
    partner: true,
    status: 'changes',
    ownerId: 'm-d',
    updated: 'Nov 18',
    changeNote: 'Add the "Partner" label to the card title and move it below the guidance results.',
    history: [
      { what: 'Changes requested', whoId: 'm-c', when: 'Nov 18' },
      { what: 'Submitted for review', whoId: 'm-d', when: 'Nov 17' },
    ],
  },
  {
    id: 'a4',
    surface: 'app',
    title: 'Welcome screen wording refresh',
    area: 'Onboarding',
    summary: 'Shorter welcome text that explains what Cuidance helps with.',
    previewHeadline: 'Guidance shaped around what you choose to share.',
    partner: false,
    status: 'draft',
    ownerId: 'm-d',
    updated: 'Nov 16',
    changeNote: '',
    history: [{ what: 'Draft created', whoId: 'm-d', when: 'Nov 16' }],
  },
  {
    id: 'a5',
    surface: 'app',
    title: 'Understanding sensitive skin (article update)',
    area: 'Guidance',
    summary: 'Updated source links and evidence labels.',
    previewHeadline: 'Beauty guidance that fits you.',
    partner: false,
    status: 'published',
    ownerId: 'm-e',
    updated: 'Nov 12',
    changeNote: '',
    history: [
      { what: 'Published (sample)', whoId: 'm-c', when: 'Nov 12' },
      { what: 'Approved', whoId: 'm-c', when: 'Nov 11' },
    ],
  },
  {
    id: 'a6',
    surface: 'app',
    title: 'Autumn banner',
    area: 'Onboarding',
    summary: 'Seasonal banner, replaced by the welcome refresh.',
    previewHeadline: 'Autumn care, explained.',
    partner: false,
    status: 'archived',
    ownerId: 'm-e',
    updated: 'Oct 30',
    changeNote: '',
    history: [{ what: 'Archived', whoId: 'm-b', when: 'Oct 30' }],
  },
  {
    id: 'w1',
    surface: 'website',
    title: 'Homepage hero: winter routine',
    area: 'Homepage',
    summary: 'A seasonal homepage headline with the same supportive tone.',
    previewHeadline: 'A calmer winter routine, one step at a time.',
    partner: false,
    status: 'review',
    ownerId: 'm-d',
    updated: 'Today',
    changeNote: '',
    history: [
      { what: 'Submitted for review', whoId: 'm-d', when: 'Today, 8:30 AM' },
      { what: 'Draft created', whoId: 'm-d', when: 'Nov 18' },
    ],
  },
  {
    id: 'w2',
    surface: 'website',
    title: 'Sunscreen basics article',
    area: 'Article',
    summary: 'A new article on the Explore page with sources and evidence labels.',
    previewHeadline: 'Sunscreen basics for everyday use.',
    partner: false,
    status: 'ready',
    ownerId: 'm-e',
    updated: 'Yesterday',
    changeNote: '',
    history: [
      { what: 'Approved', whoId: 'm-b', when: 'Yesterday' },
      { what: 'Submitted for review', whoId: 'm-e', when: 'Nov 17' },
    ],
  },
  {
    id: 'w3',
    surface: 'website',
    title: 'Partner disclosure footer',
    area: 'Footer',
    summary: 'Footer text that explains how Partner content is labeled.',
    previewHeadline: 'Thoughtful guidance for everyday care.',
    partner: true,
    status: 'changes',
    ownerId: 'm-e',
    updated: 'Nov 17',
    changeNote: 'Use the approved disclosure wording from Commercial Content.',
    history: [
      { what: 'Changes requested', whoId: 'm-a', when: 'Nov 17' },
      { what: 'Submitted for review', whoId: 'm-e', when: 'Nov 15' },
    ],
  },
  {
    id: 'w4',
    surface: 'website',
    title: 'About page: how we review content',
    area: 'Article',
    summary: 'Explains evidence labels and that Cuidance never gives medical advice.',
    previewHeadline: 'How Cuidance reviews every piece of guidance.',
    partner: false,
    status: 'draft',
    ownerId: 'm-d',
    updated: 'Nov 15',
    changeNote: '',
    history: [{ what: 'Draft created', whoId: 'm-d', when: 'Nov 15' }],
  },
  {
    id: 'w5',
    surface: 'website',
    title: 'Homepage hero: everyday care',
    area: 'Homepage',
    summary: 'The current homepage headline.',
    previewHeadline: 'Thoughtful guidance for everyday care.',
    partner: false,
    status: 'published',
    ownerId: 'm-e',
    updated: 'Nov 11',
    changeNote: '',
    history: [
      { what: 'Published (sample)', whoId: 'm-b', when: 'Nov 11' },
      { what: 'Approved', whoId: 'm-b', when: 'Nov 10' },
    ],
  },
  {
    id: 'w6',
    surface: 'website',
    title: 'Spring landing page',
    area: 'Homepage',
    summary: 'Last season\'s landing page.',
    previewHeadline: 'Spring care, explained.',
    partner: false,
    status: 'archived',
    ownerId: 'm-e',
    updated: 'Sep 2',
    changeNote: '',
    history: [{ what: 'Archived', whoId: 'm-a', when: 'Sep 2' }],
  },
];

export const liveCopy = {
  eyebrow: 'Live',
  navLabel: 'Live previews',
  nav: { app: 'Cuidance App', website: 'Brand Website' },
  title: { app: 'Cuidance App', website: 'Brand Website' },
  description: {
    app: 'A static preview of the Cuidance App, with the updates waiting to go live.',
    website: 'A static preview of the Brand Website, with the updates waiting to go live.',
  },
  sampleNote: 'Static preview with sample data. Nothing is pushed to the app or published to the website.',
  accessLabel: 'Your access to Live updates',
  roleNote: {
    super_admin: 'As a Super Admin, you can prepare, approve and archive updates. Publishing is not connected yet.',
    admin: 'As an Admin, you can prepare, approve and archive updates. Publishing is not connected yet.',
    team_member: 'As a Team Member, you can view previews, prepare updates, edit your own and submit them for review.',
  },
  prepare: 'Prepare update',
  preview: {
    heading: 'Current preview',
    stateLabel: 'Preview',
    current: 'Current (live, sample)',
    next: 'With updates ready to publish',
    unavailable: 'Preview unavailable',
    showing: (title: string) => `Previewing "${title}". Not live.`,
    backToCurrent: 'Back to current preview',
    liveBadge: { app: 'Live (sample)', website: 'Published (sample)' },
    phoneLabel: 'Smartphone showing the Cuidance App (static preview)',
    phoneAlt: 'Cuidance App welcome screen: Beauty guidance that fits you, with a Create account button',
    browserLabel: 'Browser window showing the Brand Website (static preview)',
    address: 'Brand Website (sample)',
    siteNav: ['Home', 'About Cuidance', 'Explore', 'What is new'],
    siteEyebrow: 'Hair care · Skin care · Makeup · Body care',
    siteBody:
      'Cuidance is a mobile app for people of every gender, background and experience level. It offers clear, educational guidance so you can learn what may fit before deciding.',
    siteHelps: 'How Cuidance helps',
    siteHelpItems: ['Guidance based on what you choose to share', 'Ingredient notes in plain words', 'Try the quiz before making an account'],
    openPrototype: 'Open the Brand Website prototype',
    openPrototypeNew: '(opens in a new tab)',
    prototypeNotSet: 'Brand Website prototype link not set yet (VERIFY with Team 03).',
    unavailableTitle: 'This preview is unavailable.',
    unavailableBody: 'The static preview could not be shown. The update history below still works.',
  },
  history: {
    heading: 'Update history',
    statusFilter: 'Show',
    allActive: 'All except archived',
    all: 'All, including archived',
    count: (n: number) => (n === 1 ? '1 update' : `${n} updates`),
    open: (title: string) => `View details for ${title}`,
    openShort: 'View details',
    previewShort: 'View preview',
    previewLabel: (title: string) => `View preview of ${title}`,
    partner: 'Partner',
    owner: 'Prepared by',
    updated: 'Updated',
  },
  states: {
    loading: 'Loading the preview and update history…',
    errorTitle: 'Live updates could not load.',
    errorBody: 'Nothing was changed. Try again in a moment.',
    retry: 'Try again',
    emptyTitle: 'No updates yet.',
    emptyBody: 'Prepare an update to see it here, from draft to ready to publish.',
    noMatch: 'No updates match this filter.',
  },
  drawer: {
    eyebrow: { app: 'Cuidance App update', website: 'Brand Website update' },
    newTitle: 'Prepare update',
    editTitle: 'Edit update',
    close: 'Close update',
    summary: 'What changes',
    area: 'Area',
    owner: 'Prepared by',
    updated: 'Last updated',
    previewText: 'Preview headline',
    history: 'History',
    changeNote: 'Requested changes',
  },
  form: {
    title: 'Update title (required)',
    area: 'Area',
    summary: 'What changes (required)',
    summaryHelper: 'Plain wording. Partner content keeps its "Partner" label.',
    previewHeadline: 'Preview headline',
    previewHelper: 'Shown in the preview when this update is previewed.',
    partner: 'This is Partner content',
  },
  errors: {
    title: 'Enter a title.',
    summary: 'Describe what changes.',
    note: 'Add a short note explaining what needs to change.',
  },
  actions: {
    saveDraft: 'Save draft',
    submit: 'Submit for review',
    edit: 'Edit',
    approve: 'Approve',
    requestChanges: 'Request changes',
    publish: 'Publish',
    archive: 'Archive',
    viewPreview: 'View preview',
    cancel: 'Cancel',
  },
  notes: {
    publishOff: 'Publishing is not connected yet, so Publish is turned off. Approved updates wait here as Ready to publish.',
    team: 'Approval, publishing and archiving are for Admins and Super Admins.',
    notOwner: (owner: string) => `Team Members edit their own updates. ${owner} prepared this one.`,
    ownContent: 'You prepared this update, so another Admin or Super Admin approves it.',
    archived: 'Archived updates are read-only.',
    published: 'Published updates are read-only. Prepare a new update to change it.',
  },
  busy: { saving: 'Saving…', submitting: 'Submitting for review…', approving: 'Approving…', requesting: 'Requesting changes…', archiving: 'Archiving…' },
  done: {
    saved: (title: string) => `"${title}" saved as a draft.`,
    submitted: (title: string) => `"${title}" submitted for review.`,
    approved: (title: string) => `"${title}" approved. It is ready to publish once publishing is connected.`,
    changes: (owner: string) => `Changes requested. ${owner} can update it and resubmit.`,
    archived: (title: string) => `"${title}" archived.`,
  },
  archiveDialog: {
    title: (t: string) => `Archive "${t}"?`,
    body: 'It leaves the active update history. Nothing changes in the app or on the website.',
    confirm: 'Archive update',
    cancel: 'Keep update',
  },
  changesDialog: {
    title: (t: string) => `Request changes to "${t}"`,
    body: (owner: string) => `${owner} will see your note and can update it and resubmit.`,
    noteLabel: 'What needs to change (required)',
    confirm: 'Request changes',
    cancel: 'Cancel',
  },
};
