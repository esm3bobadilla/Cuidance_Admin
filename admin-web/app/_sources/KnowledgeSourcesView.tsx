'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { knowledgeSourcesCopy as copy, knowledgeSourceSeed, type KnowledgeSource, type SourceReviewStatus } from '../../../shared/content/knowledge-sources';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import { NoResults } from '../_listDetail/NoResults';
import { StatusChip, type ChipTone } from '../_listDetail/StatusChip';
import styles from '../_listDetail/listDetail.module.css';

const contentHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.content.path}`;
const tone: Record<SourceReviewStatus, ChipTone> = { Published: 'success', 'In review': 'neutral', 'Needs review': 'alert', Archived: 'draft' };

const matches = (s: KnowledgeSource, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || [s.title, s.sourceType, s.status, s.owner, ...s.contentAreas].some((v) => v.toLowerCase().includes(q));
};

// Knowledge Sources (aligned with the approved hi-fi): search, the source list, and the
// selected source's details. Sample data only; nothing is opened, added or saved.
export function KnowledgeSourcesView({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(knowledgeSourceSeed[0].id);
  const detailId = useId();
  const all = state === 'ready' ? knowledgeSourceSeed : [];
  const shown = useMemo(() => all.filter((s) => matches(s, query)), [all, query]);
  const selected = shown.find((s) => s.id === selectedId) ?? shown[0];
  const details = selected?.details;

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>
      <noscript>
        <style>{`.${styles.toolbar} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchField id="sources-search" label={copy.searchLabel} placeholder={copy.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} disabled={state !== 'ready'} />
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
                    { key: 'sourceType', header: copy.columns.sourceType },
                    { key: 'contentAreas', header: copy.columns.contentAreas },
                    { key: 'status', header: copy.columns.status },
                    { key: 'lastReviewed', header: copy.columns.lastReviewed },
                    { key: 'owner', header: copy.columns.owner },
                  ]}
                  rows={shown.map((s) => ({
                    id: s.id,
                    cells: {
                      title: (
                        <button type="button" className={styles.rowButton} aria-pressed={s.id === selected?.id} aria-controls={detailId} onClick={() => setSelectedId(s.id)}>
                          {s.title}
                        </button>
                      ),
                      sourceType: s.sourceType,
                      contentAreas: s.contentAreas.join(', '),
                      status: <StatusChip tone={tone[s.status]}>{s.status}</StatusChip>,
                      lastReviewed: s.lastReviewed,
                      owner: s.owner,
                    },
                  }))}
                  selectedRowId={selected?.id}
                  compact
                />
              ) : (
                <NoResults message={copy.states.noResults} clearLabel={copy.states.clear} searchId="sources-search" onClear={() => setQuery('')} />
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
                  <StatusChip tone={tone[selected.status]}>{selected.status}</StatusChip>
                </p>
                <dl className={styles.fields}>
                  <div className={styles.field}>
                    <dt>{copy.detail.sourceType}</dt>
                    <dd>{selected.sourceType}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.description}</dt>
                    <dd className={details ? undefined : styles.pending}>{details?.description ?? copy.detail.pending}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.contentAreas}</dt>
                    <dd>
                      <ul className={styles.tags}>
                        {selected.contentAreas.map((a) => (
                          <li key={a} className={styles.tag}>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.reviewNotes}</dt>
                    <dd>{details ? <p className={styles.box}>{details.reviewNotes}</p> : <span className={styles.pending}>{copy.detail.pending}</span>}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.lastReviewed}</dt>
                    <dd>{selected.lastReviewed}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.owner}</dt>
                    <dd>{selected.owner}</dd>
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
