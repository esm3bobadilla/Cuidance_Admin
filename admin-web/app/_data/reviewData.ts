'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { ReviewDecisionKind, ReviewNotice, ReviewTask } from '../../../shared/review-loop/review-decisions';
import {
  decisionToDb,
  reviewTaskSelect,
  rowsToTasks,
  type LiveReviewTask,
  type ReviewTaskRow,
} from '../../../shared/review-loop/supabase-mapping';
import { useReviewTasks } from '../_reviewLoop/reviewStore';
import { useAuth } from './authStore';
import { isSupabaseMode } from './config';
import { getSupabase } from './supabaseClient';

/*
 * Phase A2: review tasks and decisions for the Dashboard, Review Tasks and Review Task Detail.
 *
 * - Sample mode (default): the Week 11 store, unchanged (seed + this tab's decisions).
 * - Supabase mode: the signed-in member's workspace tasks and their decisions, read
 *   through Row Level Security. A decision is saved to the database, then the tasks
 *   are read again, so every screen shows what the database now holds.
 */

export type ReviewDataState = 'loading' | 'ready' | 'error';
export type ReviewData = { state: ReviewDataState; tasks: ReviewTask[] };
export type SaveResult = 'saved' | 'refused' | 'failed';

type LiveState = { state: ReviewDataState; tasks: LiveReviewTask[] };

const listeners = new Set<() => void>();
const loadingState: LiveState = { state: 'loading', tasks: [] };
let live: LiveState = loadingState;
let loadedFor: string | null = null;

const emit = () => listeners.forEach((listener) => listener());

async function loadTasks(userId: string) {
  loadedFor = userId;
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('review_tasks').select(reviewTaskSelect);
    if (error) throw error;
    live = { state: 'ready', tasks: rowsToTasks((data ?? []) as unknown as ReviewTaskRow[]) };
  } catch {
    live = { state: 'error', tasks: [] };
  }
  emit();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Supabase mode: the tasks for whoever is signed in (loaded once per page, then after each decision)
export function useLiveReviewTasks(): LiveState {
  const auth = useAuth();
  const snapshot = useSyncExternalStore(
    subscribe,
    () => live,
    () => loadingState,
  );
  const userId = auth.status === 'signed-in' ? auth.userId : null;
  useEffect(() => {
    if (userId && loadedFor !== userId) void loadTasks(userId);
  }, [userId]);
  if (auth.status === 'error' || auth.status === 'signed-out') return { state: auth.status === 'error' ? 'error' : 'loading', tasks: [] };
  return auth.status === 'signed-in' ? snapshot : loadingState;
}

// Every review screen reads its tasks through this, in either mode
export function useReviewData(): ReviewData {
  // isSupabaseMode is fixed when the site is built, so the same hooks run on every render
  if (isSupabaseMode) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLiveReviewTasks();
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return { state: 'ready', tasks: useReviewTasks() };
}

// Saves a decision for the signed-in Reviewer. The database sets the workspace, the time
// and the task's new status, and refuses anything the rules don't allow (D4, D12).
export async function saveDecision(task: LiveReviewTask, userId: string, decision: ReviewDecisionKind, note: string): Promise<SaveResult> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('review_decisions').insert({
      task_id: task.id,
      workspace_id: task.workspaceId,
      decision: decisionToDb[decision],
      note: note.trim(),
      decided_by: userId,
    });
    if (error) {
      // 42501: Row Level Security refused it. P0001: a rule in a trigger. 23xxx: a constraint.
      return error.code === '42501' || error.code === 'P0001' || error.code?.startsWith('23') ? 'refused' : 'failed';
    }
    setLiveNotice({ taskId: task.id, decision });
    await loadTasks(userId);
    return 'saved';
  } catch {
    return 'failed';
  }
}

// ---------------------------------------------------------------------------
// "Decision recorded" on the Dashboard, once (Supabase mode). Same behavior as the
// Week 11 notice, kept in its own session-storage key so the sample store is untouched.
// ---------------------------------------------------------------------------

export const liveNoticeKey = 'cuidance-admin-live-notice';
const noticeListeners = new Set<() => void>();
let notice: ReviewNotice | null | undefined;

const readNotice = (): ReviewNotice | null => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(liveNoticeKey) ?? 'null');
    return saved && typeof saved.taskId === 'string' && (saved.decision === 'approved' || saved.decision === 'changes-requested')
      ? { taskId: saved.taskId, decision: saved.decision }
      : null;
  } catch {
    return null;
  }
};

function setLiveNotice(next: ReviewNotice | null) {
  try {
    if (next) sessionStorage.setItem(liveNoticeKey, JSON.stringify(next));
    else sessionStorage.removeItem(liveNoticeKey);
  } catch {
    // The message just won't show; the decision is already saved
  }
  notice = next;
  noticeListeners.forEach((listener) => listener());
}

export const clearLiveNotice = () => setLiveNotice(null);

export function useLiveNotice(): ReviewNotice | null {
  return useSyncExternalStore(
    (listener) => {
      noticeListeners.add(listener);
      return () => noticeListeners.delete(listener);
    },
    () => (notice === undefined ? (notice = readNotice()) : notice),
    () => null,
  );
}
