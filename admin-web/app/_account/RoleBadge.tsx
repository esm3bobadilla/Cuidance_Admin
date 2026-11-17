import { roleIllustration } from '../../../shared/content/account-pages';
import { roleNames, type AdminRoleId } from '../../../shared/content/permissions';
import handsJar from '../../../shared/brand/illustrations/illus-hands-jar.png';
import archDrop from '../../../shared/brand/illustrations/illus-arch-drop.webp';
import leafHand from '../../../shared/brand/illustrations/illus-leaf-hand.png';
import styles from './account.module.css';

export const roleArt = { 'hands-jar': handsJar, 'arch-drop': archDrop, 'leaf-hand': leafHand };
const roleClass: Record<AdminRoleId, string> = { super_admin: styles.roleSuper, admin: styles.roleAdmin, team_member: styles.roleTeam };

// Role illustration, role color and the role name in text (approved prototype)
export function RoleBadge({ role }: { role: AdminRoleId }) {
  const art = roleArt[roleIllustration[role]];
  return (
    <span className={`${styles.role} ${roleClass[role]}`}>
      <img className={styles.roleArt} src={art.src} width={24} height={24} alt="" />
      {roleNames[role]}
    </span>
  );
}
