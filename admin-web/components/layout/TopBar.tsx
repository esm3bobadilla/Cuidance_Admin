'use client';

import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { adminScreens, navCopy, screenTrail, searchCopy, shellCopy, type AdminScreen } from '../../../shared/content/admin-web-screens';
import { liveReviewTaskRoute, reviewTaskDetailCopy, reviewTaskFromPath } from '../../../shared/content/review-task-detail';
import { Breadcrumb } from '../ui/Breadcrumb';
import { CuIcon } from '../ui/CuIcon';
import { ProfilePanel } from './ProfilePanel';
import { ThemeSwitch } from './ThemeSwitch';
import { WorkspaceSearch } from './WorkspaceSearch';
import styles from './TopBar.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const trimSlash = (path: string) => path.replace(/\/+$/, '') || '/';

// "Admin" first (it links to the Dashboard), then the screen's parents, ending with the screen.
// The Dashboard only appears when it's the current page, as in the prototype.
function crumbsFor(pathname: string) {
  const current = trimSlash(pathname);
  const root = { label: shellCopy.breadcrumbRoot, href: `${base}/` };
  const screen = Object.values(adminScreens).find((item: AdminScreen) => trimSlash(item.path) === current);
  if (screen) {
    const trail = screenTrail(screen.id).filter((item) => item.id !== 'dashboard' || screen.id === 'dashboard');
    return [root, ...trail.map((item) => ({ label: item.name, href: item.id === screen.id ? undefined : `${base}${item.path}` }))];
  }
  // Week 11: a review task's detail page sits under Review Tasks
  const task = reviewTaskFromPath(current);
  if (task) {
    const reviewTasks = adminScreens['review-tasks'];
    return [root, { label: reviewTasks.name, href: `${base}${reviewTasks.path}` }, { label: task.item }];
  }
  // Phase A2: the live task page (Supabase mode). Its title loads with the data, so the crumb is generic
  if (current === trimSlash(liveReviewTaskRoute)) {
    const reviewTasks = adminScreens['review-tasks'];
    return [root, { label: reviewTasks.name, href: `${base}${reviewTasks.path}` }, { label: reviewTaskDetailCopy.fallbackTitle }];
  }
  return [root, { label: current === '/dev' ? shellCopy.devPreviewName : shellCopy.notFoundName }];
}

type TopBarProps = {
  // Logo for the phone top bar (it sits on the page background, unlike the sidebar logo)
  logo: ReactNode;
  menuOpen: boolean;
  onOpenMenu: () => void;
};

// Shared top bar (Phase B1, approved prototype): breadcrumb, workspace search, then the
// theme controls and the profile button (Profile / Notifications panel).
// Under 768 px: Menu, logo, Search, Theme and profile; Search opens the field on its own row.
// Without JavaScript, Menu, Search, the theme controls and the profile panel are hidden.
export function TopBar({ logo, menuOpen, onOpenMenu }: TopBarProps) {
  const crumbs = crumbsFor(usePathname() ?? '/');
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={`app-bar ${styles.bar}`} data-search-open={searchOpen}>
      <noscript>
        <style>{`.${styles.menuButton}, .${styles.searchToggle}, .${styles.search}, .${styles.actions} { display: none !important; }`}</style>
      </noscript>

      <div className={styles.start}>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={navCopy.openMenu}
          aria-expanded={menuOpen}
          aria-controls="admin-menu"
          aria-haspopup="dialog"
          onClick={onOpenMenu}
        >
          <CuIcon name="menu" variant="badge" size={40} />
        </button>
        <span className={styles.logo}>{logo}</span>
      </div>

      <div className={styles.crumbs}>
        <Breadcrumb items={crumbs} />
      </div>

      <div className={styles.search}>
        <WorkspaceSearch />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.searchToggle}
          aria-label={searchOpen ? searchCopy.closeSearch : searchCopy.openSearch}
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <CuIcon name={searchOpen ? 'close' : 'search'} variant="badge" size={40} />
        </button>
        <ThemeSwitch />
        <ProfilePanel />
      </div>
    </header>
  );
}
