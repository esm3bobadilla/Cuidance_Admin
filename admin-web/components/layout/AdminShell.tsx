'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

type AdminShellProps = {
  // Logo on the green sidebar (desktop and tablet)
  sidebarLogo: ReactNode;
  // Logo on the page background (phone top row)
  barLogo: ReactNode;
  children: ReactNode;
};

// Shared Admin Web shell: top bar, persistent sidebar and the page.
// Desktop and tablet: sidebar on the left, top bar above the page.
// Phones: the top bar first, the sidebar list below it when Menu is open, then the page.
export function AdminShell({ sidebarLogo, barLogo, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      <TopBar logo={barLogo} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />
      <Sidebar logo={sidebarLogo} menuOpen={menuOpen} />
      <div id="main-content" className="app-main" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
