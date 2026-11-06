'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import type { ReviewItem } from '../../../shared/content/dashboard-review-queue';
import { reviewChecklists, reviewTasksCopy as copy, reviewTasksSeed } from '../../../shared/content/review-tasks';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { Button } from '../../components/ui/Button';
import { reviewTableColumns, ReviewPriorityLabel, ReviewStatePanel, ReviewStatusLabel, type ReviewViewState } from '../_review/ReviewShared';
import styles from './reviewTasks.module.css';

const dashboardHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.dashboard.path}`;

const matches = (task: ReviewItem, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [task.item, task.type, task.status, task.priority, task.assignedTo].some((value) => value.toLowerCase().includes(q));
};

// Review Tasks (aligned with the approved Week 9 hi-fi): search, the review table,
// and the selected task beside it. Sample data only; nothing is assigned or saved.
export function ReviewTasksContent({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(reviewTasksSeed[0].id);
  const detailId = useId();

  const all = state === 'ready' ? reviewTasksSeed : [];
  const shown = useMemo(() => all.filter((task) => matches(task, query)), [all, query]);
  const selected = shown.find((task) => task.id === selectedId) ?? shown[0];
  const checklist = selected ? reviewChecklists[selected.item] : undefined;

  const rows = shown.map((task) => ({
    id: task.id,
    cells: {
      item: (
        <button
          type="button"
          className={styles.rowButton}
          aria-pressed={task.id === selected?.id}
          aria-controls={detailId}
          onClick={() => setSelectedId(task.id)}
        >
          {task.item}
        </button>
      ),
      type: task.type,
      status: <ReviewStatusLabel status={task.status} />,
      priority: <ReviewPriorityLabel priority={task.priority} />,
      assignedTo: task.assignedTo,
      updated: task.updated,
    },
  }));

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>

      <noscript>
        <style>{`.${styles.toolbar} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <SearchField
          id="review-tasks-search"
          label={copy.searchLabel}
          placeholder={copy.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={state !== 'ready'}
        />
      </div>

      <section className={styles.body} aria-label="Review tasks" aria-busy={state === 'loading'}>
        {state !== 'ready' ? (
          <div className={styles.list}>
            <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={dashboardHref} />
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {shown.length > 0 ? (
                <DataTable caption={copy.tableCaption} columns={reviewTableColumns} rows={rows} selectedRowId={selected?.id} compact />
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
                        document.getElementById('review-tasks-search')?.focus();
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
                <h2 id={`${detailId}-title`} className={styles.detailTitle}>
                  {selected.item}
                </h2>
                <p className={styles.meta}>
                  <ReviewStatusLabel status={selected.status} />
                  <span>{copy.detail.priority(selected.priority)}</span>
                </p>
                <dl className={styles.fields}>
                  <div>
                    <dt>{copy.detail.type}</dt>
                    <dd>{selected.type}</dd>
                  </div>
                  <div>
                    <dt>{copy.detail.assignedTo}</dt>
                    <dd>{selected.assignedTo}</dd>
                  </div>
                  <div>
                    <dt>{copy.detail.updated}</dt>
                    <dd>{selected.updated}</dd>
                  </div>
                </dl>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.taskContext}</h3>
                  <p className={styles.pending}>{copy.detail.pending}</p>
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.relatedContent}</h3>
                  <p className={styles.pending}>{copy.detail.pending}</p>
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.checklist}</h3>
                  {checklist ? (
                    <ul className={styles.checklist}>
                      {checklist.map((entry) => (
                        <li key={entry}>
                          <span className={styles.box} aria-hidden="true">
                            {uiSymbols.default}
                          </span>
                          {entry}
                        </li>
                      ))}
                    </ul>
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
