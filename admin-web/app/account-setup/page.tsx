import type { Metadata } from 'next';
import { Suspense } from 'react';
import { accountSetupCopy } from '../../../shared/content/account-setup';
import { AccountSetupView } from '../_onboarding/AccountSetupView';
import { AccountSetupFromUrl } from '../_onboarding/OnboardingStateFromUrl';

export const metadata: Metadata = { title: accountSetupCopy.pageTitle };

// Account Setup (Week 11 feature 2). Prototype only: no account is created and the password is never saved.
export default function Page() {
  return (
    <Suspense fallback={<AccountSetupView />}>
      <AccountSetupFromUrl />
    </Suspense>
  );
}
