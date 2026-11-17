'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { isSetupPath } from '../../../shared/content/admin-web-screens';
import { sidebarAttribute, sidebarStorageKey } from '../../../shared/content/display-settings';
import { AuthGate } from '../../app/_data/AuthGate';
import { SetupBar } from './SetupBar';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

type AdminShellProps = {
  // Logo on the dark green sidebar (the same in both themes)
  sidebarLogo: ReactNode;
  // Logo on the page background (phone top bar)
  barLogo: ReactNode;
  children: ReactNode;
};

// Saves the desktop sidebar choice and applies it to <html> (read by the CSS)
function setCollapsed(collapsed: boolean) {
  const root = document.documentElement;
  if (collapsed) root.setAttribute(sidebarAttribute, 'collapsed');
  else root.removeAttribute(sidebarAttribute);
  try {
    if (collapsed) localStorage.setItem(sidebarStorageKey, 'collapsed');
    else localStorage.removeItem(sidebarStorageKey);
  } catch {
    // Storage can be blocked: the choice still applies on this page
  }
}

// Shared Admin Web shell: sidebar (or rail, or drawer), top bar and the page.
export function AdminShell({ sidebarLogo, barLogo, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const collapseRef = useRef<HTMLButtonElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const setup = isSetupPath(usePathname() ?? '/');

  // The drawer is for tablet and phone only: close it if the window grows to desktop
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)');
    const close = () => desktop.matches && setDrawerOpen(false);
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  // Week 11: Accept Invitation and Account Setup come before Admin Web, so they have
  // no sidebar (Team 03 decision A8).
  if (setup) {
    return (
      <div className="app app-setup">
        <SetupBar logo={barLogo} />
        <div id="main-content" className="app-main" tabIndex={-1}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar logo={barLogo} menuOpen={drawerOpen} onOpenMenu={() => setDrawerOpen(true)} />
      <Sidebar
        logo={sidebarLogo}
        drawerOpen={drawerOpen}
        onOpenDrawer={() => setDrawerOpen(true)}
        onCloseDrawer={() => setDrawerOpen(false)}
        // Focus moves to the matching button, since the one that was pressed disappears
        onCollapse={() => {
          setCollapsed(true);
          expandRef.current?.focus();
        }}
        onExpand={() => {
          setCollapsed(false);
          collapseRef.current?.focus();
        }}
        collapseRef={collapseRef}
        expandRef={expandRef}
      />
      <div id="main-content" className="app-main" tabIndex={-1}>
        {/* Phase A2: in Supabase mode, the page needs a signed-in member. Sample mode: unchanged */}
        <AuthGate>{children}</AuthGate>
      </div>
    </div>
  );
}
