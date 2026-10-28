'use client';

import { useSearchParams } from 'next/navigation';
import type { ReviewViewState } from '../_review/ReviewShared';
import { ReviewTasksContent } from './ReviewTasksContent';

const previewStates: ReviewViewState[] = ['loading', 'empty', 'error'];

// Review aid only: ?state=loading, ?state=empty or ?state=error shows that state.
// Any other address shows the seeded review tasks.
export function ReviewTasksStateFromUrl() {
  const requested = useSearchParams().get('state') as ReviewViewState | null;
  const state = requested && previewStates.includes(requested) ? requested : 'ready';
  return <ReviewTasksContent state={state} />;
}
