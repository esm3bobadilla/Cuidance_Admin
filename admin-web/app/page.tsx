import { dashboardCopy as copy } from '../../shared/content/dashboard-review-queue';
import { supabaseModeCopy } from '../../shared/content/supabase-mode';
import { isSupabaseMode } from './_data/config';
import {
  DashboardActivity,
  DashboardDecisionNotice,
  DashboardGlance,
  DashboardHero,
  DashboardLiveStatus,
  DashboardQuickWork,
} from './_dashboard/DashboardHome';
import styles from './_dashboard/dashboardHome.module.css';

// Dashboard (Phase B1, latest approved prototype): hero, Today at a glance, Quick work
// beside Live status, then Recent activity. Items for review is live in Supabase mode.
export default function DashboardPage() {
  return (
    <main className="shell">
      <DashboardHero />
      <DashboardDecisionNotice />
      <p className="note">{isSupabaseMode ? supabaseModeCopy.dataNote : copy.sampleDataNote}</p>
      <DashboardGlance />
      <div className={styles.pair}>
        <DashboardQuickWork />
        <DashboardLiveStatus />
      </div>
      <DashboardActivity />
    </main>
  );
}
