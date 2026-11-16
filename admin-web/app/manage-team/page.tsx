import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('manage-team');

// Phase B1: route added with the new navigation. The page layout follows in Phase 2.
export default function Page() {
  return <ScreenPage id="manage-team" />;
}
