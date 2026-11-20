import { contentWorkspaceCopy as copy } from '../../../shared/content/content-workspace';
import heroContent from '../../../shared/brand/heroes/hero-content.jpg';
import { HeroBanner } from '../../components/ui/HeroBanner';
import { ContentNav } from '../_contentWorkspace/ContentNav';
import { ContentWorkspace } from '../_contentWorkspace/ContentWorkspace';
import { screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('content');

// Consolidated Content workspace (Phase B1, Team 03 decision): one list of every content
// item, with search, filters and a New content editor. Area pages keep the details.
// Phase 2 PR 1: the contextual Content navigation switches to the Product Library.
export default function Page() {
  return (
    <main className="shell">
      <HeroBanner title={copy.heroTitle} description={copy.heroSubtitle} image={heroContent} />
      <ContentNav current="content" />
      <p className="note">{copy.sampleNote}</p>
      <ContentWorkspace />
    </main>
  );
}
