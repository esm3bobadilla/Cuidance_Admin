import type { ReactNode } from 'react';
import { ThemeSwitch } from './ThemeSwitch';
import styles from './SetupBar.module.css';

// Week 11 feature 2 (Team 03 decision A8): the top bar for Accept Invitation and
// Account Setup, before the person enters Admin Web. The Cuidance logo and the
// theme controls only: no Menu, breadcrumb or profile. Without JavaScript the theme
// controls are hidden, as in the main top bar.
export function SetupBar({ logo }: { logo: ReactNode }) {
  return (
    <header className={`app-bar ${styles.bar}`}>
      <noscript>
        <style>{`.${styles.actions} { display: none !important; }`}</style>
      </noscript>
      {logo}
      <div className={styles.actions}>
        <ThemeSwitch />
      </div>
    </header>
  );
}
