'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { notificationsCopy as copy, notificationsSeed } from '../../../shared/content/notifications';
import { profileCopy } from '../../../shared/content/profile';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { signOut } from '../../app/_data/authStore';
import { isSupabaseMode } from '../../app/_data/config';
import { useIdentity } from '../../app/_data/identity';
import { markRead, setPanelOpen, unreadCount, useNotifications } from './notificationsStore';
import styles from './ProfilePanel.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Phase A2: notifications are still sample items. In Supabase mode their sample task links
// go to Review Tasks instead, so they never open a sample task beside real data.
const notificationHref = (href: string) =>
  isSupabaseMode && href.startsWith(adminScreens['review-tasks'].path) ? adminScreens['review-tasks'].path : href;

// Phase A1: the profile button opens the Profile / Notifications panel (replaces the
// Appearance menu). A non-modal dialog: focus moves to its heading when it opens;
// Escape, the close button or a click outside closes it and focus returns to the button.
// The sidebar's Notifications button opens the same panel (shared store).
export function ProfilePanel() {
  const state = useNotifications();
  const wrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonId = 'profile-button';
  const unread = unreadCount(state);
  // Phase A2: the signed-in member in Supabase mode; the sample identity otherwise
  const me = useIdentity();
  const [signOutState, setSignOutState] = useState<'idle' | 'busy' | 'failed'>('idle');
  const signInHref = `${base}${adminScreens['sign-in'].path}`;

  useEffect(() => {
    if (!state.open) return;
    headingRef.current?.focus();
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Element;
      if (!wrapRef.current?.contains(target) && !target.closest?.('[aria-controls="profile-panel"]')) setPanelOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [state.open]);

  const close = () => {
    setPanelOpen(false);
    document.getElementById(buttonId)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        id={buttonId}
        type="button"
        className={styles.button}
        aria-label={unread > 0 ? `${profileCopy.buttonLabel}, ${copy.unreadCount(unread)}` : profileCopy.buttonLabel}
        aria-haspopup="dialog"
        aria-expanded={state.open}
        aria-controls="profile-panel"
        onClick={() => setPanelOpen(!state.open)}
      >
        <span aria-hidden="true">{me.initials}</span>
        {/* Unread sign: a ring and a dot, plus the count in the button's name (not color alone) */}
        {unread > 0 && <span className={styles.dot} aria-hidden="true" />}
      </button>

      <div id="profile-panel" role="dialog" aria-labelledby="profile-panel-heading" className={styles.panel} hidden={!state.open} onKeyDown={onKeyDown}>
        <div className={styles.identity}>
          <span className={styles.initials} aria-hidden="true">
            {me.initials}
          </span>
          <div className={styles.identityText}>
            <p className={styles.name}>{me.name}</p>
            {me.role && <p className={styles.muted}>{me.role}</p>}
            <p className={styles.muted}>{me.status}</p>
          </div>
        </div>

        <div className={styles.header}>
          <h2 id="profile-panel-heading" ref={headingRef} tabIndex={-1} className={styles.heading}>
            {copy.heading}
          </h2>
          <span className={styles.count}>{copy.unreadCount(unread)}</span>
        </div>

        <ul className={styles.list}>
          {notificationsSeed.map((item) => {
            const isUnread = !state.read.includes(item.id);
            return (
              <li key={item.id} className={isUnread ? `${styles.item} ${styles.unread}` : styles.item}>
                <a className={styles.itemLink} href={`${base}${notificationHref(item.href)}`} onClick={() => markRead([item.id])}>
                  <span className={styles.itemState}>
                    {isUnread && <span className={styles.itemDot} aria-hidden="true" />}
                    {isUnread ? copy.unreadLabel : copy.readLabel}
                  </span>
                  <span className={styles.message}>{item.message}</span>
                  <span className={styles.when}>{item.when}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <p className={styles.note}>{copy.sampleNote}</p>
        {signOutState === 'failed' && (
          <p className={styles.note} role="alert">
            {supabaseModeCopy.session.signOutError}
          </p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.textButton} disabled={unread === 0} onClick={() => markRead(notificationsSeed.map((item) => item.id))}>
            {copy.markAllRead}
          </button>
          {isSupabaseMode ? (
            // Phase A2: ends the Supabase session, then goes to Sign In
            <button
              type="button"
              className={styles.textButton}
              disabled={signOutState === 'busy'}
              onClick={async () => {
                setSignOutState('busy');
                if (await signOut()) window.location.assign(signInHref);
                else setSignOutState('failed');
              }}
            >
              {signOutState === 'busy' ? supabaseModeCopy.session.signingOut : supabaseModeCopy.session.signOut}
            </button>
          ) : (
            <a className={styles.textButton} href={signInHref}>
              {profileCopy.signOut}
            </a>
          )}
          <button type="button" className={styles.textButton} onClick={close}>
            {copy.close}
          </button>
        </div>
      </div>
    </div>
  );
}
