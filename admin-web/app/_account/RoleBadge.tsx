import { roleNames, type AdminRoleId } from '../../../shared/content/permissions';
import roleSuperAdmin from '../../../shared/brand/illustrations/roles/role-super-admin.webp';
import roleAdmin from '../../../shared/brand/illustrations/roles/role-admin.webp';
import roleTeamMember from '../../../shared/brand/illustrations/roles/role-team-member.webp';
import styles from './account.module.css';

// Visual Package 01 role markers (Manage Team Role column and Roles card)
const roleMarkers: Record<AdminRoleId, { src: string; width: number; height: number }> = {
  super_admin: roleSuperAdmin,
  admin: roleAdmin,
  team_member: roleTeamMember,
};
const roleClass: Record<AdminRoleId, string> = { super_admin: styles.roleSuper, admin: styles.roleAdmin, team_member: styles.roleTeam };

// Role marker (decorative), role color and the role name in text (approved prototype)
export function RoleBadge({ role }: { role: AdminRoleId }) {
  const art = roleMarkers[role];
  return (
    <span className={`${styles.role} ${roleClass[role]}`}>
      <img className={styles.roleMarker} src={art.src} width={Math.round((24 * art.width) / art.height)} height={24} alt="" />
      {roleNames[role]}
    </span>
  );
}
