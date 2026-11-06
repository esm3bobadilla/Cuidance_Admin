'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import {
  quizContentCopy as copy,
  quizQuestionSeed,
  quizStatuses,
  type QuizQuestion,
  type QuizQuestionStatus,
} from '../../../shared/content/quiz-content';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { Button } from '../../components/ui/Button';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import styles from './quiz.module.css';

const contentHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.content.path}`;

// PROVISIONAL status treatment (no approved status-to-token mapping yet). Text always shows.
function QuizStatusLabel({ status }: { status: QuizQuestionStatus }) {
  const className = status === 'Published' ? styles.statusPublished : status === 'Draft' ? styles.statusDraft : styles.statusReview;
  return (
    <span className={`${styles.status} ${className}`}>
      {status === 'Published' && (
        <span className={styles.statusIcon} aria-hidden="true">
          {uiSymbols.selected}
        </span>
      )}
      {status}
    </span>
  );
}

const matches = (question: QuizQuestion, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [question.question, question.type, question.careArea, question.status].some((value) => value.toLowerCase().includes(q));
};

// Quiz Content (aligned with hi-fi A2): search and status filter, the question list,
// and the details of the selected question. Sample data only; nothing is saved.
export function QuizContentView({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | QuizQuestionStatus>('all');
  const [selectedId, setSelectedId] = useState(quizQuestionSeed[0].id);
  const detailId = useId();

  const all = state === 'ready' ? quizQuestionSeed : [];
  const shown = useMemo(() => all.filter((q) => matches(q, query) && (status === 'all' || q.status === status)), [all, query, status]);
  const selected = shown.find((q) => q.id === selectedId) ?? shown[0];

  const rows = shown.map((q) => ({
    id: q.id,
    cells: {
      question: (
        <button
          type="button"
          className={styles.rowButton}
          aria-pressed={q.id === selected?.id}
          aria-controls={detailId}
          onClick={() => setSelectedId(q.id)}
        >
          {q.question}
        </button>
      ),
      type: q.type,
      careArea: q.careArea,
      status: <QuizStatusLabel status={q.status} />,
      updated: (
        <span className={styles.updated}>
          {q.updated}
          <span className={styles.updatedBy}>{copy.updatedBy(q.updatedBy)}</span>
        </span>
      ),
    },
  }));

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>

      <noscript>
        <style>{`.${styles.toolbar} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchField
            id="quiz-search"
            label={copy.searchLabel}
            placeholder={copy.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={state !== 'ready'}
          />
        </div>
        <div className={styles.filter}>
          <Select
            id="quiz-status"
            label={copy.statusLabel}
            value={status}
            onChange={(event) => setStatus(event.target.value as 'all' | QuizQuestionStatus)}
            options={[{ value: 'all', label: copy.allStatuses }, ...quizStatuses.map((s) => ({ value: s, label: s }))]}
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
                    { key: 'question', header: copy.columns.question },
                    { key: 'type', header: copy.columns.type },
                    { key: 'careArea', header: copy.columns.careArea },
                    { key: 'status', header: copy.columns.status },
                    { key: 'updated', header: copy.columns.updated },
                  ]}
                  rows={rows}
                  selectedRowId={selected?.id}
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
                        setStatus('all');
                        // This button goes away, so focus returns to the search field
                        document.getElementById('quiz-search')?.focus();
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
                  {selected.question}
                </h2>
                <div className={styles.detailMeta}>
                  <QuizStatusLabel status={selected.status} />
                  <span>{copy.detail.lastUpdated(selected.updated, selected.updatedBy)}</span>
                </div>
                <dl className={styles.fields}>
                  <div className={styles.field}>
                    <dt>{copy.detail.type}</dt>
                    <dd>{selected.type}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.careArea}</dt>
                    <dd>
                      {selected.careArea}
                      {copy.careAreaNotes[selected.careArea] && (
                        <span className={styles.fieldNote}>{copy.careAreaNotes[selected.careArea]}</span>
                      )}
                    </dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.answerOptions}</dt>
                    <dd className={styles.pending}>{copy.detail.answerOptionsPending}</dd>
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
