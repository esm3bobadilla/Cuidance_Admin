'use client';

import { useSearchParams } from 'next/navigation';
import type { LiveSurface } from '../../../shared/content/live';
import { LiveScreen, type LiveViewState } from './LiveScreen';

const previewStates: LiveViewState[] = ['loading', 'empty', 'error', 'unavailable'];

// Review aid only, as on the content screens: ?state=loading, empty, error or unavailable
export function LiveFromUrl({ surface }: { surface: LiveSurface }) {
  const requested = useSearchParams().get('state') as LiveViewState | null;
  return <LiveScreen surface={surface} state={requested && previewStates.includes(requested) ? requested : 'ready'} />;
}
