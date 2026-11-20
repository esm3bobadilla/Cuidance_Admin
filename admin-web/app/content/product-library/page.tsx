import { Suspense } from 'react';
import { productLibraryCopy as copy } from '../../../../shared/content/product-library';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ContentNav } from '../../_contentWorkspace/ContentNav';
import { ProductLibrary } from '../../_productLibrary/ProductLibrary';
import { ProductLibraryFromUrl } from '../../_productLibrary/ProductLibraryFromUrl';
import { screenMetadata } from '../../_screens/ScreenPage';

export const metadata = screenMetadata('product-library');

// Product Library (Admin / Content / Product Library, Phase 2 PR 1). Lives inside Content:
// the contextual Content navigation switches here, with no separate sidebar item.
// Sample data only: nothing is saved, uploaded or sent.
export default function Page() {
  return (
    <main className="shell">
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <ContentNav current="product-library" />
      <Suspense fallback={<ProductLibrary state="ready" />}>
        <ProductLibraryFromUrl />
      </Suspense>
    </main>
  );
}
