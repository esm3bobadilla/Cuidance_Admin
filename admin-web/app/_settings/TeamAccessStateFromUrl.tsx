'use client';

import { useSearchParams } from 'next/navigation';
import type { ReviewViewState } from '../_review/ReviewShared';
import { TeamAccessView } from './TeamAccessView';

const previewStates: ReviewViewState[] = ['loading', 'empty', 'error'];

// Review aid only: ?state=loading, ?state=empty or ?state=error previews the member list's state
export function TeamAccessStateFromUrl() {
  const requested = useSearchParams().get('state') as ReviewViewState | null;
  return <TeamAccessView state={requested && previewStates.includes(requested) ? requested : 'ready'} />;
}
