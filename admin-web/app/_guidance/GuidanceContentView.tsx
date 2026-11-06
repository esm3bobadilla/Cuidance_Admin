'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { guidanceCopy as copy, guidanceSeed, guidanceStatuses, type GuidanceItem, type GuidanceStatus } from '../../../shared/content/guidance-content';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import { NoResults } from '../_listDetail/NoResults';
import { StatusChip, type ChipTone } from '../_listDetail/StatusChip';
import styles from '../_listDetail/listDetail.module.css';

const contentHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.content.path}`;
const tone: Record<GuidanceStatus, ChipTone> = { Published: 'success', 'In review': 'neutral', Draft: 'draft' };

const matches = (item: GuidanceItem, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || [item.title, item.summary, item.careArea, item.type, item.status].some((v) => v.toLowerCase().includes(q));
};

// Guidance Content (aligned with hi-fi A3): search, status filter, the list with
// summaries, and the selected item's details. Sample data only; nothing is saved.
export function GuidanceContentView({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | GuidanceStatus>('all');
  const [selectedId, setSelectedId] = useState(guidanceSeed[0].id);
  const detailId = useId();
  const all = state === 'ready' ? guidanceSeed : [];
  const shown = useMemo(() => all.filter((i) => matches(i, query) && (status === 'all' || i.status === status)), [all, query, status]);
  const selected = shown.find((i) => i.id === selectedId) ?? shown[0];
  const details = selected?.details;

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>
      <noscript>
        <style>{`.${styles.toolbar} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchField id="guidance-search" label={copy.searchLabel} placeholder={copy.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} disabled={state !== 'ready'} />
        </div>
        <div className={styles.filter}>
          <Select
            id="guidance-status"
            label={copy.statusLabel}
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | GuidanceStatus)}
            options={[{ value: 'all', label: copy.allStatuses }, ...guidanceStatuses.map((s) => ({ value: s, label: s }))]}
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
                    { key: 'careArea', header: copy.columns.careArea },
                    { key: 'type', header: copy.columns.type },
                    { key: 'status', header: copy.columns.status },
                    { key: 'updated', header: copy.columns.updated },
                  ]}
                  rows={shown.map((i) => ({
                    id: i.id,
                    cells: {
                      title: (
                        <span className={styles.titleCell}>
                          <button type="button" className={styles.rowButton} aria-pressed={i.id === selected?.id} aria-controls={detailId} onClick={() => setSelectedId(i.id)}>
                            {i.title}
                          </button>
                          <span className={styles.subtle}>{i.summary}</span>
                        </span>
                      ),
                      careArea: i.careArea,
                      type: i.type,
                      status: <StatusChip tone={tone[i.status]}>{i.status}</StatusChip>,
                      updated: <span className={styles.nowrap}>{i.updated}</span>,
                    },
                  }))}
                  selectedRowId={selected?.id}
                  compact
                />
              ) : (
                <NoResults
                  message={copy.states.noResults}
                  clearLabel={copy.states.clear}
                  searchId="guidance-search"
                  onClear={() => {
                    setQuery('');
                    setStatus('all');
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
                <p className={styles.chips}>
                  <StatusChip tone={tone[selected.status]}>{selected.status}</StatusChip>
                </p>
                <h2 id={`${detailId}-title`} className={styles.detailTitle}>
                  {selected.title}
                </h2>
                <p className={styles.lead}>{selected.summary}</p>
                <dl className={styles.fields}>
                  <div className={styles.field}>
                    <dt>{copy.detail.careArea}</dt>
                    <dd>{selected.careArea}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.type}</dt>
                    <dd>{selected.type}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.source}</dt>
                    <dd>
                      {details ? details.source : <span className={styles.pending}>{copy.detail.pending}</span>}
                      {details && <span className={styles.pending}>{copy.detail.pending}</span>}
                    </dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.reviewStatus}</dt>
                    <dd>
                      <StatusChip tone={tone[selected.status]}>{selected.status}</StatusChip>
                      <span className={styles.subtle}>{copy.detail.lastUpdated(selected.updated)}</span>
                    </dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.evidence}</dt>
                    <dd className={styles.pending}>{copy.detail.pending}</dd>
                  </div>
                </dl>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.summary}</h3>
                  <p className={details ? styles.sectionText : styles.pending}>{details?.longSummary ?? copy.detail.pending}</p>
                </div>
              </aside>
            )}
          </>
        )}
      </section>
    </div>
  );
}
