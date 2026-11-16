import { manageTeamCopy as copy } from '../../../shared/content/account-pages';
import { PageHeader } from '../../components/layout/PageHeader';
import { ManageTeamView } from '../_account/ManageTeamView';
import { screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('manage-team');

// Manage Team (Phase B1, approved prototype). Super Admins and Admins only (permission
// matrix). Sample roster in sample mode; the live members and invitations in Supabase mode.
export default function Page() {
  return (
    <main className="shell">
      <PageHeader title={copy.title} description={copy.description} />
      <ManageTeamView />
    </main>
  );
}
