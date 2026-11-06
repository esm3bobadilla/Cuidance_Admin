import type { Metadata } from 'next';
import { Suspense } from 'react';
import { reviewTasksSeed } from '../../../../shared/content/review-tasks';
import { reviewTaskDetailCopy as copy } from '../../../../shared/content/review-task-detail';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ReviewTaskDetailStateFromUrl } from '../../_reviewLoop/ReviewTaskDetailStateFromUrl';
import { ReviewTaskDetailView } from '../../_reviewLoop/ReviewTaskDetailView';

type Props = { params: Promise<{ taskId: string }> };

// One static page per seeded task (/review-tasks/seed-1/ to seed-5/). Any other
// task address isn't built, so it shows the site's "Page not found".
export const dynamicParams = false;

export function generateStaticParams() {
  return reviewTasksSeed.map((task) => ({ taskId: task.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskId } = await params;
  const task = reviewTasksSeed.find((item) => item.id === taskId);
  return { title: copy.pageTitle(task?.item ?? copy.fallbackTitle) };
}

// Review Task Detail (Week 11, Close the Loop, feature 1): the task, the review
// decision and this tab's decision history. Sample data only.
export default async function Page({ params }: Props) {
  const { taskId } = await params;
  const task = reviewTasksSeed.find((item) => item.id === taskId);

  return (
    <main className="shell">
      <PageHeader eyebrow={copy.eyebrow} title={task?.item ?? copy.fallbackTitle} description={copy.description} />
      {/* The static page shows the seeded task, so it works without JavaScript */}
      <Suspense fallback={<ReviewTaskDetailView taskId={taskId} state="ready" />}>
        <ReviewTaskDetailStateFromUrl taskId={taskId} />
      </Suspense>
    </main>
  );
}
