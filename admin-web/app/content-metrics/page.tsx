import { Suspense } from 'react';
import { metricsOverviewCopy as copy } from '../../../shared/content/metrics-overview';
import heroMetrics from '../../../shared/brand/heroes/hero-metrics.jpg';
import { HeroBanner } from '../../components/ui/HeroBanner';
import { ContentMetricsView } from '../_metrics/ContentMetricsView';
import { MetricsOverview } from '../_metrics/MetricsOverview';
import { StateFromUrl } from '../_metrics/StateFromUrl';
import { screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('content-metrics');

// Metrics (Phase B1, approved prototype): App, Website and Communication tabs with sample
// numbers, plus the existing internal Content metrics view as its own tab.
export default function Page() {
  return (
    <main className="shell">
      <HeroBanner eyebrow={copy.heroEyebrow} title={copy.heroTitle} description={copy.heroSubtitle} image={heroMetrics} />
      <MetricsOverview
        contentView={
          <Suspense fallback={<ContentMetricsView state="ready" />}>
            <StateFromUrl />
          </Suspense>
        }
      />
    </main>
  );
}
