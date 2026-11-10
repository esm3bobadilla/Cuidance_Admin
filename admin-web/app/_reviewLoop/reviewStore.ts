'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { reviewTasksSeed } from '../../../shared/content/review-tasks';
import {
  applyDecisions,
  parseReviewSession,
  type ReviewDecision,
  type ReviewNotice,
  type ReviewTask,
} from '../../../shared/review-loop/review-decisions';

/*
 * Week 11 review decisions for this browser tab (Close the Loop, feature 1).
 *
 * Kept in session storage, so a decision survives moving between screens (links
 * load a fresh page) and clears when the tab closes. Nothing leaves the browser.
 * Same pattern as the theme store: the built page shows the plain seed, then the
 * browser adds this tab's decisions after the page loads, without hydration warnings.
 *
 * Only Review Task Detail calls recordDecision and resetReviewSession.
 */

export const reviewSessionKey = 'cuidance-admin-review-session';

type ReviewSession = { decisions: ReviewDecision[]; notice: ReviewNotice | null };

const emptySession: ReviewSession = { decisions: [], notice: null };
const knownIds = reviewTasksSeed.map((task) => task.id);
const listeners = new Set<() => void>();
let session: ReviewSession | null = null;

const readSaved = (): ReviewSession => {
  try {
    const saved = sessionStorage.getItem(reviewSessionKey);
    return saved ? parseReviewSession(JSON.parse(saved), knownIds) : emptySession;
  } catch {
    return emptySession;
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSession = () => (session ??= readSaved());
const getServerSession = () => emptySession;

// Saves first, so the screens only change when the save worked. Throws if it didn't.
const save = (next: ReviewSession) => {
  if (next.decisions.length === 0 && !next.notice) sessionStorage.removeItem(reviewSessionKey);
  else sessionStorage.setItem(reviewSessionKey, JSON.stringify(next));
  session = next;
  listeners.forEach((listener) => listener());
};

// Records a decision and the Dashboard message for it. Returns false if the browser couldn't save it.
export function recordDecision(decision: ReviewDecision): boolean {
  try {
    const current = getSession();
    save({ decisions: [...current.decisions, decision], notice: { taskId: decision.taskId, decision: decision.decision } });
    return true;
  } catch {
    return false;
  }
}

// Reset sample data: clears every decision in this tab
export function resetReviewSession(): boolean {
  try {
    save(emptySession);
    return true;
  } catch {
    return false;
  }
}

// The Dashboard shows the message once, then clears it
export function clearReviewNotice() {
  try {
    const current = getSession();
    if (current.notice) save({ ...current, notice: null });
  } catch {
    // Nothing to do: the message just shows again next time
  }
}

export function useReviewSession(): ReviewSession {
  return useSyncExternalStore(subscribe, getSession, getServerSession);
}

// The seed tasks with this tab's decisions applied. Every screen reads tasks through this.
export function useReviewTasks(): ReviewTask[] {
  const { decisions } = useReviewSession();
  return useMemo(() => applyDecisions(reviewTasksSeed, decisions), [decisions]);
}
