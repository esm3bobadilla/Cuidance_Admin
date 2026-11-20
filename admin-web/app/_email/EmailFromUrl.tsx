'use client';

import { useSearchParams } from 'next/navigation';
import { EmailWorkspace, type EmailViewState } from './EmailWorkspace';

const previewStates: EmailViewState[] = ['loading', 'empty', 'error'];

// Review aid only, as on the content screens: ?state=loading, ?state=empty or ?state=error
export function EmailFromUrl() {
  const requested = useSearchParams().get('state') as EmailViewState | null;
  return <EmailWorkspace state={requested && previewStates.includes(requested) ? requested : 'ready'} />;
}
