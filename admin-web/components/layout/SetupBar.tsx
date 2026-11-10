import type { ReactNode } from 'react';
import { ThemeMenu } from './ThemeMenu';
import styles from './SetupBar.module.css';

// Week 11 feature 2 (Team 03 decision A8): the top bar for Accept Invitation and
// Account Setup, before the person enters Admin Web. The Cuidance logo and the
// Theme menu only: no Menu, breadcrumb or profile. Without JavaScript the Theme
// menu is hidden, as in the main top bar.
export function SetupBar({ logo }: { logo: ReactNode }) {
  return (
    <header className={`app-bar ${styles.bar}`}>
      <noscript>
        <style>{`.${styles.actions} { display: none !important; }`}</style>
      </noscript>
      {logo}
      <div className={styles.actions}>
        <ThemeMenu id="admin-theme" />
      </div>
    </header>
  );
}
