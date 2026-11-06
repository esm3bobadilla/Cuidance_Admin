'use client';

import { useSearchParams } from 'next/navigation';
import { ReviewTaskDetailView, type TaskDetailState } from './ReviewTaskDetailView';

const previewStates: TaskDetailState[] = ['loading', 'error', 'unavailable', 'saving', 'save-error', 'success'];

// Review aid only: ?state=loading, error, unavailable, saving, save-error or success shows
// that state without saving anything. Any other address shows the task.
export function ReviewTaskDetailStateFromUrl({ taskId }: { taskId: string }) {
  const requested = useSearchParams().get('state') as TaskDetailState | null;
  const state = requested && previewStates.includes(requested) ? requested : 'ready';
  return <ReviewTaskDetailView taskId={taskId} state={state} />;
}
