import { adminRoles, rolesCopy } from '../../../shared/content/admin-roles';
import { Card } from '../ui/Card';
import styles from './RolesPolicy.module.css';

// Static policy card: the approved role wording and publishing rule.
// Used in Settings and the /dev/ preview. Nothing here checks or enforces permissions.
export function RolesPolicy({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const RoleHeading = `h${headingLevel + 1}` as 'h3' | 'h4';
  const ListHeading = `h${headingLevel + 2}` as 'h4' | 'h5';
  return (
    <Card title={rolesCopy.title} headingLevel={headingLevel}>
      <p className={styles.note}>{rolesCopy.policyNote}</p>
      <p className={styles.rule}>{rolesCopy.publishingRule}</p>
      <ul className={styles.roles}>
        {adminRoles.map((role) => (
          <li key={role.id} className={styles.role}>
            <RoleHeading className={styles.roleName}>{role.name}</RoleHeading>
            <p className={styles.summary}>{role.summary}</p>
            {(role.can || role.cannot) && (
              <div className={styles.lists}>
                {role.can && (
                  <div>
                    <ListHeading className={styles.listHeading}>{rolesCopy.canHeading}</ListHeading>
                    <ul className={styles.items}>
                      {role.can.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {role.cannot && (
                  <div>
                    <ListHeading className={styles.listHeading}>{rolesCopy.cannotHeading}</ListHeading>
                    <ul className={styles.items}>
                      {role.cannot.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
