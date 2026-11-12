'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { reviewTaskDetailCopy as copy } from '../../../shared/content/review-task-detail';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { canDecide, isTaskId } from '../../../shared/review-loop/supabase-mapping';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth, whoAmI } from '../_data/authStore';
import { isSupabaseMode } from '../_data/config';
import { saveDecision, useLiveReviewTasks } from '../_data/reviewData';
import { TaskDetail, type DecisionOptions, type TaskDetailState } from './ReviewTaskDetailView';

const previewStates: TaskDetailState[] = ['loading', 'error', 'unavailable', 'saving', 'save-error', 'success'];

/*
 * Phase A2: Review Task Detail for a Supabase task (/review-tasks/task/?id=…).
 *
 * The same screen as the sample detail pages (TaskDetail), with the signed-in
 * Reviewer, decisions saved to the database, and the database rules shown:
 * only the assigned Reviewer decides (D4); Needs changes can be decided again until
 * Approved (D12); decisions can't be undone. In sample mode this page has no tasks.
 */
export function LiveReviewTaskDetail() {
  const params = useSearchParams();
  const taskId = params.get('id');
  const requested = params.get('state') as TaskDetailState | null;
  const auth = useAuth();
  const me = whoAmI(auth);
  const data = useLiveReviewTasks();
  const task = isTaskId(taskId) ? data.tasks.find((item) => item.id === taskId) : undefined;

  const state: TaskDetailState =
    requested && previewStates.includes(requested)
      ? requested
      : !isSupabaseMode || !isTaskId(taskId)
        ? 'unavailable'
        : data.state === 'ready'
          ? 'ready'
          : data.state;

  const title = task?.item ?? copy.fallbackTitle;
  useEffect(() => {
    document.title = copy.pageTitle(title);
  }, [title]);

  const options: DecisionOptions = {
    note: supabaseModeCopy.dataNote,
    reviewingAs: supabaseModeCopy.detail.reviewingAs(me.name ?? ''),
    historyEmpty: supabaseModeCopy.detail.historyEmpty,
    save: (current, decision, note) => {
      const live = data.tasks.find((item) => item.id === current.id);
      return live && me.userId ? saveDecision(live, me.userId, decision, note) : 'failed';
    },
    live: { canDecide: task ? canDecide(task, me.userId, me.role) : false },
    saveErrors: { failed: supabaseModeCopy.detail.errors.save, refused: supabaseModeCopy.detail.errors.refused },
  };

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={title} description={copy.description} />
      {isSupabaseMode && taskId !== null && !isTaskId(taskId) && <p className="note">{supabaseModeCopy.detail.missingId}</p>}
      <TaskDetail task={task} state={state} options={options} />
    </>
  );
}
