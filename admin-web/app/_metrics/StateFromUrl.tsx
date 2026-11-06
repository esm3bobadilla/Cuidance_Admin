'use client';

import { useSearchParams } from 'next/navigation';
import type { ReviewViewState } from '../_review/ReviewShared';
import { ContentMetricsView } from './ContentMetricsView';

const previewStates: ReviewViewState[] = ['loading', 'empty', 'error'];

// Review aid only: ?state=loading, ?state=empty or ?state=error previews that state
export function StateFromUrl() {
  const requested = useSearchParams().get('state') as ReviewViewState | null;
  return <ContentMetricsView state={requested && previewStates.includes(requested) ? requested : 'ready'} />;
}
