import { Suspense } from 'react';
import { dashboardCopy as copy } from '../../shared/content/dashboard-review-queue';
import { supabaseModeCopy } from '../../shared/content/supabase-mode';
import { isSupabaseMode } from './_data/config';
import { DashboardContent } from './_dashboard/DashboardContent';
import { DashboardActivity, DashboardGlance, DashboardHero, DashboardQuickWork } from './_dashboard/DashboardHome';
import { DashboardStateFromUrl } from './_dashboard/DashboardStateFromUrl';

// Dashboard (Phase B1, approved prototype): hero, Today at a glance, Quick work, then the
// Review Queue (live in Supabase mode, seed data otherwise) and Recent activity.
export default function DashboardPage() {
  return (
    <main className="shell">
      <DashboardHero />
      <p className="note">{isSupabaseMode ? supabaseModeCopy.dataNote : copy.sampleDataNote}</p>
      <DashboardGlance />
      <DashboardQuickWork />

      {/* The static page shows the seeded Review Queue, so it works without JavaScript */}
      <Suspense fallback={<DashboardContent state="ready" />}>
        <DashboardStateFromUrl />
      </Suspense>

      <DashboardActivity />
    </main>
  );
}
