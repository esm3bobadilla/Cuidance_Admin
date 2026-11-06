'use client';

import { useSearchParams } from 'next/navigation';
import type { ReviewViewState } from '../_review/ReviewShared';
import { ClaimsReviewView } from './ClaimsReviewView';

const previewStates: ReviewViewState[] = ['loading', 'empty', 'error'];

// Review aid only: ?state=loading, ?state=empty or ?state=error previews that state.
// No results comes from the tabs, filter and search themselves.
export function ClaimsStateFromUrl() {
  const requested = useSearchParams().get('state') as ReviewViewState | null;
  return <ClaimsReviewView state={requested && previewStates.includes(requested) ? requested : 'ready'} />;
}
