'use client';

import { useSearchParams } from 'next/navigation';
import type { ReviewViewState } from '../_review/ReviewShared';
import { ProductInformationView } from './ProductInformationView';

const previewStates: ReviewViewState[] = ['loading', 'empty', 'error'];

// Review aid only: ?state=loading, ?state=empty or ?state=error previews that state.
// No results comes from the search itself.
export function ProductStateFromUrl() {
  const requested = useSearchParams().get('state') as ReviewViewState | null;
  return <ProductInformationView state={requested && previewStates.includes(requested) ? requested : 'ready'} />;
}
