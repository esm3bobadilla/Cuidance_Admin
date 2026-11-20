import type { Metadata } from 'next';
import { forgotPasswordCopy } from '../../../shared/content/sign-in';
import { ForgotPasswordView } from '../_onboarding/ForgotPasswordView';

export const metadata: Metadata = { title: forgotPasswordCopy.pageTitle };

// Forgot Password (Phase 3): ask for a reset link. Sample mode sends nothing.
export default function Page() {
  return <ForgotPasswordView />;
}
