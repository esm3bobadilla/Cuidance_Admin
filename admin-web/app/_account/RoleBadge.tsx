import { roleIllustration } from '../../../shared/content/account-pages';
import { roleNames, type AdminRoleId } from '../../../shared/content/permissions';
import handsJar from '../../../shared/brand/illustrations/illus-hands-jar.png';
import archDrop from '../../../shared/brand/illustrations/illus-arch-drop.webp';
import leafHand from '../../../shared/brand/illustrations/illus-leaf-hand.png';
import roleSuperAdmin from '../../../shared/brand/illustrations/roles/role-super-admin.webp';
import roleAdmin from '../../../shared/brand/illustrations/roles/role-admin.webp';
import roleTeamMember from '../../../shared/brand/illustrations/roles/role-team-member.webp';
import styles from './account.module.css';

export const roleArt = { 'hands-jar': handsJar, 'arch-drop': archDrop, 'leaf-hand': leafHand };
// Visual Package 01: compact role markers for the Manage Team Role column only
const roleMarkers: Record<AdminRoleId, { src: string; width: number; height: number }> = { super_admin: roleSuperAdmin, admin: roleAdmin, team_member: roleTeamMember };
const roleClass: Record<AdminRoleId, string> = { super_admin: styles.roleSuper, admin: styles.roleAdmin, team_member: styles.roleTeam };

// Role illustration, role color and the role name in text (approved prototype)
export function RoleBadge({ role, marker = false }: { role: AdminRoleId; marker?: boolean }) {
  const art = marker ? roleMarkers[role] : roleArt[roleIllustration[role]];
  return (
    <span className={`${styles.role} ${roleClass[role]}`}>
      <img
        className={marker ? styles.roleMarker : styles.roleArt}
        src={art.src}
        width={marker ? Math.round((24 * art.width) / art.height) : 24}
        height={24}
        alt=""
      />
      {roleNames[role]}
    </span>
  );
}
