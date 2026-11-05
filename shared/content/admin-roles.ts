/*
 * Admin Web roles and the publishing rule, as approved by Team 03.
 *
 * This is a POLICY DESCRIPTION ONLY. There's no sign-in, no role assignment and
 * no permission enforcement yet: nothing here changes what anyone can do.
 */

export type AdminRole = {
  id: 'owner' | 'admin' | 'content-editor' | 'reviewer';
  name: string;
  // One line, used where space is short (for example a table cell)
  summary: string;
  can?: string[];
  cannot?: string[];
};

export const rolesCopy = {
  title: 'Roles and publishing',
  policyNote:
    "Policy description only. Roles aren't connected yet: there's no sign-in, and nothing here changes what anyone can do.",
  publishingRule: 'Admin and Main Admin / Owner publish approved content.',
  settingsNote: 'Other settings are not built yet.',
  canHeading: 'Can',
  cannotHeading: 'Cannot',
};

export const adminRoles: AdminRole[] = [
  {
    id: 'owner',
    name: 'Main Admin / Owner',
    summary: 'Publishes approved content.',
    can: ['Publish approved content.'],
  },
  {
    id: 'admin',
    name: 'Admin',
    summary: 'Publishes approved content.',
    can: ['Publish approved content.'],
  },
  {
    id: 'content-editor',
    name: 'Content Editor',
    // Team 03 hasn't supplied this role's permissions yet. Don't fill them in without that wording.
    summary: 'Details to be confirmed by Team 03.',
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    summary: 'Reviews assigned content, adds notes, and approves items or requests changes. Cannot publish.',
    can: ['Review assigned content.', 'Add notes.', 'Approve items.', 'Request changes.'],
    cannot: ['Publish independently.', 'Manage team members.', 'Assign roles.', 'Edit core content.'],
  },
];
