'use client';

import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import {
  claimsCopy as copy,
  claimsSeed,
  claimsTabs,
  type ClaimsItem,
  type ClaimsStatus,
  type ClaimsTab,
} from '../../../shared/content/claims-safety-review';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { Button } from '../../components/ui/Button';
import { ReviewPriorityLabel, ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import styles from './claims.module.css';

const dashboardHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.dashboard.path}`;
const contentAreas = [...new Set(claimsSeed.map((item) => item.contentArea))];

// PROVISIONAL status treatment (no approved status-to-token mapping yet). Text always shows.
const statusTreatment: Record<ClaimsStatus, { className: string; icon?: string }> = {
  'Needs review': { className: styles.statusAlert },
  'In review': { className: styles.statusNeutral },
  'Needs changes': { className: styles.statusError, icon: uiSymbols.error },
  'Approved with notes': { className: styles.statusDone, icon: uiSymbols.selected },
};

function ClaimsStatusLabel({ status }: { status: ClaimsStatus }) {
  const { className, icon } = statusTreatment[status];
  return (
    <span className={`${styles.status} ${className}`}>
      {icon && (
        <span className={styles.statusIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      {status}
    </span>
  );
}

// Approved initials treatment: a neutral circle; the full placeholder name is read out
function Reviewer({ reviewer }: { reviewer: ClaimsItem['reviewer'] }) {
  return (
    <span className={styles.reviewer} title={reviewer.name}>
      <span className={styles.initials} aria-hidden="true">
        {reviewer.initials}
      </span>
      <span className={styles.visuallyHidden}>{reviewer.name}</span>
    </span>
  );
}

// "Oct 14, 2024 10:24 AM" shows as the date with the time below it
function Updated({ value }: { value: string }) {
  const split = value.match(/^(.*\d{4}) (.*)$/);
  if (!split) return <>{value}</>;
  return (
    <span className={styles.updated}>
      {split[1]}
      <span className={styles.time}>{split[2]}</span>
    </span>
  );
}

const matches = (item: ClaimsItem, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [item.item, item.contentArea, item.reviewType, item.status, item.priority, item.reviewer.name].some((value) => value.toLowerCase().includes(q));
};

// Claims & Safety Review (aligned with hi-fi A5): list tabs, content-area filter and
// search, the review table, and the selected item's details. Sample data only;
// nothing is approved, assigned or saved.
export function ClaimsReviewView({ state }: { state: ReviewViewState }) {
  const [tab, setTab] = useState<ClaimsTab>('queue');
  const [area, setArea] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(claimsSeed[0].id);
  const baseId = useId();
  const detailId = `${baseId}-detail`;
  const panelId = `${baseId}-panel`;

  const all = state === 'ready' ? claimsSeed : [];
  const tabStatuses = claimsTabs.find((t) => t.id === tab)?.statuses ?? null;
  const shown = useMemo(
    () =>
      all.filter(
        (item) => (!tabStatuses || tabStatuses.includes(item.status)) && (area === 'all' || item.contentArea === area) && matches(item, query),
      ),
    [all, tabStatuses, area, query],
  );
  const selectedIndex = Math.max(0, shown.findIndex((item) => item.id === selectedId));
  const selected = shown[selectedIndex];

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: claimsTabs.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = claimsTabs[(keys[event.key] + claimsTabs.length) % claimsTabs.length];
    setTab(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  };

  const rows = shown.map((item) => ({
    id: item.id,
    cells: {
      item: (
        <button
          type="button"
          className={styles.rowButton}
          aria-pressed={item.id === selected?.id}
          aria-controls={detailId}
          onClick={() => setSelectedId(item.id)}
        >
          {item.item}
        </button>
      ),
      contentArea: item.contentArea,
      reviewType: item.reviewType,
      status: <ClaimsStatusLabel status={item.status} />,
      priority: <ReviewPriorityLabel priority={item.priority} />,
      reviewer: <Reviewer reviewer={item.reviewer} />,
      updated: <Updated value={item.updated} />,
    },
  }));

  const details = selected?.details;
  const disabled = state !== 'ready';

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>

      <noscript>
        <style>{`.${styles.tabs}, .${styles.filters} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist" aria-label={copy.tabsLabel}>
          {claimsTabs.map((t, index) => (
            <button
              key={t.id}
              id={`${baseId}-tab-${t.id}`}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={tab === t.id}
              aria-controls={panelId}
              tabIndex={tab === t.id ? 0 : -1}
              disabled={disabled}
              onClick={() => setTab(t.id)}
              onKeyDown={(event) => onTabKey(event, index)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.filters}>
          <div className={styles.area}>
            <Select
              id="claims-area"
              label={copy.areaLabel}
              value={area}
              onChange={(event) => setArea(event.target.value)}
              options={[{ value: 'all', label: copy.allAreas }, ...contentAreas.map((a) => ({ value: a, label: a }))]}
              disabled={disabled}
            />
          </div>
          <div className={styles.search}>
            <SearchField
              id="claims-search"
              label={copy.searchLabel}
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <section
        id={panelId}
        className={styles.body}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${tab}`}
        aria-busy={state === 'loading'}
      >
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
                    { key: 'item', header: copy.columns.item },
                    { key: 'contentArea', header: copy.columns.contentArea },
                    { key: 'reviewType', header: copy.columns.reviewType },
                    { key: 'status', header: copy.columns.status },
                    { key: 'priority', header: copy.columns.priority },
                    { key: 'reviewer', header: copy.columns.reviewer },
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
                        setArea('all');
                        // This button goes away, so focus returns to the search field
                        document.getElementById('claims-search')?.focus();
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
                <div className={styles.detailTop}>
                  <p className={styles.detailLabel}>{copy.detail.heading}</p>
                  <div className={styles.pager}>
                    <span className={styles.position}>{copy.detail.position(selectedIndex + 1, shown.length)}</span>
                    <button
                      type="button"
                      className={styles.pagerButton}
                      aria-label={copy.detail.previous}
                      disabled={selectedIndex === 0}
                      onClick={() => setSelectedId(shown[selectedIndex - 1].id)}
                    >
                      <span aria-hidden="true">‹</span>
                    </button>
                    <button
                      type="button"
                      className={styles.pagerButton}
                      aria-label={copy.detail.next}
                      disabled={selectedIndex === shown.length - 1}
                      onClick={() => setSelectedId(shown[selectedIndex + 1].id)}
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                  </div>
                </div>

                <div className={styles.titleGroup}>
                  <h2 id={`${detailId}-title`} className={styles.detailTitle}>
                    {selected.item}
                  </h2>
                  <p className={styles.meta}>
                    <span>{selected.contentArea}</span>
                    <span aria-hidden="true">|</span>
                    <span>{selected.reviewType}</span>
                    <span aria-hidden="true">|</span>
                    <span>{copy.detail.priority(selected.priority)}</span>
                  </p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionHeading}>
                    {details && (
                      <span className={styles.flagIcon} aria-hidden="true">
                        {uiSymbols.error}
                      </span>
                    )}
                    {copy.detail.flaggedStatement}
                  </h3>
                  <p className={details ? `${styles.box} ${styles.boxFlag} ${styles.quote}` : styles.pending}>
                    {details?.flaggedStatement ?? copy.detail.pending}
                  </p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionHeading}>{copy.detail.context}</h3>
                  <p className={details ? styles.box : styles.pending}>{details?.context ?? copy.detail.pending}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionHeading}>{copy.detail.sourceReference}</h3>
                  <p className={details ? styles.box : styles.pending}>{details?.sourceReference ?? copy.detail.pending}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionHeading}>{copy.detail.reviewerNote}</h3>
                  <p className={details ? styles.box : styles.pending}>{details?.reviewerNote ?? copy.detail.pending}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionHeading}>
                    {details && (
                      <span className={styles.flagIcon} aria-hidden="true">
                        {uiSymbols.error}
                      </span>
                    )}
                    {copy.detail.requiredAction}
                  </h3>
                  <p className={details ? `${styles.box} ${styles.boxFlag}` : styles.pending}>{details?.requiredAction ?? copy.detail.pending}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionHeading}>{copy.detail.status}</h3>
                  <div>
                    <ClaimsStatusLabel status={selected.status} />
                  </div>
                </div>
              </aside>
            )}
          </>
        )}
      </section>

      <p className={styles.disclaimer}>{copy.disclaimer}</p>
    </div>
  );
}
