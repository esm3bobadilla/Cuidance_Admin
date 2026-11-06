'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import {
  productInformationCopy as copy,
  productSeed,
  type Disclosure,
  type InformationStatus,
  type ProductRecord,
  type SourceStatus,
} from '../../../shared/content/product-information';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { Button } from '../../components/ui/Button';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import styles from './product.module.css';

const contentHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.content.path}`;

// PROVISIONAL status treatment (no approved status-to-token mapping yet). Text always shows.
function StatusLabel({ status }: { status: InformationStatus | SourceStatus }) {
  const done = status === 'Complete' || status === 'Reviewed';
  const className = done ? styles.statusDone : status === 'Needs update' ? styles.statusAlert : styles.statusNeutral;
  return (
    <span className={`${styles.status} ${className}`}>
      {done && (
        <span className={styles.statusIcon} aria-hidden="true">
          {uiSymbols.selected}
        </span>
      )}
      {status}
    </span>
  );
}

// Partner content always carries the Partner label: Byzantium Plum, ◆ and text
function DisclosureLabel({ disclosure }: { disclosure: Disclosure }) {
  if (disclosure !== 'Partner content') return <>{disclosure}</>;
  return (
    <span className={`${styles.status} ${styles.statusPartner}`}>
      <span className={styles.partnerIcon} aria-hidden="true">
        {uiSymbols.partner}
      </span>
      {disclosure}
    </span>
  );
}

const matches = (product: ProductRecord, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [product.name, product.brand, product.category, product.disclosure, product.informationStatus, product.sourceStatus].some((value) =>
    value.toLowerCase().includes(q),
  );
};

// Product Information (aligned with hi-fi A4): search, the product list, and the
// details of the selected product. Sample data only; nothing is saved.
export function ProductInformationView({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(productSeed[0].id);
  const detailId = useId();

  const all = state === 'ready' ? productSeed : [];
  const shown = useMemo(() => all.filter((p) => matches(p, query)), [all, query]);
  const selected = shown.find((p) => p.id === selectedId) ?? shown[0];

  const rows = shown.map((p) => ({
    id: p.id,
    cells: {
      name: (
        <button
          type="button"
          className={styles.rowButton}
          aria-pressed={p.id === selected?.id}
          aria-controls={detailId}
          onClick={() => setSelectedId(p.id)}
        >
          {p.name}
        </button>
      ),
      brand: p.brand,
      category: p.category,
      informationStatus: <StatusLabel status={p.informationStatus} />,
      sourceStatus: <StatusLabel status={p.sourceStatus} />,
      disclosure: <DisclosureLabel disclosure={p.disclosure} />,
      updated: p.updated,
    },
  }));

  const details = selected?.details;
  const partner = selected?.disclosure === 'Partner content';

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>

      <noscript>
        <style>{`.${styles.toolbar} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <SearchField
          id="product-search"
          label={copy.searchLabel}
          placeholder={copy.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={state !== 'ready'}
        />
      </div>

      <section className={styles.body} aria-label={copy.tableCaption} aria-busy={state === 'loading'}>
        {state !== 'ready' ? (
          <div className={styles.list}>
            <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={contentHref} />
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {shown.length > 0 ? (
                <DataTable
                  caption={copy.tableCaption}
                  columns={[
                    { key: 'name', header: copy.columns.name },
                    { key: 'brand', header: copy.columns.brand },
                    { key: 'category', header: copy.columns.category },
                    { key: 'informationStatus', header: copy.columns.informationStatus },
                    { key: 'sourceStatus', header: copy.columns.sourceStatus },
                    { key: 'disclosure', header: copy.columns.disclosure },
                    { key: 'updated', header: copy.columns.updated },
                  ]}
                  rows={rows}
                  selectedRowId={selected?.id}
                  compact
                />
              ) : (
                <div className={styles.noResults}>
                  <p className={styles.noResultsMessage}>
                    <span className={styles.noResultsSymbol} aria-hidden="true">
                      {uiSymbols.empty}
                    </span>
                    {copy.states.noResults}
                  </p>
                  <div>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setQuery('');
                        // This button goes away, so focus returns to the search field
                        document.getElementById('product-search')?.focus();
                      }}
                    >
                      {copy.states.clear}
                    </Button>
                  </div>
                </div>
              )}
              <p className={styles.count} role="status">
                {copy.count(shown.length, all.length)}
              </p>
            </div>

            {selected && (
              <aside id={detailId} className={styles.detail} aria-labelledby={`${detailId}-title`}>
                <p className={styles.detailLabel}>{copy.detail.heading}</p>
                <div className={styles.titleGroup}>
                  <h2 id={`${detailId}-title`} className={styles.detailTitle}>
                    {selected.name}
                  </h2>
                  <p className={styles.brandLine}>
                    <span className={styles.brand}>{selected.brand}</span>
                    <span className={styles.tag}>{selected.category}</span>
                  </p>
                </div>

                <div className={partner ? `${styles.disclosure} ${styles.disclosurePartner}` : styles.disclosure}>
                  <h3 className={styles.sectionLabel}>{copy.detail.disclosure}</h3>
                  <p className={styles.disclosureTitle}>
                    {partner && (
                      <span className={styles.partnerIcon} aria-hidden="true">
                        {uiSymbols.partner}
                      </span>
                    )}
                    {selected.disclosure}
                  </p>
                  <p className={partner ? styles.pending : styles.disclosureText}>{copy.disclosureText[selected.disclosure]}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.ingredientNotes}</h3>
                  <p className={details ? styles.sectionText : styles.pending}>{details?.ingredientNotes ?? copy.detail.pending}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.educationalDescription}</h3>
                  <p className={details ? styles.sectionText : styles.pending}>{details?.educationalDescription ?? copy.detail.pending}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.sourceReference}</h3>
                  {details ? (
                    <p className={styles.source}>
                      <span className={styles.sourceTitle}>{details.sourceReference.title}</span>
                      <span className={styles.caption}>{copy.detail.accessed(details.sourceReference.accessed)}</span>
                    </p>
                  ) : (
                    <p className={styles.pending}>{copy.detail.pending}</p>
                  )}
                </div>

                <div className={`${styles.section} ${styles.statusGrid}`}>
                  <div className={styles.statusBlock}>
                    <h3 className={styles.sectionLabel}>{copy.detail.informationStatus}</h3>
                    <div>
                      <StatusLabel status={selected.informationStatus} />
                    </div>
                    <p className={styles.caption}>{copy.detail.lastUpdated(selected.updated, details?.lastUpdatedBy)}</p>
                  </div>
                  <div className={styles.statusBlock}>
                    <h3 className={styles.sectionLabel}>{copy.detail.sourceStatus}</h3>
                    <div>
                      <StatusLabel status={selected.sourceStatus} />
                    </div>
                    <p className={styles.caption}>
                      {details ? copy.detail.lastReviewed(details.lastReviewed, details.lastReviewedBy) : copy.detail.pending}
                    </p>
                  </div>
                </div>
              </aside>
            )}
          </>
        )}
      </section>
    </div>
  );
}
