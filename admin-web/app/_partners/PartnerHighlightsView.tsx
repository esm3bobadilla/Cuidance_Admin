'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { partnerHighlightsCopy as copy, partnerHighlightSeed, type PartnerHighlight, type PartnerStatus } from '../../../shared/content/partner-highlights';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import { NoResults } from '../_listDetail/NoResults';
import { StatusChip, type ChipTone } from '../_listDetail/StatusChip';
import styles from '../_listDetail/listDetail.module.css';

const contentHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.content.path}`;
const tone: Record<PartnerStatus, ChipTone> = { Approved: 'success', 'In review': 'neutral', Draft: 'draft' };

const matches = (h: PartnerHighlight, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || [h.title, h.label, h.partner, h.placement, h.disclosureType, h.status].some((v) => v.toLowerCase().includes(q));
};

// Partner Highlights (aligned with the approved hi-fi): the separation banner, search,
// the list with Partner content or Sponsored labels, and the selected item's details.
// Sample data only; nothing is created, edited, approved or published.
export function PartnerHighlightsView({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(partnerHighlightSeed[0].id);
  const detailId = useId();
  const all = state === 'ready' ? partnerHighlightSeed : [];
  const shown = useMemo(() => all.filter((h) => matches(h, query)), [all, query]);
  const selected = shown.find((h) => h.id === selectedId) ?? shown[0];
  const details = selected?.details;

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>
      <p className={styles.banner}>
        <span className={styles.bannerTitle}>{copy.bannerTitle}</span>
        <span>{copy.bannerText}</span>
      </p>
      <noscript>
        <style>{`.${styles.toolbar} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchField id="partners-search" label={copy.searchLabel} placeholder={copy.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} disabled={state !== 'ready'} />
        </div>
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
                    { key: 'title', header: copy.columns.title },
                    { key: 'partner', header: copy.columns.partner },
                    { key: 'placement', header: copy.columns.placement },
                    { key: 'disclosureType', header: copy.columns.disclosureType },
                    { key: 'status', header: copy.columns.status },
                    { key: 'updated', header: copy.columns.updated },
                  ]}
                  rows={shown.map((h) => ({
                    id: h.id,
                    cells: {
                      title: (
                        <span className={styles.stack}>
                          <button type="button" className={styles.rowButton} aria-pressed={h.id === selected?.id} aria-controls={detailId} onClick={() => setSelectedId(h.id)}>
                            {h.title}
                          </button>
                          <StatusChip tone="partner">{h.label}</StatusChip>
                        </span>
                      ),
                      partner: h.partner,
                      placement: h.placement,
                      disclosureType: h.disclosureType,
                      status: <StatusChip tone={tone[h.status]}>{h.status}</StatusChip>,
                      updated: h.updated,
                    },
                  }))}
                  selectedRowId={selected?.id}
                  compact
                />
              ) : (
                <NoResults message={copy.states.noResults} clearLabel={copy.states.clear} searchId="partners-search" onClear={() => setQuery('')} />
              )}
              <p className={styles.count} role="status">
                {copy.count(shown.length, all.length)}
              </p>
            </div>

            {selected && (
              <aside id={detailId} className={styles.detail} aria-labelledby={`${detailId}-title`}>
                <p className={styles.detailLabel}>{copy.detail.heading}</p>
                <h2 id={`${detailId}-title`} className={styles.detailTitle}>
                  {selected.title}
                </h2>
                <p className={styles.chips}>
                  <StatusChip tone="partner">{selected.label}</StatusChip>
                  <StatusChip tone={tone[selected.status]}>{selected.status}</StatusChip>
                </p>
                <dl className={styles.fields}>
                  <div className={styles.field}>
                    <dt>{copy.detail.partner}</dt>
                    <dd>{selected.partner}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.placement}</dt>
                    <dd>{selected.placement}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.disclosureType}</dt>
                    <dd>{selected.disclosureType}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.sourceApproval}</dt>
                    <dd className={details ? undefined : styles.pending}>{details?.sourceApproval ?? copy.detail.pending}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.lastUpdated}</dt>
                    <dd>{details ? copy.detail.updatedBy(selected.updated, details.updatedBy) : selected.updated}</dd>
                  </div>
                </dl>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.preview}</h3>
                  {details ? (
                    <div className={styles.partnerBox}>
                      <p className={styles.chips}>
                        <StatusChip tone="partner">{selected.label}</StatusChip>
                      </p>
                      <p className={styles.previewTitle}>{details.preview.title}</p>
                      <p className={styles.sectionText}>{details.preview.text}</p>
                    </div>
                  ) : (
                    <p className={styles.pending}>{copy.detail.pending}</p>
                  )}
                </div>
              </aside>
            )}
          </>
        )}
      </section>
    </div>
  );
}
