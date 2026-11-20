'use client';

import { useSyncExternalStore } from 'react';
import { emailSeed, emailTemplates, type EmailDoc } from '../../../shared/content/email';
import { liveUpdatesSeed, type LiveUpdate } from '../../../shared/content/live';
import { productSeed, type ProductRecord } from '../../../shared/content/product-library';

/*
 * Phase 2 PR 2: the working demo for Product Library, Email and Live.
 *
 * Kept in session storage, like the Week 11 review decisions (reviewStore.ts): changes
 * survive moving between screens (links load a fresh page), the Dashboard counts can read
 * them, and everything clears when the tab closes. Nothing leaves the browser. Uploaded
 * images are not stored (too large); they stay on the page that holds them.
 *
 * The built page shows the plain sample data, then the browser adds this tab's changes
 * after the page loads, without hydration warnings.
 */

export const demoSessionKey = 'cuidance-admin-demo-session';

export type DemoEmail = EmailDoc & { templateAlt: string };
export type DemoState = {
  products: ProductRecord[];
  emails: DemoEmail[];
  archivedTemplates: string[];
  live: LiveUpdate[];
};

const template = (id: string) => emailTemplates.find((t) => t.id === id);
export const demoSeed: DemoState = {
  products: productSeed,
  emails: emailSeed.map((d) => ({ ...d, templateAlt: template(d.template)?.imageAlt ?? '' })),
  archivedTemplates: [],
  live: liveUpdatesSeed,
};

const listeners = new Set<() => void>();
let state: DemoState | null = null;

// Anything unreadable falls back to the sample data, one area at a time
function parse(raw: unknown): DemoState {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<DemoState>;
  const list = <T,>(v: unknown, fallback: T[]) => (Array.isArray(v) ? (v as T[]) : fallback);
  return {
    products: list(r.products, demoSeed.products),
    emails: list(r.emails, demoSeed.emails),
    archivedTemplates: list<string>(r.archivedTemplates, demoSeed.archivedTemplates).filter((x) => typeof x === 'string'),
    live: list(r.live, demoSeed.live),
  };
}

const readSaved = (): DemoState => {
  try {
    const saved = sessionStorage.getItem(demoSessionKey);
    return saved ? parse(JSON.parse(saved)) : demoSeed;
  } catch {
    return demoSeed;
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getState = () => (state ??= readSaved());
const getServerState = () => demoSeed;

export function useDemo(): DemoState {
  return useSyncExternalStore(subscribe, getState, getServerState);
}

// Saves first, then updates the screens. Returns false if the browser couldn't keep it;
// the change still shows on this page.
export function updateDemo(change: (current: DemoState) => DemoState): boolean {
  const next = change(getState());
  state = next;
  let saved = true;
  try {
    sessionStorage.setItem(demoSessionKey, JSON.stringify(next));
  } catch {
    saved = false;
  }
  listeners.forEach((listener) => listener());
  return saved;
}

// Reset demo data: back to the sample data for this tab
export function resetDemo(): boolean {
  try {
    sessionStorage.removeItem(demoSessionKey);
  } catch {
    return false;
  }
  state = demoSeed;
  listeners.forEach((listener) => listener());
  return true;
}
