import { Suspense } from 'react';
import { assignTaskCopy as copy } from '../../../shared/content/assign-task';
import heroReview from '../../../shared/brand/heroes/hero-review.jpg';
import { HeroBanner } from '../../components/ui/HeroBanner';
import { screenMetadata } from '../_screens/ScreenPage';
import { AssignTask } from '../_reviewTasks/AssignTask';
import { ReviewTasksContent } from '../_reviewTasks/ReviewTasksContent';
import { ReviewTasksStateFromUrl } from '../_reviewTasks/ReviewTasksStateFromUrl';

export const metadata = screenMetadata('review-tasks');

// Review Tasks (Phase B1, approved prototype): hero, Assign task, then the review queue
// (seeded tasks, or the database in Supabase mode) with the selected task beside it.
export default function Page() {
  return (
    <main className="shell">
      <HeroBanner title={copy.heroTitle} description={copy.heroSubtitle} image={heroReview} />
      <AssignTask>
        {/* The static page shows the seeded tasks, so it works without JavaScript */}
        <Suspense fallback={<ReviewTasksContent state="ready" />}>
          <ReviewTasksStateFromUrl />
        </Suspense>
      </AssignTask>
    </main>
  );
}
