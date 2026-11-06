import { Suspense } from 'react';
import { shellCopy } from '../../../../shared/content/admin-web-screens';
import { CommercialContentView } from '../../_commercial/CommercialContentView';
import { StateFromUrl } from '../../_commercial/StateFromUrl';
import { ScreenPage, screenMetadata } from '../../_screens/ScreenPage';

export const metadata = screenMetadata('commercial-content');

// Sample data only. The static page shows the list, so it works without JavaScript.
export default function Page() {
  return (
    <ScreenPage id="commercial-content" eyebrow={shellCopy.internalToolEyebrow}>
      <Suspense fallback={<CommercialContentView state="ready" />}>
        <StateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
