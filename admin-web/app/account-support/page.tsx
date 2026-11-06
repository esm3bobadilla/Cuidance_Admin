import { Suspense } from 'react';
import { shellCopy } from '../../../shared/content/admin-web-screens';
import { AccountSupportView } from '../_support/AccountSupportView';
import { StateFromUrl } from '../_support/StateFromUrl';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('account-support');

// Aligned with the approved Week 9 hi-fi. Sample data only; the static page works without JavaScript.
export default function Page() {
  return (
    <ScreenPage id="account-support" eyebrow={shellCopy.internalToolEyebrow}>
      <Suspense fallback={<AccountSupportView state="ready" />}>
        <StateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
