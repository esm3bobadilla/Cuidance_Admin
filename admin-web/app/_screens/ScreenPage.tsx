import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { adminScreens, childScreens, structureOnlyNote, type AdminScreenId } from '../../../shared/content/admin-web-screens';
import { PageHeader } from '../../components/layout/PageHeader';
import { ButtonLink } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Plain links need the GitHub Pages base path added by hand
export function screenHref(id: AdminScreenId) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens[id].path}`;
}

export function screenMetadata(id: AdminScreenId): Metadata {
  return { title: `${adminScreens[id].name} · Cuidance Admin Web` };
}

// Week 10 Step 2 structural screen: title, parent context, scope note and links.
// A built screen passes its content as children, which replaces the "structure only" note.
// The breadcrumb is in the shared top bar, and there are no back links (prototype shell, Team 03).
export function ScreenPage({ id, children: content }: { id: AdminScreenId; children?: ReactNode }) {
  const screen = adminScreens[id];
  const parent = screen.parent ? adminScreens[screen.parent] : undefined;
  const children = childScreens(id);

  return (
    <main className="shell">
      <PageHeader
        eyebrow={parent && parent.id !== 'dashboard' ? parent.name : undefined}
        title={screen.name}
        description={screen.scopeNote}
      />

      {content ?? <p className="note">{structureOnlyNote}</p>}

      {children.length > 0 && (
        <section className="section" aria-labelledby={`${id}-children`}>
          <h2 id={`${id}-children`} className="section-title">
            {screen.name} pages
          </h2>
          <ul className="areas">
            {children.map((child) => (
              <Card key={child.id} as="li" title={child.name} headingLevel={3}>
                <p className="area-description">{child.scopeNote}</p>
                <div>
                  <ButtonLink variant="secondary" href={screenHref(child.id)}>
                    Open {child.name}
                  </ButtonLink>
                </div>
              </Card>
            ))}
          </ul>
        </section>
      )}

      {screen.related && (
        <section className="section" aria-labelledby={`${id}-related`}>
          <h2 id={`${id}-related`} className="section-title">
            Related
          </h2>
          <ul className="areas">
            {screen.related.map((relatedId) => (
              <Card key={relatedId} as="li" title={adminScreens[relatedId].name} headingLevel={3}>
                <p className="area-description">{adminScreens[relatedId].scopeNote}</p>
                <div>
                  <ButtonLink variant="secondary" href={screenHref(relatedId)}>
                    Go to {adminScreens[relatedId].name}
                  </ButtonLink>
                </div>
              </Card>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
