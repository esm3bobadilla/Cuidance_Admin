'use client';

import { useSyncExternalStore } from 'react';
import { notificationsSeed } from '../../../shared/content/notifications';

/*
 * Phase A1 (sample mode): which sample notifications are read, and whether the
 * Profile / Notifications panel is open. Shared by the top-bar profile button and
 * the sidebar Profile card, so both open the same panel and show the same count.
 *
 * Read state is kept in session storage (this browser tab only), like the other
 * prototype stores. Nothing is sent anywhere. The built page shows the seed state,
 * then the browser applies this tab's read state after loading (no hydration warnings).
 */

const storageKey = 'cuidance-admin-notifications-read';
const listeners = new Set<() => void>();
const seedRead = notificationsSeed.filter((item) => !item.unread).map((item) => item.id);

type State = { read: string[]; open: boolean };
const serverState: State = { read: seedRead, open: false };
let state: State | null = null;

const readSaved = (): State => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null');
    const known = notificationsSeed.map((item) => item.id);
    if (Array.isArray(saved)) return { read: saved.filter((id) => known.includes(id)), open: false };
  } catch {
    // Storage blocked or bad value: use the seed
  }
  return serverState;
};

const get = () => (state ??= readSaved());
const set = (next: State) => {
  state = next;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useNotifications = () => useSyncExternalStore(subscribe, get, () => serverState);

export const unreadCount = (current: State) => notificationsSeed.filter((item) => !current.read.includes(item.id)).length;

export function markRead(ids: string[]) {
  const read = [...new Set([...get().read, ...ids])];
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(read));
  } catch {
    // Not saved; still shown as read on this page
  }
  set({ ...get(), read });
}

export const setPanelOpen = (open: boolean) => set({ ...get(), open });
