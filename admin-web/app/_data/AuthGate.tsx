'use client';

import { useEffect, type ReactNode } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { dashboardCopy } from '../../../shared/content/dashboard-review-queue';
import { supabaseModeCopy as copy } from '../../../shared/content/supabase-mode';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { useAuth } from './authStore';
import { isSupabaseMode } from './config';
import styles from './data.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const signInHref = `${base}${adminScreens['sign-in'].path}`;

// Where Sign In sends someone afterwards: only a page on this site (never another address)
export function safeNext(next: string | null): string {
  const fallback = `${base}${adminScreens.dashboard.path}`;
  if (!next || !next.startsWith(`${base}/`) || next.startsWith('//') || next.includes('\\')) return fallback;
  return next;
}

/*
 * Phase A2: route protection (Supabase mode only; sample mode renders the page as before).
 *
 * Every Admin Web page except Sign In, Create Account, Accept Invitation and Account
 * Setup needs a signed-in, active workspace member. This only decides what the page
 * shows: the data itself is protected by Row Level Security, so a visitor who skips
 * this check still gets nothing from the database.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    if (!isSupabaseMode || auth.status !== 'signed-out') return;
    const here = `${window.location.pathname}${window.location.search}`;
    window.location.replace(`${signInHref}?next=${encodeURIComponent(here)}`);
  }, [auth.status]);

  if (!isSupabaseMode || auth.status === 'sample') return <>{children}</>;

  if (auth.status === 'signed-in' && auth.membership) return <>{children}</>;

  return (
    <main className="shell">
      {auth.status === 'signed-in' ? (
        <section className={styles.gate} aria-labelledby="no-access-heading">
          <h1 id="no-access-heading" className={styles.gateTitle}>
            {copy.session.noAccess.title}
          </h1>
          <p className={styles.gateBody}>{copy.session.noAccess.body}</p>
        </section>
      ) : auth.status === 'error' ? (
        <section className={styles.gate} aria-labelledby="gate-heading">
          <h1 id="gate-heading" className={styles.gateTitle}>
            {dashboardCopy.title}
          </h1>
          <p className={styles.problem} role="alert">
            <span aria-hidden="true">{uiSymbols.error}</span> {copy.session.error}
          </p>
        </section>
      ) : (
        <section className={styles.gate} aria-labelledby="gate-heading" aria-busy="true">
          <h1 id="gate-heading" className={styles.gateTitle}>
            {dashboardCopy.title}
          </h1>
          <p className={styles.gateBody} role="status">
            <span aria-hidden="true">{uiSymbols.loading}</span> {copy.session.checking}
          </p>
        </section>
      )}
    </main>
  );
}
