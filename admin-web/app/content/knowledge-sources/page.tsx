import { Suspense } from 'react';
import { shellCopy } from '../../../../shared/content/admin-web-screens';
import { KnowledgeSourcesView } from '../../_sources/KnowledgeSourcesView';
import { StateFromUrl } from '../../_sources/StateFromUrl';
import { ScreenPage, screenMetadata } from '../../_screens/ScreenPage';

export const metadata = screenMetadata('knowledge-sources');

// Sample data only. The static page shows the list, so it works without JavaScript.
export default function Page() {
  return (
    <ScreenPage id="knowledge-sources" eyebrow={shellCopy.internalToolEyebrow}>
      <Suspense fallback={<KnowledgeSourcesView state="ready" />}>
        <StateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
