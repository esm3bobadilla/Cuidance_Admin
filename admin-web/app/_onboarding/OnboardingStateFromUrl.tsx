'use client';

import { useSearchParams } from 'next/navigation';
import { AcceptInvitationView, type InvitationPreview } from './AcceptInvitationView';
import { AccountSetupView, type SetupPreview } from './AccountSetupView';

const invitationPreviews: InvitationPreview[] = ['loading', 'expired', 'declined', 'not-found', 'accepted'];
const setupPreviews: SetupPreview[] = ['loading', 'missing', 'submit-error', 'success'];

// ?invite= picks a sample invitation (none or "sample": valid; "expired"; anything else: not found).
// ?state= is a review aid only: it shows that state without saving anything.
export function InvitationFromUrl() {
  const params = useSearchParams();
  const state = params.get('state') as InvitationPreview | null;
  return <AcceptInvitationView inviteParam={params.get('invite')} preview={state && invitationPreviews.includes(state) ? state : undefined} />;
}

export function AccountSetupFromUrl() {
  const state = useSearchParams().get('state') as SetupPreview | null;
  return <AccountSetupView preview={state && setupPreviews.includes(state) ? state : undefined} />;
}
