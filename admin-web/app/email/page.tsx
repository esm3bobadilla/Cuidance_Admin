import { Suspense } from 'react';
import { EmailFromUrl } from '../_email/EmailFromUrl';
import { EmailWorkspace } from '../_email/EmailWorkspace';
import { screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('email');

// Email workspace (Communication / Email, Phase 2 PR 1): templates, drafts, scheduled and
// sent email, with an editor and preview. Sample data only: no email provider is connected,
// so nothing is sent or scheduled for real.
export default function Page() {
  return (
    <Suspense fallback={<EmailWorkspace state="ready" />}>
      <EmailFromUrl />
    </Suspense>
  );
}
