/*
 * Email workspace (Communication / Email), Phase 2 PR 1.
 *
 * From the approved Admin Web prototype and the Week 12 email visual package.
 * SAMPLE DATA ONLY: no email provider is connected (D6, Option C). Nothing is sent,
 * scheduled, uploaded or saved: "Send" and "Schedule" only change the sample status on
 * this page, after a confirmation that says so.
 *
 * Changes from the prototype: people are placeholders ("Team member F"), never real
 * names, and every link uses example.com, which is reserved for samples.
 * Roles (permissions.ts): everyone drafts and previews; only Super Admins and Admins
 * send, schedule, archive templates and cancel scheduled email.
 */

export type EmailTemplateId = 'invite' | 'welcome' | 'nudge' | 'reset';
export type EmailStatus = 'draft' | 'scheduled' | 'sent';

export type EmailTemplate = {
  id: EmailTemplateId;
  name: string;
  description: string;
  category: string;
  subject: string;
  audience: string;
  heading: string;
  body: string;
  button: string;
  link: string;
  // Default image: the approved card illustration (shared/brand/illustrations/email)
  imageAlt: string;
  // Optional Week 12 email parts, shown in the preview: inbox preview text, the small
  // label above the headline, and the support line above the footer
  preheader?: string;
  eyebrow?: string;
  support?: string;
};

export type EmailDoc = {
  id: string;
  template: EmailTemplateId;
  name: string;
  subject: string;
  audience: string;
  heading: string;
  body: string;
  button: string;
  link: string;
  status: EmailStatus;
  // Shown as written: "Nov 18, 9:00 AM" or "Sent Jun 2"
  when: string;
  // Sample roster id (team-roster.ts). Team Members edit and delete their own drafts.
  ownerId: string;
};

const ex = 'https://example.com/';

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'invite',
    name: 'Invite',
    description: 'Bring a new team member into the workspace.',
    category: 'Invitation',
    // Polished sample invitation (Week 12 email direction, Nov 24, 2026). Sample only
    subject: 'You’re invited to Cuidance Admin',
    audience: 'New team member',
    heading: 'Your Cuidance workspace is ready',
    body: 'You’ve been invited to join Cuidance Admin, a shared workspace for creating, reviewing, and maintaining trusted beauty guidance.\n\nStart by accepting your invitation and exploring the work prepared for your team.',
    button: 'Accept invitation',
    link: `${ex}admin/invitation`,
    imageAlt: 'Illustration of a sealed envelope with an invitation card',
    preheader: 'Review guidance, product information, and team updates in one workspace.',
    eyebrow: 'INVITATION · CUIDANCE ADMIN',
    support: 'This invitation is intended for the invited recipient and may expire. If you need help, contact your workspace administrator.',
  },
  {
    id: 'welcome',
    name: 'Welcome',
    description: 'Help a new team member get started.',
    category: 'Onboarding',
    subject: 'Welcome to Cuidance Admin',
    audience: 'New team members',
    heading: 'Welcome to the team',
    body: 'Here is where to find your review queue, content workspace and live previews. Your first tasks are waiting.',
    button: 'Open Cuidance Admin',
    link: `${ex}admin`,
    imageAlt: 'Illustration of an open guidebook with a bookmark',
  },
  {
    id: 'nudge',
    name: 'Nudge',
    description: 'Remind a reviewer about pending work.',
    category: 'Reminder',
    subject: 'You have reviews waiting',
    audience: 'Reviewers with open tasks',
    heading: 'A few reviews are waiting',
    body: 'You have items in your review queue that are due this week. A quick look keeps App and Website updates moving.',
    button: 'Open review queue',
    link: `${ex}admin/review-tasks`,
    imageAlt: 'Illustration of a bell',
  },
  {
    id: 'reset',
    name: 'Password reset',
    description: 'Help a team member reset access securely.',
    category: 'Security',
    subject: 'Reset your Cuidance Admin password',
    audience: 'Requesting team member',
    heading: 'Reset your password',
    body: 'We received a request to reset your password. This link expires in 30 minutes. If you did not ask for this, you can ignore this email.',
    button: 'Reset password',
    link: `${ex}admin/reset`,
    imageAlt: 'Illustration of a checklist with a padlock',
  },
];

export const emailCategories = Array.from(new Set(emailTemplates.map((t) => t.category)));

export const emailAudiences = [
  'New team member',
  'New team members',
  'Reviewers with open tasks',
  'Requesting team member',
  'All team members',
];

const fromTemplate = (id: EmailTemplateId) => {
  const t = emailTemplates.find((x) => x.id === id)!;
  return { template: id, subject: t.subject, audience: t.audience, heading: t.heading, body: t.body, button: t.button, link: t.link };
};

export const emailSeed: EmailDoc[] = [
  { id: 'e1', ...fromTemplate('welcome'), name: 'Welcome · Team member F', status: 'draft', when: '', ownerId: 'm-d' },
  { id: 'e2', ...fromTemplate('invite'), name: 'Invite · Winter reviewers', status: 'draft', when: '', ownerId: 'm-b' },
  { id: 'e3', ...fromTemplate('nudge'), name: 'Nudge · Pending reviews', status: 'scheduled', when: 'Nov 23, 9:00 AM', ownerId: 'm-b' },
  { id: 'e4', ...fromTemplate('nudge'), name: 'Nudge · Partner disclosures', status: 'scheduled', when: 'Nov 24, 9:00 AM', ownerId: 'm-c' },
  { id: 'e5', ...fromTemplate('welcome'), name: 'Welcome · November cohort', status: 'scheduled', when: 'Nov 25, 8:30 AM', ownerId: 'm-a' },
  { id: 'e6', ...fromTemplate('invite'), name: 'Invite · Team member E', status: 'sent', when: 'Sent Jun 2', ownerId: 'm-a' },
  { id: 'e7', ...fromTemplate('reset'), name: 'Password reset · Team member C', status: 'sent', when: 'Sent Oct 26', ownerId: 'm-b' },
  { id: 'e8', ...fromTemplate('welcome'), name: 'Welcome · Team member D', status: 'sent', when: 'Sent Mar 4', ownerId: 'm-a' },
];

export const emailStatusMeta: Record<EmailStatus, { label: string; icon: 'doc' | 'calendar' | 'check' }> = {
  draft: { label: 'Draft', icon: 'doc' },
  scheduled: { label: 'Scheduled', icon: 'calendar' },
  sent: { label: 'Sent (demo)', icon: 'check' },
};

export const emailCopy = {
  heroTitle: 'Email',
  heroDescription: 'Prepare invitations, reminders and helpful guidance for your team, with a preview of every message.',
  newEmail: 'New email',
  accessLabel: 'Your access to email',
  roleNote: {
    super_admin: 'As a Super Admin, you can draft, preview, send and schedule email, and manage templates.',
    admin: 'As an Admin, you can draft, preview, send and schedule email, and manage templates.',
    team_member: 'As a Team Member, you can view templates, create and edit your drafts, and preview email. An Admin or Super Admin sends and schedules.',
  },
  tabsLabel: 'Email views',
  tabs: { templates: 'Templates', drafts: 'Drafts', scheduled: 'Scheduled', sent: 'Sent' },
  searchLabel: 'Search email',
  searchPlaceholder: 'Search by name, template or category',
  categoryLabel: 'Category',
  allCategories: 'All categories',
  showArchived: 'Show archived templates',
  count: (n: number) => (n === 1 ? '1 email' : `${n} emails`),
  templateCount: (n: number) => (n === 1 ? '1 template' : `${n} templates`),
  listCaption: (tab: string) => `${tab} (sample data)`,
  columns: { name: 'Email', audience: 'Audience', when: 'When', status: 'Status', actions: 'Actions' },
  notScheduled: 'Not scheduled',
  archivedLabel: 'Archived',
  templateActions: {
    preview: (name: string) => `Preview the ${name} template`,
    // Starts with the visible "Use template" (WCAG 2.5.3 Label in Name)
    use: (name: string) => `Use template: write an email from the ${name} template`,
    duplicate: (name: string) => `Duplicate the ${name} template to Drafts`,
    archive: (name: string) => `Archive the ${name} template`,
    restore: (name: string) => `Restore the ${name} template`,
    previewShort: 'Preview',
    useShort: 'Use template',
    duplicateShort: 'Duplicate',
    archiveShort: 'Archive',
    restoreShort: 'Restore',
  },
  rowActions: {
    edit: (name: string) => `Edit ${name}`,
    preview: (name: string) => `Preview ${name}`,
    duplicate: (name: string) => `Duplicate ${name}`,
    delete: (name: string) => `Delete ${name}`,
    cancel: (name: string) => `Cancel scheduled email ${name}`,
    editShort: 'Edit',
    previewShort: 'Preview',
    duplicateShort: 'Duplicate',
    deleteShort: 'Delete',
    cancelShort: 'Cancel scheduled',
  },
  states: {
    loading: 'Loading email…',
    errorTitle: 'Email could not load.',
    errorBody: 'Nothing was changed. Try again in a moment.',
    retry: 'Try again',
    noMatchTitle: 'Nothing matches this search.',
    noMatchBody: 'Try a different search or category.',
    clear: 'Clear search and category',
    empty: {
      templates: 'No templates yet.',
      drafts: 'No drafts yet. Start one from a template or with New email.',
      scheduled: 'Nothing is scheduled.',
      sent: 'Nothing has been sent yet.',
    },
  },
  editor: {
    back: 'Back to Email',
    newTitle: 'New email',
    editTitle: 'Edit email',
    previewTitle: 'Preview email',
    modeLabel: 'Editor view',
    edit: 'Edit',
    preview: 'Preview',
    readOnly: 'This email is read-only here. Duplicate it to reuse it.',
    fromTemplate: (name: string) => `Template: ${name}`,
    fields: 'Email details',
    name: 'Email name (required)',
    nameHelper: 'Only your team sees this name.',
    subject: 'Subject (required)',
    audience: 'Audience',
    heading: 'Heading',
    body: 'Body',
    bodyHelper: 'Plain, supportive wording. Say "may fit", never "best" or "fix".',
    button: 'Button text',
    link: 'Destination link',
    linkHelper: 'Starts with https://',
    image: 'Email image',
    templateImage: 'Uses the template illustration. Upload an image to replace it.',
    templateAlt: 'Template image alt text (required)',
    previewLabel: 'Email preview',
    previewFrom: 'From: Cuidance Admin (sample)',
    previewTo: (audience: string) => `To: ${audience}`,
    previewSubject: (subject: string) => `Subject: ${subject}`,
    previewFooter: 'You are receiving this because you are part of the Cuidance Content Team. Sample preview only.',
    previewPreheader: (text: string) => `Preview text: ${text}`,
    previewSample: 'Sample email · not sent',
    deviceLabel: 'Preview width',
    devices: { desktop: 'Desktop', mobile: 'Mobile' },
    deviceNote: (device: string) => `Showing the ${device.toLowerCase()} preview.`,
    status: 'Status',
    when: 'When',
  },
  errors: {
    name: 'Enter an email name.',
    subject: 'Enter a subject.',
    link: 'Enter a full link that starts with https://',
    alt: 'Add alt text before saving this email image.',
    templateAlt: 'Add alt text for the template image.',
    when: 'Choose a date and time in the future.',
    summary: (n: number) => (n === 1 ? 'Check 1 field before saving.' : `Check ${n} fields before saving.`),
  },
  actions: {
    saveDraft: 'Save draft',
    send: 'Send email',
    schedule: 'Schedule',
    duplicate: 'Duplicate',
    delete: 'Delete draft',
  },
  notes: {
    teamLock: 'Team Members can save email drafts. An Admin or Super Admin schedules and sends.',
    notOwner: 'You can preview this draft. Its owner or an Admin edits it. Duplicate it to make your own copy.',
    sent: 'Already sent. Duplicate it to reuse it.',
    noProvider: 'Demo mode: sending and scheduling ask for confirmation first, and nothing is delivered. No email provider is connected.',
    altBlocked: 'Add alt text before saving this email image.',
  },
  busy: { saving: 'Saving draft…', sending: 'Marking as sent…', scheduling: 'Scheduling…' },
  done: {
    saved: (name: string) => `"${name}" saved to Drafts.`,
    sent: (name: string) => `"${name}" marked as sent. Demo mode: not delivered.`,
    scheduled: (name: string, when: string) => `"${name}" scheduled for ${when}. Demo mode: not scheduled for real.`,
    duplicated: (name: string) => `Duplicated as "${name}" in Drafts.`,
    templateDuplicated: (name: string) => `${name} template duplicated to Drafts.`,
    deleted: (name: string) => `"${name}" deleted.`,
    archived: (name: string) => `${name} template archived. It no longer appears in Templates.`,
    restored: (name: string) => `${name} template restored.`,
    cancelled: (name: string) => `"${name}" is no longer scheduled. It is back in Drafts. Demo mode: nothing was queued.`,
  },
  copySuffix: ' (copy)',
  dialogs: {
    send: {
      title: (name: string) => `Send "${name}"?`,
      body: (audience: string) =>
        `It would go to: ${audience}. Sample only: no email provider is connected, so nothing is delivered. The email moves to Sent.`,
      confirm: 'Mark as sent',
      cancel: 'Keep editing',
    },
    schedule: {
      title: (name: string) => `Schedule "${name}"`,
      body: 'Sample only: no email provider is connected, so nothing will be sent. The email moves to Scheduled.',
      whenLabel: 'Date and time (required)',
      confirm: 'Schedule email',
      cancel: 'Cancel',
    },
    delete: {
      title: (name: string) => `Delete "${name}"?`,
      body: 'The draft is removed from this page. This cannot be undone.',
      confirm: 'Delete draft',
      cancel: 'Keep draft',
    },
    archive: {
      title: (name: string) => `Archive the ${name} template?`,
      body: 'It leaves Templates. Existing drafts keep their content. You can restore it later.',
      confirm: 'Archive template',
      cancel: 'Keep template',
    },
    cancelScheduled: {
      title: (name: string) => `Cancel "${name}"?`,
      body: 'It will not be sent at the scheduled time. It moves back to Drafts so you can edit it.',
      confirm: 'Cancel scheduled email',
      cancel: 'Keep scheduled',
    },
  },
};
