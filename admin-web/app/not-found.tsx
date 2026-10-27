import type { Metadata } from 'next';
import { PageHeader } from '../components/layout/PageHeader';
import { ButtonLink } from '../components/ui/Button';

export const metadata: Metadata = {
  title: 'Page not found · Cuidance Admin Web',
};

// Exported as 404.html. GitHub Pages shows it for any address that doesn't exist.
export default function NotFound() {
  return (
    <main className="shell">
      <PageHeader
        title="Page not found"
        description="This page doesn't exist in Cuidance Admin Web. The link may be old, or the address may have a typo."
        actions={
          <ButtonLink variant="primary" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`}>
            Return to Dashboard
          </ButtonLink>
        }
      />
    </main>
  );
}
