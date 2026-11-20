'use client';

import { useSearchParams } from 'next/navigation';
import { ProductLibrary, type LibraryState } from './ProductLibrary';

const previewStates: LibraryState[] = ['loading', 'empty', 'error'];

// Review aid only, as on the other content screens: ?state=loading, ?state=empty or
// ?state=error previews that state. "No results" comes from the search itself.
export function ProductLibraryFromUrl() {
  const requested = useSearchParams().get('state') as LibraryState | null;
  return <ProductLibrary state={requested && previewStates.includes(requested) ? requested : 'ready'} />;
}
