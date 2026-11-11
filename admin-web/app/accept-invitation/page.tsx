import type { Metadata } from 'next';
import { Suspense } from 'react';
import { invitationCopy } from '../../../shared/content/invitation';
import { AcceptInvitationView } from '../_onboarding/AcceptInvitationView';
import { InvitationFromUrl } from '../_onboarding/OnboardingStateFromUrl';

export const metadata: Metadata = { title: invitationCopy.pageTitle };

// Accept Invitation (Week 11 feature 2). Prototype only: sample invitation, no tokens or email.
export default function Page() {
  return (
    // The static page shows the sample invitation, so it reads without JavaScript
    <Suspense fallback={<AcceptInvitationView inviteParam={null} />}>
      <InvitationFromUrl />
    </Suspense>
  );
}
