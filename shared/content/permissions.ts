/*
 * Admin Web permission matrix (Phase B1, Team 03 decisions of Nov 16, 2026).
 *
 * Three roles: Super Admin, Admin and Team Member. This is an EXPLICIT matrix,
 * not a rename: every action is listed for every role. The database still stores
 * the legacy values (owner, admin, reviewer, content_editor) until the staged role
 * migration finishes (docs/Phase-B1/role-migration-plan.md); legacyRoleMap says how
 * each legacy value reads here. Nothing is removed from the database by this file.
 *
 * In sample mode this only shapes what the screens show. In Supabase mode, Row Level
 * Security stays the real boundary.
 */

export type AdminRoleId = 'super_admin' | 'admin' | 'team_member';

export const roleNames: Record<AdminRoleId, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  team_member: 'Team Member',
};

// How each stored legacy value reads during the staged migration
export const legacyRoleMap: Record<string, AdminRoleId> = {
  owner: 'super_admin',
  super_admin: 'super_admin',
  admin: 'admin',
  reviewer: 'team_member',
  content_editor: 'team_member',
  team_member: 'team_member',
};

export function toAdminRole(stored: string | null | undefined): AdminRoleId | null {
  return stored ? legacyRoleMap[stored] ?? null : null;
}

type Matrix = {
  // Navigation and pages
  seeManageTeam: boolean;
  editWorkspaceSettings: boolean;
  viewMetrics: boolean;
  // Team
  inviteAs: AdminRoleId[];
  changeRoles: boolean; // never their own, never the final Super Admin
  removeRoles: AdminRoleId[];
  // Content and review
  createContent: boolean;
  assignTo: AdminRoleId[];
  reassign: 'any' | 'own'; // own = only tasks they originally sent
  // Communication (sending and pushing are not built: provider and integrations not approved)
  emailDrafts: boolean;
  emailSend: boolean;
  livePush: 'all' | 'approved-only';
};

export const permissionMatrix: Record<AdminRoleId, Matrix> = {
  super_admin: {
    seeManageTeam: true,
    editWorkspaceSettings: true,
    viewMetrics: true,
    inviteAs: ['admin', 'team_member'],
    changeRoles: true,
    removeRoles: ['admin', 'team_member'],
    createContent: true,
    assignTo: ['admin', 'team_member'],
    reassign: 'any',
    emailDrafts: true,
    emailSend: true,
    livePush: 'all',
  },
  admin: {
    seeManageTeam: true,
    editWorkspaceSettings: false,
    viewMetrics: true,
    inviteAs: ['team_member'],
    changeRoles: false,
    removeRoles: ['team_member'],
    createContent: true,
    assignTo: ['admin', 'team_member'],
    reassign: 'any',
    emailDrafts: true,
    emailSend: true,
    livePush: 'all',
  },
  team_member: {
    seeManageTeam: false,
    editWorkspaceSettings: false,
    viewMetrics: true,
    inviteAs: [],
    changeRoles: false,
    removeRoles: [],
    createContent: true,
    assignTo: ['team_member'],
    reassign: 'own',
    emailDrafts: true,
    emailSend: false,
    livePush: 'approved-only',
  },
};

export function can(role: AdminRoleId | null) {
  return role ? permissionMatrix[role] : null;
}

// Whether someone may reassign a task: Super Admins and Admins any task, Team Members
// only tasks they originally sent.
export function canReassign(role: AdminRoleId | null, actorId: string, task: { sentBy: string }) {
  const m = can(role);
  if (!m) return false;
  return m.reassign === 'any' || task.sentBy === actorId;
}

// Reviewer separation (D4 plus the Nov 16 decision): only the assigned reviewer records a
// decision, and nobody, Super Admins included, approves content they wrote.
export function canDecide(actorId: string, task: { assigneeId: string; authorId: string }) {
  return task.assigneeId === actorId && task.authorId !== actorId;
}

// Who a role may pick as reviewer, given the people in the workspace. The content's
// author is never offered, so approvals stay separated.
export function assignableMembers<T extends { id: string; role: AdminRoleId; active: boolean }>(
  role: AdminRoleId | null,
  members: T[],
  authorId?: string,
): T[] {
  const allowed = can(role)?.assignTo ?? [];
  return members.filter((m) => m.active && allowed.includes(m.role) && m.id !== authorId);
}

// Plain-language rows for the Settings > Team access summary and Manage Team
export const permissionSummary: Record<AdminRoleId, string[]> = {
  super_admin: [
    'Full control of workspace settings',
    'Invite Admins and Team Members, and change roles',
    'Create and edit content',
    'Assign reviews to Admins and Team Members',
    'Review assigned content (never their own)',
    'View metrics',
  ],
  admin: [
    'Invite Team Members and remove Team Members',
    'Create and edit content',
    'Assign reviews to Admins and Team Members',
    'Review assigned content (never their own)',
    'View metrics',
  ],
  team_member: [
    'Create and edit content, and send it for review',
    'Assign reviews to Team Members, and reassign tasks they sent',
    'Review assigned content (never their own)',
    'Draft email (sending is for Admins)',
    'View metrics',
  ],
};
