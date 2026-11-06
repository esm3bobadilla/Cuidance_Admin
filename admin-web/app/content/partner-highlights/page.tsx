import { Suspense } from 'react';
import { shellCopy } from '../../../../shared/content/admin-web-screens';
import { PartnerHighlightsView } from '../../_partners/PartnerHighlightsView';
import { StateFromUrl } from '../../_partners/StateFromUrl';
import { ScreenPage, screenMetadata } from '../../_screens/ScreenPage';

export const metadata = screenMetadata('partner-highlights');

// Sample data only. The static page shows the list, so it works without JavaScript.
export default function Page() {
  return (
    <ScreenPage id="partner-highlights" eyebrow={shellCopy.internalToolEyebrow}>
      <Suspense fallback={<PartnerHighlightsView state="ready" />}>
        <StateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
