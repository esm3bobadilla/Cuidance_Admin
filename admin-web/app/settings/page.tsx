import { settingsPageCopy as copy } from '../../../shared/content/account-pages';
import { PageHeader } from '../../components/layout/PageHeader';
import { NotificationAndTeamSettings, WorkspaceAndReviewSettings } from '../_account/SettingsSections';
import { DisplaySettingsSection } from '../_settings/DisplaySettingsSection';
import { screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('settings');

// Settings (Phase B1, approved prototype): Workspace, Review settings, Accessibility &
// display, Notifications & security, and Team access (which now opens Manage Team).
export default function Page() {
  return (
    <main className="shell">
      <PageHeader title={copy.title} description={copy.description} />
      <p className="note">{copy.sampleNote}</p>
      <WorkspaceAndReviewSettings />
      <DisplaySettingsSection />
      <NotificationAndTeamSettings />
    </main>
  );
}
