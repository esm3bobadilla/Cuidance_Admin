import { adminScreens, structureOnlyNote, topLevelScreenIds } from '../../shared/content/admin-web-screens';
import { PageHeader } from '../components/layout/PageHeader';
import { ButtonLink } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { screenHref } from './_screens/ScreenPage';

export default function DashboardPage() {
  return (
    <main className="shell">
      <div className="intro">
        <PageHeader
          eyebrow="Internal tool"
          title="Cuidance Admin Web"
          description="A place for the Cuidance team to review and maintain the content behind the public Cuidance mobile app."
        />
        <p className="note">
          Practice build placeholder. Nothing here is connected to data yet, and these screens are
          not part of participant testing.
        </p>
      </div>

      <section className="section" aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="section-title">Admin Web sections</h2>
        <p className="note">{structureOnlyNote}</p>
        <ul className="areas">
          {topLevelScreenIds.map((id) => (
            <Card key={id} as="li" title={adminScreens[id].name} headingLevel={3}>
              <p className="area-description">{adminScreens[id].scopeNote}</p>
              <div>
                <ButtonLink variant="secondary" href={screenHref(id)}>
                  Open {adminScreens[id].name}
                </ButtonLink>
              </div>
            </Card>
          ))}
        </ul>
      </section>
    </main>
  );
}
