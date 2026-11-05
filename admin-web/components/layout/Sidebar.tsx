'use client';

import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { adminScreens, sidebarNav, type AdminScreenId } from '../../../shared/content/admin-web-screens';
import { Button } from '../ui/Button';
import styles from './Sidebar.module.css';
import { ThemePreference } from './ThemePreference';

type SidebarProps = {
  // The logo, rendered by the layout so the approved image files stay in one place
  logo: ReactNode;
};

const trimSlash = (path: string) => path.replace(/\/+$/, '') || '/';

// Plain links need the GitHub Pages base path added by hand
const hrefFor = (id: AdminScreenId) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens[id].path}`;

// Persistent Admin Web sidebar (confirmed by Team 03). On narrow screens the same
// list sits behind a Menu button, with the Theme control at the bottom. Without
// JavaScript the list stays visible and the Theme control is hidden (it can't work).
export function Sidebar({ logo }: SidebarProps) {
  const current = trimSlash(usePathname() ?? '/');
  const isCurrent = (id: AdminScreenId) => trimSlash(adminScreens[id].path) === current;
  const isWithin = (id: AdminScreenId) => current.startsWith(`${trimSlash(adminScreens[id].path)}/`);

  const [menuOpen, setMenuOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(isCurrent('content') || isWithin('content'));

  return (
    <div className={styles.sidebar}>
      <noscript>
        <style>{`.${styles.menuArea}, .${styles.nav}, .${styles.children} { display: flex !important; } .${styles.menuButton}, .${styles.toggle}, .${styles.themeArea} { display: none !important; }`}</style>
      </noscript>

      <div className={styles.top}>
        {logo}
        <div className={styles.menuButton}>
          <Button
            variant="secondary"
            aria-expanded={menuOpen}
            aria-controls="admin-sidebar-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
          </Button>
        </div>
      </div>

      {/* Navigation and the Theme control: always shown from 768 px up, behind Menu below that */}
      <div id="admin-sidebar-menu" className={styles.menuArea} data-open={menuOpen}>
        <nav id="admin-sidebar-nav" aria-label="Admin Web" className={styles.nav}>
          <ul className={styles.list}>
            {sidebarNav.map((item) => {
              const screen = adminScreens[item.id];
              const childListId = `admin-sidebar-${item.id}`;
              const holdsCurrent = isWithin(item.id) && item.id !== 'dashboard';
              return (
                <li key={item.id}>
                  <div className={styles.row}>
                    <a
                      className={`${styles.link} ${holdsCurrent ? styles.parentOfCurrent : ''}`}
                      href={hrefFor(item.id)}
                      aria-current={isCurrent(item.id) ? 'page' : undefined}
                    >
                      {screen.name}
                    </a>
                    {item.children && (
                      <button
                        type="button"
                        className={styles.toggle}
                        aria-expanded={contentOpen}
                        aria-controls={childListId}
                        aria-label={`${screen.name} pages`}
                        title={`${screen.name} pages`}
                        onClick={() => setContentOpen(!contentOpen)}
                      >
                        <span className={styles.glyph} aria-hidden="true">
                          ›
                        </span>
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <ul id={childListId} className={styles.children} data-open={contentOpen}>
                      {item.children.map((childId) => (
                        <li key={childId}>
                          <a
                            className={`${styles.link} ${styles.childLink}`}
                            href={hrefFor(childId)}
                            aria-current={isCurrent(childId) ? 'page' : undefined}
                          >
                            {adminScreens[childId].name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.themeArea}>
          <ThemePreference id="admin-theme" />
        </div>
      </div>
    </div>
  );
}
