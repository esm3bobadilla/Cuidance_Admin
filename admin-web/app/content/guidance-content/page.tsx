import { Suspense } from 'react';
import { shellCopy } from '../../../../shared/content/admin-web-screens';
import { GuidanceContentView } from '../../_guidance/GuidanceContentView';
import { StateFromUrl } from '../../_guidance/StateFromUrl';
import { ScreenPage, screenMetadata } from '../../_screens/ScreenPage';

export const metadata = screenMetadata('guidance-content');

// Sample data only. The static page shows the list, so it works without JavaScript.
export default function Page() {
  return (
    <ScreenPage id="guidance-content" eyebrow={shellCopy.internalToolEyebrow}>
      <Suspense fallback={<GuidanceContentView state="ready" />}>
        <StateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
