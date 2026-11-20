import { Suspense } from 'react';
import { LiveFromUrl } from '../../_live/LiveFromUrl';
import { LiveScreen } from '../../_live/LiveScreen';
import { screenMetadata } from '../../_screens/ScreenPage';

export const metadata = screenMetadata('live-app');

// Live: Cuidance App (Phase 2 PR 1). A static preview and the update history, with sample data.
// No publishing, push or external integration is connected.
export default function Page() {
  return (
    <Suspense fallback={<LiveScreen surface="app" state="ready" />}>
      <LiveFromUrl surface="app" />
    </Suspense>
  );
}
