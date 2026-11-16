import { profilePageCopy as copy } from '../../../shared/content/account-pages';
import { PageHeader } from '../../components/layout/PageHeader';
import { ProfileView } from '../_account/ProfileView';
import { screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('profile');

// Profile (Phase B1, approved prototype): profile card, notifications and recent activity
export default function Page() {
  return (
    <main className="shell">
      <PageHeader title={copy.title} description={copy.description} />
      <ProfileView />
    </main>
  );
}
