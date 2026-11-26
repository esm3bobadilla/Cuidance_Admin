import { metricsOverviewCopy as copy } from '../../../shared/content/metrics-overview';
import heroMetrics from '../../../shared/brand/heroes/hero-metrics.webp';
import { HeroBanner, packageHeroFrame } from '../../components/ui/HeroBanner';
import { MetricsOverview } from '../_metrics/MetricsOverview';
import { screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('content-metrics');

// Metrics (Phase B1, approved prototype): App, Website and Communication tabs, sample numbers only
export default function Page() {
  return (
    <main className="shell">
      <HeroBanner eyebrow={copy.heroEyebrow} title={copy.heroTitle} description={copy.heroSubtitle} image={heroMetrics} {...packageHeroFrame} />
      <MetricsOverview />
    </main>
  );
}
