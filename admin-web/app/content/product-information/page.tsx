import { Suspense } from 'react';
import { productInformationCopy } from '../../../../shared/content/product-information';
import { ProductInformationView } from '../../_product/ProductInformationView';
import { ProductStateFromUrl } from '../../_product/ProductStateFromUrl';
import { ScreenPage, screenMetadata } from '../../_screens/ScreenPage';

export const metadata = screenMetadata('product-information');

// Product Information, aligned with the approved Week 9 hi-fi (A4). Sample data only.
export default function Page() {
  return (
    <ScreenPage id="product-information" eyebrow={productInformationCopy.eyebrow}>
      {/* The static page shows the sample list, so it works without JavaScript */}
      <Suspense fallback={<ProductInformationView state="ready" />}>
        <ProductStateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
