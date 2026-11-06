'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { commercialCopy as copy, commercialItems, commercialLabels, type CommercialItem, type CommercialLabel } from '../../../shared/content/commercial-content';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import { NoResults } from '../_listDetail/NoResults';
import { StatusChip, type ChipTone } from '../_listDetail/StatusChip';
import styles from '../_listDetail/listDetail.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const contentHref = `${base}${adminScreens.content.path}`;
// Statuses keep the names used on their own screens
const tone = (status: string): ChipTone => (status === 'Approved' || status === 'Complete' ? 'success' : status === 'Draft' ? 'draft' : 'neutral');

const matches = (item: CommercialItem, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || [item.title, item.label, adminScreens[item.screen].name, item.disclosure, item.status, item.partner ?? ''].some((v) => v.toLowerCase().includes(q));
};

// Commercial Content (approved by Team 03, C7; layout PROVISIONAL, no hi-fi): every
// commercially labeled item from the approved sample data, with its label, disclosure
// and the screen it appears on. Nothing is created, edited, approved or published.
export function CommercialContentView({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [label, setLabel] = useState<'all' | CommercialLabel>('all');
  const [selectedId, setSelectedId] = useState(commercialItems[0].id);
  const detailId = useId();
  const all = state === 'ready' ? commercialItems : [];
  const shown = useMemo(() => all.filter((i) => matches(i, query) && (label === 'all' || i.label === label)), [all, query, label]);
  const selected = shown.find((i) => i.id === selectedId) ?? shown[0];

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
          <SearchField id="commercial-search" label={copy.searchLabel} placeholder={copy.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} disabled={state !== 'ready'} />
        </div>
        <div className={styles.filter}>
          <Select
            id="commercial-label"
            label={copy.labelFilter}
            value={label}
            onChange={(e) => setLabel(e.target.value as 'all' | CommercialLabel)}
            options={[{ value: 'all', label: copy.allLabels }, ...commercialLabels.map((l) => ({ value: l, label: l }))]}
            disabled={state !== 'ready'}
          />
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
                    { key: 'label', header: copy.columns.label },
                    { key: 'screen', header: copy.columns.screen },
                    { key: 'disclosure', header: copy.columns.disclosure },
                    { key: 'status', header: copy.columns.status },
                    { key: 'updated', header: copy.columns.updated },
                  ]}
                  rows={shown.map((i) => ({
                    id: i.id,
                    cells: {
                      title: (
                        <button type="button" className={styles.rowButton} aria-pressed={i.id === selected?.id} aria-controls={detailId} onClick={() => setSelectedId(i.id)}>
                          {i.title}
                        </button>
                      ),
                      label: <StatusChip tone="partner">{i.label}</StatusChip>,
                      screen: adminScreens[i.screen].name,
                      disclosure: i.disclosure,
                      status: <StatusChip tone={tone(i.status)}>{i.status}</StatusChip>,
                      updated: i.updated,
                    },
                  }))}
                  selectedRowId={selected?.id}
                  compact
                />
              ) : (
                <NoResults
                  message={copy.states.noResults}
                  clearLabel={copy.states.clear}
                  searchId="commercial-search"
                  onClear={() => {
                    setQuery('');
                    setLabel('all');
                  }}
                />
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
                </p>
                <dl className={styles.fields}>
                  <div className={styles.field}>
                    <dt>{copy.detail.screen}</dt>
                    <dd>
                      {adminScreens[selected.screen].name}
                      <a className={styles.link} href={`${base}${adminScreens[selected.screen].path}`}>
                        {copy.detail.open(adminScreens[selected.screen].name)}
                      </a>
                    </dd>
                  </div>
                  {selected.partner && (
                    <div className={styles.field}>
                      <dt>{copy.detail.partner}</dt>
                      <dd>{selected.partner}</dd>
                    </div>
                  )}
                  {selected.placement && (
                    <div className={styles.field}>
                      <dt>{copy.detail.placement}</dt>
                      <dd>{selected.placement}</dd>
                    </div>
                  )}
                  <div className={styles.field}>
                    <dt>{copy.detail.disclosure}</dt>
                    <dd>{selected.disclosure}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.disclosureWording}</dt>
                    <dd className={styles.pending}>{copy.detail.pending}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{selected.statusName}</dt>
                    <dd>
                      <StatusChip tone={tone(selected.status)}>{selected.status}</StatusChip>
                    </dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.updated}</dt>
                    <dd>{selected.updated}</dd>
                  </div>
                </dl>
              </aside>
            )}
          </>
        )}
      </section>
    </div>
  );
}
