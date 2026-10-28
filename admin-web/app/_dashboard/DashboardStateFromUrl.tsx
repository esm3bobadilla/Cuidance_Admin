'use client';

import { useSearchParams } from 'next/navigation';
import { DashboardContent, type DashboardState } from './DashboardContent';

const previewStates: DashboardState[] = ['loading', 'empty', 'error'];

// Review aid only: ?state=loading, ?state=empty or ?state=error shows that state with
// the seed data. Any other address shows the seeded Review Queue.
export function DashboardStateFromUrl() {
  const requested = useSearchParams().get('state') as DashboardState | null;
  const state = requested && previewStates.includes(requested) ? requested : 'ready';
  return <DashboardContent state={state} />;
}
