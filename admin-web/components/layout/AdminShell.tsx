'use client';

import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { isSetupPath } from '../../../shared/content/admin-web-screens';
import { AuthGate } from '../../app/_data/AuthGate';
import { SetupBar } from './SetupBar';
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

  // Week 11: Accept Invitation and Account Setup come before Admin Web, so they have
  // no sidebar (Team 03 decision A8). Every other page is unchanged.
  if (isSetupPath(usePathname() ?? '/')) {
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
      <TopBar logo={barLogo} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />
      <Sidebar logo={sidebarLogo} menuOpen={menuOpen} />
      <div id="main-content" className="app-main" tabIndex={-1}>
        {/* Phase A2: in Supabase mode, the page needs a signed-in member. Sample mode: unchanged */}
        <AuthGate>{children}</AuthGate>
      </div>
    </div>
  );
}
