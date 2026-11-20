'use client';

import { usePathname } from 'next/navigation';
import { useState, type ReactNode, type RefObject } from 'react';
import { adminNav, adminScreens, navCopy, type AdminScreenId, type NavItem } from '../../../shared/content/admin-web-screens';
import { can } from '../../../shared/content/permissions';
import { profileCopy } from '../../../shared/content/profile';
import { useIdentity } from '../../app/_data/identity';
import mark from '../../../shared/brand/logo/prototype/cuidance-mark-reversed.webp';
import { CuIcon } from '../ui/CuIcon';
import { useNativeDialog } from '../ui/useNativeDialog';
import styles from './Sidebar.module.css';

const trimSlash = (path: string) => path.replace(/\/+$/, '') || '/';
// Plain links need the GitHub Pages base path added by hand
const hrefFor = (id: AdminScreenId) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens[id].path}`;

function useNavState() {
  const current = trimSlash(usePathname() ?? '/');
  const isCurrent = (id: AdminScreenId) => trimSlash(adminScreens[id].path) === current;
  const isWithin = (id: AdminScreenId) => id !== 'dashboard' && current.startsWith(`${trimSlash(adminScreens[id].path)}/`);
  // The item, or one of its pages, is the page being shown
  const holdsCurrent = (item: NavItem) => isCurrent(item.id) || isWithin(item.id) || (item.children ?? []).some(isCurrent);
  return { isCurrent, holdsCurrent };
}

// Hides items the signed-in role may not use (Manage Team for Team Members)
function useAllowed() {
  const me = useIdentity();
  const rights = can(me.adminRole);
  return (item: NavItem) => !item.requires || !!rights?.[item.requires];
}

type PanelProps = {
  logo: ReactNode;
  // static: the desktop sidebar. drawer: the tablet and phone menu.
  mode: 'static' | 'drawer';
  onToggle: () => void;
  toggleRef?: RefObject<HTMLButtonElement | null>;
};

// The full sidebar: logo, sections, items with their pages, and who is signed in
function NavPanel({ logo, mode, onToggle, toggleRef }: PanelProps) {
  const me = useIdentity();
  const { isCurrent, holdsCurrent } = useNavState();
  const items = adminNav.flatMap((section) => section.items);
  const allowed = useAllowed();
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.key, !!item.children && holdsCurrent(item)])),
  );
  const toggleLabel = mode === 'drawer' ? navCopy.closeMenu : navCopy.collapse;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <a className={styles.logo} href={hrefFor('dashboard')} aria-label={navCopy.home}>
          {logo}
        </a>
        <button ref={toggleRef} type="button" className={styles.toggle} aria-label={toggleLabel} title={toggleLabel} onClick={onToggle}>
          <CuIcon name={mode === 'drawer' ? 'close' : 'collapse'} size={18} color="var(--color-shell-control-ink)" />
        </button>
      </div>

      <nav aria-label={navCopy.navLabel} className={styles.nav}>
        {adminNav.map((section) => (
          <div key={section.key} className={styles.section}>
            <p className={styles.sectionLabel} id={`nav-${mode}-${section.key}`}>
              {section.label}
            </p>
            <ul className={styles.list} aria-labelledby={`nav-${mode}-${section.key}`}>
              {section.items.filter(allowed).map((item) => {
                const active = holdsCurrent(item);
                const listId = `nav-${mode}-${item.key}-pages`;
                const expanded = open[item.key];
                return (
                  <li key={item.key}>
                    <div className={styles.row} data-active={active}>
                      <a
                        className={styles.item}
                        href={hrefFor(item.id)}
                        // When the item's page is also listed as one of its pages, that entry carries the marker
                        aria-current={isCurrent(item.id) && !item.children?.includes(item.id) ? 'page' : undefined}
                      >
                        <span className={styles.badge}>
                          <CuIcon
                            name={item.icon}
                            variant="badge"
                            size={34}
                            surface={active ? 'var(--color-shell-active-icon-surface)' : undefined}
                            color={active ? 'var(--color-shell-active-icon-ink)' : undefined}
                          />
                        </span>
                        <span className={styles.itemLabel}>{item.label}</span>
                      </a>
                      {item.children && (
                        <button
                          type="button"
                          className={styles.expand}
                          aria-expanded={expanded}
                          aria-controls={listId}
                          aria-label={expanded ? navCopy.collapseItem(item.label) : navCopy.expandItem(item.label)}
                          onClick={() => setOpen((state) => ({ ...state, [item.key]: !state[item.key] }))}
                        >
                          <span className={styles.chevron} data-open={expanded}>
                            <CuIcon name="chevronDown" size={16} />
                          </span>
                        </button>
                      )}
                    </div>
                    {item.children && (
                      <ul id={listId} className={styles.children} hidden={!expanded}>
                        {item.children.map((childId) => (
                          <li key={childId}>
                            <a className={styles.child} href={hrefFor(childId)} aria-current={isCurrent(childId) ? 'page' : undefined}>
                              {adminScreens[childId].navName ?? adminScreens[childId].name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <section className={styles.user} aria-label={profileCopy.cardLabel}>
        <span className={styles.avatar} aria-hidden="true">
          {me.initials}
        </span>
        <span className={styles.userText}>
          <span className={styles.userName}>{me.name}</span>
          {me.role && <span className={styles.userRole}>{me.role}</span>}
        </span>
      </section>
    </div>
  );
}

type RailProps = {
  onExpand: () => void;
  expandRef?: RefObject<HTMLButtonElement | null>;
};

// The 92 px icon rail: collapsed desktop sidebar, and the tablet sidebar
function Rail({ onExpand, expandRef }: RailProps) {
  const me = useIdentity();
  const { isCurrent, holdsCurrent } = useNavState();
  const allowed = useAllowed();
  return (
    <div className={styles.rail}>
      <a className={styles.railHome} href={hrefFor('dashboard')} aria-label={navCopy.home}>
        <img src={mark.src} width={34} height={Math.round((34 * mark.height) / mark.width)} alt="" />
      </a>
      <button ref={expandRef} type="button" className={styles.toggle} aria-label={navCopy.expand} title={navCopy.expand} onClick={onExpand}>
        <CuIcon name="expand" size={18} color="var(--color-shell-control-ink)" />
      </button>
      <nav aria-label={navCopy.navLabel} className={styles.railNav}>
        <ul className={styles.railList}>
          {adminNav
            .flatMap((section) => section.items)
            .filter(allowed)
            .map((item) => {
              const active = holdsCurrent(item);
              return (
                <li key={item.key}>
                  <a
                    className={styles.railItem}
                    data-active={active}
                    href={hrefFor(item.id)}
                    aria-current={isCurrent(item.id) ? 'page' : undefined}
                  >
                    <CuIcon
                      name={item.icon}
                      variant="badge"
                      size={34}
                      surface={active ? 'var(--color-shell-active-icon-surface)' : undefined}
                      color={active ? 'var(--color-shell-active-icon-ink)' : undefined}
                    />
                    <span className={styles.railLabel}>{item.label}</span>
                  </a>
                </li>
              );
            })}
        </ul>
      </nav>
      <span className={`${styles.avatar} ${styles.railAvatar}`} title={me.name}>
        <span aria-hidden="true">{me.initials}</span>
        <span className="visually-hidden">
          {navCopy.signedInAs} {me.name}
          {me.role ? `, ${me.role}` : ''}
        </span>
      </span>
    </div>
  );
}

type SidebarProps = {
  logo: ReactNode;
  drawerOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  onCollapse: () => void;
  onExpand: () => void;
  collapseRef: RefObject<HTMLButtonElement | null>;
  expandRef: RefObject<HTMLButtonElement | null>;
};

// Admin Web sidebar (Phase B1, approved prototype):
// - Desktop (1280 px and up): the full sidebar, which collapses to the 92 px icon rail.
// - Tablet (768 to 1279 px): the icon rail; Expand opens the full sidebar as a drawer.
// - Phone (under 768 px): no sidebar; Menu in the top bar opens the drawer.
// The drawer is a modal dialog: focus stays inside, Escape closes it and focus returns.
export function Sidebar({ logo, drawerOpen, onOpenDrawer, onCloseDrawer, onCollapse, onExpand, collapseRef, expandRef }: SidebarProps) {
  const drawerRef = useNativeDialog(drawerOpen, onCloseDrawer);
  const isDesktop = () => window.matchMedia('(min-width: 1280px)').matches;

  return (
    <>
      <aside className={`app-sidebar ${styles.sidebar}`}>
        <div className={styles.staticPanel}>
          <NavPanel logo={logo} mode="static" onToggle={onCollapse} toggleRef={collapseRef} />
        </div>
        <div className={styles.staticRail}>
          <Rail onExpand={() => (isDesktop() ? onExpand() : onOpenDrawer())} expandRef={expandRef} />
        </div>
      </aside>
      <dialog ref={drawerRef} id="admin-menu" className={styles.drawer} aria-label={navCopy.menuDialogLabel}>
        {drawerOpen && <NavPanel logo={logo} mode="drawer" onToggle={onCloseDrawer} />}
      </dialog>
    </>
  );
}
