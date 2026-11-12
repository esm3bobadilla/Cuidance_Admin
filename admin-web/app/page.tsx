import { Suspense } from 'react';
import { dashboardCopy as copy } from '../../shared/content/dashboard-review-queue';
import { supabaseModeCopy } from '../../shared/content/supabase-mode';
import { isSupabaseMode } from './_data/config';
import { PageHeader } from '../components/layout/PageHeader';
import { DashboardContent } from './_dashboard/DashboardContent';
import { DashboardStateFromUrl } from './_dashboard/DashboardStateFromUrl';
import styles from './_dashboard/dashboard.module.css';
import handsJar from '../../shared/brand/illustrations/illus-hands-jar.png';
import leafShape from '../../shared/brand/illustrations/shape-leaf.png';

// Dashboard / Review Queue (Week 10 Step 3), built from the Team 03 hi-fi screen with seed data
export default function DashboardPage() {
  return (
    <main className="shell">
      {/* Phase A1: the top display banner, with approved flat Cuidance illustrations (decorative) */}
      <div className={styles.banner}>
        <div className="intro">
          <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
          <p className="note">{isSupabaseMode ? supabaseModeCopy.dataNote : copy.sampleDataNote}</p>
        </div>
        <div className={styles.bannerArt} aria-hidden="true">
          <img className={styles.bannerLeaf} src={leafShape.src} width={leafShape.width} height={leafShape.height} alt="" />
          <img className={styles.bannerJar} src={handsJar.src} width={handsJar.width} height={handsJar.height} alt="" />
        </div>
      </div>

      {/* The static page shows the seeded Review Queue, so it works without JavaScript */}
      <Suspense fallback={<DashboardContent state="ready" />}>
        <DashboardStateFromUrl />
      </Suspense>
    </main>
  );
}
