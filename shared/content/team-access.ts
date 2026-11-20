/*
 * Settings: static Team Access presentation (prototype alignment, Batch 1).
 *
 * Source: the readable responsive prototype, Team Access (F09). Member roles,
 * statuses and "last active" values are taken from it, with these PROVISIONAL
 * changes:
 * - The prototype's people names are replaced by "Team member A" to "G", and
 *   their email addresses are left out. No real people.
 * - Role names use the approved three roles: Super Admin, Admin, Team Member
 *   (Phase 2 PR 1; permissions.ts and admin-roles.ts).
 * - Not built: Invite team member, Invitations, Edit role, Deactivate, the
 *   Team Access history and the role switcher. Invitations, account changes
 *   and permissions are deferred. Nothing here is enforced or saved.
 */
import type { AdminRoleId } from './permissions';

export type MemberStatus = 'Active' | 'Invitation pending' | 'Deactivated';

export type TeamMember = {
  id: string;
  name: string;
  role: AdminRoleId;
  status: MemberStatus;
  lastActive: string;
};

export const teamAccessCopy = {
  // Prototype eyebrow
  eyebrow: 'Internal tool',
  title: 'Team Access',
  // Prototype F09 wording
  description: 'Who can work in Cuidance Content Team and what each role can do.',
  filterLabel: 'Show members',
  all: 'All',
  tableCaption: 'Team members (sample data)',
  columns: { member: 'Member', role: 'Role', status: 'Status', lastActive: 'Last active' },
  // Prototype F09 boundary note
  boundary: 'Boundary: internal access management only. Provisional: role changes are not saved or enforced.',
  // PROVISIONAL state messages
  states: {
    loading: 'Loading team members…',
    empty: 'No team members yet.',
    emptyAction: 'Go to Dashboard',
    error: "Couldn't load team members. Check your connection, then reload the page.",
  },
};

export const memberStatuses: MemberStatus[] = ['Active', 'Invitation pending', 'Deactivated'];

export const teamMembersSeed: TeamMember[] = [
  { id: 'm1', name: 'Team member A', role: 'super_admin', status: 'Active', lastActive: 'Now' },
  { id: 'm2', name: 'Team member B', role: 'admin', status: 'Active', lastActive: '1h ago' },
  { id: 'm3', name: 'Team member C', role: 'admin', status: 'Active', lastActive: 'Today' },
  { id: 'm4', name: 'Team member D', role: 'team_member', status: 'Active', lastActive: 'Yesterday' },
  { id: 'm5', name: 'Team member E', role: 'team_member', status: 'Active', lastActive: 'Just joined' },
  { id: 'm6', name: 'Team member F', role: 'team_member', status: 'Invitation pending', lastActive: 'Invited Oct 30' },
  { id: 'm7', name: 'Team member G', role: 'team_member', status: 'Deactivated', lastActive: 'Sep 14' },
];
