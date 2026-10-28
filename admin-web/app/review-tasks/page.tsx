import { Suspense } from 'react';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';
import { ReviewTasksContent } from '../_reviewTasks/ReviewTasksContent';
import { ReviewTasksStateFromUrl } from '../_reviewTasks/ReviewTasksStateFromUrl';

export const metadata = screenMetadata('review-tasks');

// Review Tasks: the same title, breadcrumb and back link as the other screens, with seeded review tasks
export default function Page() {
  return (
    <ScreenPage id="review-tasks">
      {/* The static page shows the seeded tasks, so it works without JavaScript */}
      <Suspense fallback={<ReviewTasksContent state="ready" />}>
        <ReviewTasksStateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
