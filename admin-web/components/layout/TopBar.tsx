'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { adminScreens, screenTrail, shellCopy, type AdminScreen } from '../../../shared/content/admin-web-screens';
import { reviewTaskFromPath } from '../../../shared/content/review-task-detail';
import { Breadcrumb } from '../ui/Breadcrumb';
import { Button } from '../ui/Button';
import { ProfileMenu } from './ProfileMenu';
import { ThemeMenu } from './ThemeMenu';
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
  return [root, { label: current === '/dev' ? shellCopy.devPreviewName : shellCopy.notFoundName }];
}

type TopBarProps = {
  // Logo for the phone top row (it sits on the page background, unlike the sidebar logo)
  logo: ReactNode;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

// Shared top bar (current prototype): breadcrumb on the left, the Theme menu and profile on the right.
// Under 768 px: Menu, logo, Theme and profile; the breadcrumb is hidden there, as in the prototype.
// Without JavaScript, Menu, Theme and the profile menu are hidden (they can't work).
export function TopBar({ logo, menuOpen, onToggleMenu }: TopBarProps) {
  const crumbs = crumbsFor(usePathname() ?? '/');

  return (
    <header className={`app-bar ${styles.bar}`}>
      <noscript>
        <style>{`.${styles.menuButton}, .${styles.actions} { display: none !important; }`}</style>
      </noscript>

      <div className={styles.start}>
        <div className={styles.menuButton}>
          <Button variant="secondary" aria-expanded={menuOpen} aria-controls="admin-sidebar" onClick={onToggleMenu}>
            {shellCopy.menuButton}
          </Button>
        </div>
        {logo}
      </div>

      <div className={styles.crumbs}>
        <Breadcrumb items={crumbs} />
      </div>

      <div className={styles.actions}>
        <ThemeMenu id="admin-theme" />
        <ProfileMenu id="admin-profile" />
      </div>
    </header>
  );
}
