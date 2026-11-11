import type { Metadata } from 'next';
import { Suspense } from 'react';
import { signInCopy } from '../../../shared/content/sign-in';
import { SignInFromUrl } from '../_onboarding/OnboardingStateFromUrl';
import { SignInView } from '../_onboarding/SignInView';

export const metadata: Metadata = { title: signInCopy.pageTitle };

// Sign In (Phase A1): the Admin Web landing and sign-in entry. Prototype only: sign-in isn't connected.
export default function Page() {
  return (
    <Suspense fallback={<SignInView />}>
      <SignInFromUrl />
    </Suspense>
  );
}
