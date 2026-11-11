import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createAccountCopy } from '../../../shared/content/sign-in';
import { CreateAccountView } from '../_onboarding/CreateAccountView';
import { CreateAccountFromUrl } from '../_onboarding/OnboardingStateFromUrl';

export const metadata: Metadata = { title: createAccountCopy.pageTitle };

// Create Account (Phase A1). Invitation only: finds an invitation, never creates an account by itself.
export default function Page() {
  return (
    <Suspense fallback={<CreateAccountView />}>
      <CreateAccountFromUrl />
    </Suspense>
  );
}
