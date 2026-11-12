import type { Metadata } from 'next';
import { Suspense } from 'react';
import { reviewTaskDetailCopy as copy } from '../../../../shared/content/review-task-detail';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LiveReviewTaskDetail } from '../../_reviewLoop/LiveReviewTaskDetail';

export const metadata: Metadata = { title: copy.pageTitle(copy.fallbackTitle) };

// Phase A2: Review Task Detail for Supabase tasks. A static site can't build one page per
// database task, so this one page reads the task from the address (?id=…).
// Sample mode keeps /review-tasks/seed-1/ to seed-5/ and shows "not available" here.
export default function Page() {
  return (
    <main className="shell">
      <Suspense fallback={<PageHeader eyebrow={copy.eyebrow} title={copy.fallbackTitle} description={copy.description} />}>
        <LiveReviewTaskDetail />
      </Suspense>
    </main>
  );
}
