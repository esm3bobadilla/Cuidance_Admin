import { Suspense } from 'react';
import { claimsCopy } from '../../../shared/content/claims-safety-review';
import { ClaimsReviewView } from '../_claims/ClaimsReviewView';
import { ClaimsStateFromUrl } from '../_claims/ClaimsStateFromUrl';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('claims-safety-review');

// Claims & Safety Review, aligned with the approved Week 9 hi-fi (A5). Sample data only.
export default function Page() {
  return (
    <ScreenPage id="claims-safety-review" eyebrow={claimsCopy.eyebrow}>
      {/* The static page shows the sample list, so it works without JavaScript */}
      <Suspense fallback={<ClaimsReviewView state="ready" />}>
        <ClaimsStateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
