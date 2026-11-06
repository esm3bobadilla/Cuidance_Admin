import { Suspense } from 'react';
import { shellCopy } from '../../../shared/content/admin-web-screens';
import { ContentMetricsView } from '../_metrics/ContentMetricsView';
import { StateFromUrl } from '../_metrics/StateFromUrl';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('content-metrics');

// Aligned with the approved Week 9 hi-fi. Sample data only; the static page works without JavaScript.
export default function Page() {
  return (
    <ScreenPage id="content-metrics" eyebrow={shellCopy.internalToolEyebrow}>
      <Suspense fallback={<ContentMetricsView state="ready" />}>
        <StateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
