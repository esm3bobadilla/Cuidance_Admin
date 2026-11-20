/*
 * Admin Web roles, as approved by Team 03 (Nov 16, 2026): Super Admin, Admin and
 * Team Member. Built from the permission matrix (permissions.ts), so the role names
 * and summaries are defined once.
 *
 * The database may still store the legacy values (owner, admin, reviewer,
 * content_editor) until the staged role migration finishes. roleFor() reads any stored
 * value through the same explicit mapping, so a legacy value shows its new name.
 * Content Editor stays reserved (D3) and is never offered.
 */

import { permissionSummary, roleNames, toAdminRole, type AdminRoleId } from './permissions';

export type AdminRole = {
  id: AdminRoleId;
  name: string;
  // One line, used where space is short (for example a table cell or an invitation)
  summary: string;
  can: string[];
  cannot: string[];
};

export const rolesCopy = {
  title: 'Roles and permissions',
  policyNote: 'Three roles. In Supabase mode the database rules enforce them; this card only describes them.',
  publishingRule:
    'Super Admins and Admins approve, publish and archive. Team Members create content, prepare updates and submit them for review.',
  settingsNote: 'Other settings are not built yet.',
  canHeading: 'Can',
  cannotHeading: 'Cannot',
};

const summaries: Record<AdminRoleId, string> = {
  super_admin: 'Full access, including workspace settings, roles and every approval.',
  admin: 'Invites Team Members, approves content, and sends email and updates.',
  team_member: 'Creates content and drafts, and submits them for review. Cannot approve, publish or send.',
};

const cannot: Record<AdminRoleId, string[]> = {
  super_admin: ['Approve content they created.', 'Remove or demote the final Super Admin.'],
  admin: ['Change workspace settings.', 'Invite or change Admins.', 'Approve content they created.'],
  team_member: [
    'Approve, publish or archive.',
    'Send or schedule email.',
    'Manage team members or roles.',
    'Approve content they created.',
  ],
};

export const adminRoles: AdminRole[] = (['super_admin', 'admin', 'team_member'] as const).map((id) => ({
  id,
  name: roleNames[id],
  summary: summaries[id],
  can: permissionSummary[id],
  cannot: cannot[id],
}));

// The approved role for any stored value, legacy values included
export function roleFor(stored: string | null | undefined): AdminRole | undefined {
  const id = toAdminRole(stored);
  return id ? adminRoles.find((role) => role.id === id) : undefined;
}
