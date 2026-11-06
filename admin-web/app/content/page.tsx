import { shellCopy } from '../../../shared/content/admin-web-screens';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('content');

// Content landing page (C4 still open): the six content pages as one panel of link tiles,
// the same pattern as the Dashboard's Key Areas. No hi-fi shows this page (PROVISIONAL).
// Commercial Content is approved (C7) and keeps its tile.
export default function Page() {
  return <ScreenPage id="content" eyebrow={shellCopy.internalToolEyebrow} childLayout="panel" showStructureNote={false} />;
}
