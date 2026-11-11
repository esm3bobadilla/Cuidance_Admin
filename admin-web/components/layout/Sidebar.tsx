'use client';

import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  adminScreens,
  sidebarFooter,
  sidebarNav,
  sidebarProfileLinks,
  type AdminScreenId,
  type SidebarItem,
} from '../../../shared/content/admin-web-screens';
import { notificationsCopy } from '../../../shared/content/notifications';
import { profileCopy } from '../../../shared/content/profile';
import leafHand from '../../../shared/brand/illustrations/illus-leaf-hand.png';
import { setPanelOpen, unreadCount, useNotifications } from './notificationsStore';
import styles from './Sidebar.module.css';

type SidebarProps = {
  // The logo, rendered by the layout so the approved image files stay in one place
  logo: ReactNode;
  // Phones only: whether the Menu button in the top bar has opened the list
  menuOpen: boolean;
};

const trimSlash = (path: string) => path.replace(/\/+$/, '') || '/';

// Plain links need the GitHub Pages base path added by hand
const hrefFor = (id: AdminScreenId) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens[id].path}`;

// Persistent Admin Web sidebar (Phase A1): Dashboard, Content, Review Tasks and Metrics,
// a flat Cuidance illustration, then the Profile card (Account Support and Notifications)
// and Settings at the bottom. On phones the same list opens below the top bar from its
// Menu button. Without JavaScript, everything stays visible.
export function Sidebar({ logo, menuOpen }: SidebarProps) {
  const current = trimSlash(usePathname() ?? '/');
  const isCurrent = (id: AdminScreenId) => trimSlash(adminScreens[id].path) === current;
  const isWithin = (id: AdminScreenId) => id !== 'dashboard' && current.startsWith(`${trimSlash(adminScreens[id].path)}/`);
  const holdsCurrent = (item: SidebarItem) => (item.id ? isWithin(item.id) : false) || (item.children ?? []).some(isCurrent);
  const notifications = useNotifications();
  const unread = unreadCount(notifications);

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sidebarNav.map((item) => [item.group, (item.id ? isCurrent(item.id) : false) || holdsCurrent(item)])),
  );

  return (
    <div id="admin-sidebar" className={`app-sidebar ${styles.sidebar}`} data-open={menuOpen}>
      <noscript>
        <style>{`.${styles.sidebar}, .${styles.children} { display: flex !important; } .${styles.toggle}, .${styles.notificationsButton} { display: none !important; }`}</style>
      </noscript>

      {/* Desktop and tablet only: the phone top row shows its own logo */}
      <div className={styles.top}>{logo}</div>

      <nav id="admin-sidebar-nav" aria-label="Admin Web" className={styles.nav}>
        <ul className={styles.list}>
          {sidebarNav.map((item) => {
            const childListId = `admin-sidebar-${item.group}`;
            const groupOpen = open[item.group];
            const toggle = () => setOpen((state) => ({ ...state, [item.group]: !state[item.group] }));
            const bold = holdsCurrent(item) ? styles.parentOfCurrent : '';
            return (
              <li key={item.group}>
                <div className={styles.row}>
                  {item.id ? (
                    <a className={`${styles.link} ${bold}`} href={hrefFor(item.id)} aria-current={isCurrent(item.id) ? 'page' : undefined}>
                      {item.label}
                    </a>
                  ) : (
                    // Metrics has no page of its own: the whole row opens and closes its list
                    <button
                      type="button"
                      className={`${styles.link} ${styles.groupButton} ${bold}`}
                      aria-expanded={groupOpen}
                      aria-controls={childListId}
                      onClick={toggle}
                    >
                      {item.label}
                      <span className={styles.groupGlyph} aria-hidden="true">
                        ›
                      </span>
                    </button>
                  )}
                  {item.id && item.children && (
                    <button
                      type="button"
                      className={styles.toggle}
                      aria-expanded={groupOpen}
                      aria-controls={childListId}
                      aria-label={`${item.label} pages`}
                      title={`${item.label} pages`}
                      onClick={toggle}
                    >
                      <span className={styles.glyph} aria-hidden="true">
                        ›
                      </span>
                    </button>
                  )}
                </div>
                {item.children && (
                  <ul id={childListId} className={styles.children} data-open={groupOpen} aria-label={`${item.label} pages`}>
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

        {/* Area 5 in the annotated reference: a flat 2D Cuidance illustration (decorative) */}
        <div className={styles.art} aria-hidden="true">
          <span className={styles.artBackdrop}>
            <img src={leafHand.src} width={leafHand.width} height={leafHand.height} alt="" className={styles.artImage} />
          </span>
        </div>

        <div className={styles.bottom}>
          <section className={styles.profile} aria-label={profileCopy.cardLabel}>
            <div className={styles.identity}>
              <span className={styles.initials} aria-hidden="true">
                {profileCopy.initials}
              </span>
              <div className={styles.identityText}>
                <p className={styles.profileName}>{profileCopy.name}</p>
                <p className={styles.profileRole}>{profileCopy.role}</p>
              </div>
            </div>
            <ul className={styles.profileLinks}>
              {sidebarProfileLinks.map((id) => (
                <li key={id}>
                  <a className={`${styles.link} ${styles.childLink}`} href={hrefFor(id)} aria-current={isCurrent(id) ? 'page' : undefined}>
                    {adminScreens[id].name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className={`${styles.link} ${styles.childLink} ${styles.notificationsButton}`}
                  aria-controls="profile-panel"
                  onClick={() => {
                    setPanelOpen(true);
                    window.scrollTo({ top: 0 });
                  }}
                >
                  {notificationsCopy.sidebarButton}
                  {unread > 0 && <span className={styles.count}>{notificationsCopy.unreadCount(unread)}</span>}
                </button>
              </li>
            </ul>
          </section>
          <a className={styles.link} href={hrefFor(sidebarFooter)} aria-current={isCurrent(sidebarFooter) ? 'page' : undefined}>
            {adminScreens[sidebarFooter].name}
          </a>
        </div>
      </nav>
    </div>
  );
}
