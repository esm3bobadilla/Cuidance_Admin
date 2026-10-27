import { Suspense } from 'react';
import { dashboardCopy as copy } from '../../shared/content/dashboard-review-queue';
import { PageHeader } from '../components/layout/PageHeader';
import { DashboardContent } from './_dashboard/DashboardContent';
import { DashboardStateFromUrl } from './_dashboard/DashboardStateFromUrl';

// Dashboard / Review Queue (Week 10 Step 3), built from the Team 03 hi-fi screen with seed data
export default function DashboardPage() {
  return (
    <main className="shell">
      <div className="intro">
        <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        <p className="note">{copy.sampleDataNote}</p>
      </div>

      {/* The static page shows the seeded Review Queue, so it works without JavaScript */}
      <Suspense fallback={<DashboardContent state="ready" />}>
        <DashboardStateFromUrl />
      </Suspense>
    </main>
  );
}
