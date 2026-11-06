'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { guidanceRulesCopy as copy, guidanceRuleSeed, ruleStatuses, type GuidanceRule, type RuleStatus } from '../../../shared/content/guidance-rules-review';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import { NoResults } from '../_listDetail/NoResults';
import { StatusChip, type ChipTone } from '../_listDetail/StatusChip';
import styles from '../_listDetail/listDetail.module.css';

const dashboardHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.dashboard.path}`;
const tone: Record<RuleStatus, ChipTone> = { Draft: 'draft', 'In review': 'neutral', 'Approved with notes': 'success', 'Needs changes': 'error' };
const careAreas = [...new Set(guidanceRuleSeed.map((r) => r.careArea))];

const matches = (r: GuidanceRule, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || [r.name, r.trigger, r.careArea, r.linkedGuidance, r.status, r.reviewer].some((v) => v.toLowerCase().includes(q));
};

// Guidance Rules Review (aligned with the approved hi-fi): how quiz answers connect to
// educational guidance. Read-only: nothing is approved, edited or published.
export function GuidanceRulesView({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [status, setStatus] = useState<'all' | RuleStatus>('all');
  const [selectedId, setSelectedId] = useState(guidanceRuleSeed[0].id);
  const detailId = useId();
  const all = state === 'ready' ? guidanceRuleSeed : [];
  const shown = useMemo(() => all.filter((r) => matches(r, query) && (area === 'all' || r.careArea === area) && (status === 'all' || r.status === status)), [all, query, area, status]);
  const selected = shown.find((r) => r.id === selectedId) ?? shown[0];
  const details = selected?.details;
  const disabled = state !== 'ready';

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>
      <p className={styles.notice}>{copy.banner}</p>
      <noscript>
        <style>{`.${styles.toolbar} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchField id="rules-search" label={copy.searchLabel} placeholder={copy.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} disabled={disabled} />
        </div>
        <div className={styles.filter}>
          <Select id="rules-area" label={copy.careAreaLabel} value={area} onChange={(e) => setArea(e.target.value)} options={[{ value: 'all', label: copy.allCareAreas }, ...careAreas.map((a) => ({ value: a, label: a }))]} disabled={disabled} />
        </div>
        <div className={styles.filter}>
          <Select id="rules-status" label={copy.statusLabel} value={status} onChange={(e) => setStatus(e.target.value as 'all' | RuleStatus)} options={[{ value: 'all', label: copy.allStatuses }, ...ruleStatuses.map((s) => ({ value: s, label: s }))]} disabled={disabled} />
        </div>
      </div>

      <section className={styles.body} aria-label={copy.tableCaption} aria-busy={state === 'loading'}>
        {state !== 'ready' ? (
          <div className={styles.list}>
            <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={dashboardHref} />
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {shown.length > 0 ? (
                <DataTable
                  caption={copy.tableCaption}
                  columns={[
                    { key: 'name', header: copy.columns.name },
                    { key: 'trigger', header: copy.columns.trigger },
                    { key: 'careArea', header: copy.columns.careArea },
                    { key: 'linkedGuidance', header: copy.columns.linkedGuidance },
                    { key: 'status', header: copy.columns.status },
                    { key: 'reviewer', header: copy.columns.reviewer },
                    { key: 'updated', header: copy.columns.updated },
                  ]}
                  rows={shown.map((r) => ({
                    id: r.id,
                    cells: {
                      name: (
                        <button type="button" className={styles.rowButton} aria-pressed={r.id === selected?.id} aria-controls={detailId} onClick={() => setSelectedId(r.id)}>
                          {r.name}
                        </button>
                      ),
                      trigger: r.trigger,
                      careArea: r.careArea,
                      linkedGuidance: r.linkedGuidance,
                      status: <StatusChip tone={tone[r.status]}>{r.status}</StatusChip>,
                      reviewer: r.reviewer,
                      updated: r.updated,
                    },
                  }))}
                  selectedRowId={selected?.id}
                  compact
                />
              ) : (
                <NoResults
                  message={copy.states.noResults}
                  clearLabel={copy.states.clear}
                  searchId="rules-search"
                  onClear={() => {
                    setQuery('');
                    setArea('all');
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
                  <span className={styles.subtle}>{details ? details.version : `${copy.detail.version}: ${copy.detail.pending}`}</span>
                </p>
                <h2 id={`${detailId}-title`} className={styles.detailTitle}>
                  {selected.name}
                </h2>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.trigger}</h3>
                  <p className={styles.box}>
                    {selected.trigger}
                    {details && (
                      <>
                        <br />
                        <span className={styles.subtle}>{copy.detail.from(details.question)}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.linked}</h3>
                  <p className={styles.box}>
                    <strong>{selected.linkedGuidance}</strong>
                    {details && (
                      <>
                        <br />
                        <span className={styles.subtle}>{details.linkedType}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.explanation}</h3>
                  <p className={details ? styles.box : styles.pending}>{details?.explanation ?? copy.detail.pending}</p>
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.safety}</h3>
                  <p className={styles.notice}>{copy.safetyBoundary}</p>
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.reviewerNotes}</h3>
                  <p className={details ? styles.box : styles.pending}>{details?.reviewerNotes ?? copy.detail.pending}</p>
                </div>
                <p className={styles.subtle}>{details?.updatedLine ?? `${selected.updated} · ${selected.reviewer}`}</p>
              </aside>
            )}
          </>
        )}
      </section>
    </div>
  );
}
