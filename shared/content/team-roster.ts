/*
 * Sample workspace roster for Phase B1 screens (Manage Team, Assign task, Content owner).
 * Placeholder names only ("Team member A" and so on), no emails, no real people.
 * Roles use the Phase B1 permission matrix (permissions.ts). Sample mode only: in
 * Supabase mode, the members come from the database.
 */
import type { AdminRoleId } from './permissions';

export type RosterMember = {
  id: string;
  name: string;
  initials: string;
  role: AdminRoleId;
  status: 'Active' | 'Invited' | 'Deactivated';
  lastActive: string;
  active: boolean;
};

export const sampleWorkspaceName = 'Cuidance Content Team (sample)';

export const teamRoster: RosterMember[] = [
  { id: 'sample-me', name: 'Team member (you)', initials: 'TM', role: 'super_admin', status: 'Active', lastActive: 'Just now', active: true },
  { id: 'm-a', name: 'Team member A', initials: 'A', role: 'super_admin', status: 'Active', lastActive: 'Today', active: true },
  { id: 'm-b', name: 'Team member B', initials: 'B', role: 'admin', status: 'Active', lastActive: '12 min ago', active: true },
  { id: 'm-c', name: 'Team member C', initials: 'C', role: 'admin', status: 'Active', lastActive: 'Today', active: true },
  { id: 'm-d', name: 'Team member D', initials: 'D', role: 'team_member', status: 'Active', lastActive: 'Yesterday', active: true },
  { id: 'm-e', name: 'Team member E', initials: 'E', role: 'team_member', status: 'Active', lastActive: '2 days ago', active: true },
  { id: 'm-f', name: 'Team member F', initials: 'F', role: 'team_member', status: 'Invited', lastActive: 'Pending', active: false },
];

export const memberName = (id: string) => teamRoster.find((m) => m.id === id)?.name ?? id;
