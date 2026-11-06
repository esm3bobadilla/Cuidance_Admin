import { Suspense } from 'react';
import { shellCopy } from '../../../shared/content/admin-web-screens';
import { GuidanceRulesView } from '../_rules/GuidanceRulesView';
import { StateFromUrl } from '../_rules/StateFromUrl';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('guidance-rules-review');

// Aligned with the approved Week 9 hi-fi. Sample data only; the static page works without JavaScript.
export default function Page() {
  return (
    <ScreenPage id="guidance-rules-review" eyebrow={shellCopy.internalToolEyebrow}>
      <Suspense fallback={<GuidanceRulesView state="ready" />}>
        <StateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
