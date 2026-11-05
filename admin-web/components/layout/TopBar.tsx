import { profilePlaceholder } from '../../../shared/content/profile';
import { ThemeMenu } from './ThemeMenu';
import styles from './TopBar.module.css';

// Top bar above every page: the Theme menu beside the profile area, as in the
// current prototype. Without JavaScript the Theme menu is hidden (it can't work)
// and the device setting applies.
export function TopBar() {
  return (
    <div className={styles.bar}>
      <noscript>
        <style>{`.${styles.theme} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.actions}>
        <div className={styles.theme}>
          <ThemeMenu id="admin-theme" />
        </div>
        <span className={styles.profile} role="img" aria-label={profilePlaceholder.label} title={profilePlaceholder.label}>
          <span aria-hidden="true">{profilePlaceholder.initials}</span>
        </span>
      </div>
    </div>
  );
}
