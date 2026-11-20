import { adminScreens } from '../../../shared/content/admin-web-screens';
import { contentNavCopy as copy } from '../../../shared/content/content-workspace';
import styles from './contentNav.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Contextual Content navigation (approved prototype, Phase 2 PR 1): Content Workspace and
// Product Library are two views of Content, not separate sidebar items. The current view
// is marked with aria-current, the dark pill and a check mark (not color alone).
export function ContentNav({ current }: { current: 'content' | 'product-library' }) {
  return (
    <nav aria-label={copy.label} className={styles.nav}>
      <ul className={styles.list}>
        {copy.items.map((item) => {
          const on = item.screen === current;
          return (
            <li key={item.screen}>
              <a className={styles.link} href={`${base}${adminScreens[item.screen].path}`} aria-current={on ? 'page' : undefined}>
                {on && (
                  <span aria-hidden="true" className={styles.mark}>
                    ✓
                  </span>
                )}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
