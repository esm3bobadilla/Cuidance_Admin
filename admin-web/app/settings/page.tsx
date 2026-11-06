import { Suspense } from 'react';
import { teamAccessCopy } from '../../../shared/content/team-access';
import { TeamAccessStateFromUrl } from '../_settings/TeamAccessStateFromUrl';
import { TeamAccessView } from '../_settings/TeamAccessView';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('settings');

// Settings: static Team Access (prototype F09) and the approved roles policy card.
// No new route: Team Access sits on Settings until Team 03 approves its own route (D10).
export default function Page() {
  return (
    <ScreenPage id="settings" eyebrow={teamAccessCopy.eyebrow}>
      {/* The static page shows every member, so it works without JavaScript */}
      <Suspense fallback={<TeamAccessView state="ready" />}>
        <TeamAccessStateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
