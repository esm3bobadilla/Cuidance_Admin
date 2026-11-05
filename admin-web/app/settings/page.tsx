import { rolesCopy } from '../../../shared/content/admin-roles';
import { RolesPolicy } from '../../components/content/RolesPolicy';
import { ScreenPage, screenMetadata } from '../_screens/ScreenPage';

export const metadata = screenMetadata('settings');

export default function Page() {
  return (
    <ScreenPage id="settings">
      <p className="note">{rolesCopy.settingsNote}</p>
      <div className="section">
        <RolesPolicy />
      </div>
    </ScreenPage>
  );
}
