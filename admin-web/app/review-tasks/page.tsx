import { Suspense } from 'react';
import { reviewTasksCopy } from '../../../shared/content/review-tasks';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';
import { ReviewTasksContent } from '../_reviewTasks/ReviewTasksContent';
import { ReviewTasksStateFromUrl } from '../_reviewTasks/ReviewTasksStateFromUrl';

export const metadata = screenMetadata('review-tasks');

// Review Tasks, aligned with the approved Week 9 hi-fi, with the seeded review tasks
export default function Page() {
  return (
    <ScreenPage id="review-tasks" eyebrow={reviewTasksCopy.eyebrow}>
      {/* The static page shows the seeded tasks, so it works without JavaScript */}
      <Suspense fallback={<ReviewTasksContent state="ready" />}>
        <ReviewTasksStateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
