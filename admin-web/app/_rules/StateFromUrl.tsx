'use client';

import { useSearchParams } from 'next/navigation';
import type { ReviewViewState } from '../_review/ReviewShared';
import { GuidanceRulesView } from './GuidanceRulesView';

const previewStates: ReviewViewState[] = ['loading', 'empty', 'error'];

// Review aid only: ?state=loading, ?state=empty or ?state=error previews that state.
// No results comes from the search and filters themselves.
export function StateFromUrl() {
  const requested = useSearchParams().get('state') as ReviewViewState | null;
  return <GuidanceRulesView state={requested && previewStates.includes(requested) ? requested : 'ready'} />;
}
