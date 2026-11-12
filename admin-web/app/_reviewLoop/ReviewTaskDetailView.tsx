'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { reviewChecklists } from '../../../shared/content/review-tasks';
import { reviewTaskDetailCopy as copy } from '../../../shared/content/review-task-detail';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import {
  formatDecisionDate,
  placeholderReviewer,
  statusAfter,
  validateDecision,
  type DecisionErrors,
  type ReviewDecision,
  type ReviewDecisionKind,
  type ReviewTask,
} from '../../../shared/review-loop/review-decisions';
import { Textarea } from '../../components/forms/Textarea';
import { Button, ButtonLink } from '../../components/ui/Button';
import { ReviewStatePanel, ReviewStatusLabel } from '../_review/ReviewShared';
import { isSupabaseMode } from '../_data/config';
import type { SaveResult } from '../_data/reviewData';
import { recordDecision, resetReviewSession, useReviewTasks } from './reviewStore';
import styles from './reviewLoop.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const dashboardHref = `${base}${adminScreens.dashboard.path}`;
const reviewTasksHref = `${base}${adminScreens['review-tasks'].path}`;

// ready: the task with this tab's decisions. The others are previews (?state=) for review.
export type TaskDetailState = 'ready' | 'loading' | 'error' | 'unavailable' | 'saving' | 'save-error' | 'success';

// Review Task Detail (Week 11, Close the Loop). PROVISIONAL layout: no hi-fi reference.
// The task summary and history on the left; the review decision beside it (below it under 1280 px).
export function ReviewTaskDetailView({ taskId, state }: { taskId: string; state: TaskDetailState }) {
  const task = useReviewTasks().find((item) => item.id === taskId);
  // Phase A2: the sample task pages (/review-tasks/seed-N/) never show sample tasks beside real data
  if (isSupabaseMode) return <TaskDetail task={undefined} state="unavailable" options={{ ...sampleOptions, note: supabaseModeCopy.dataNote }} />;
  return <TaskDetail task={task} state={state} options={sampleOptions} />;
}

/*
 * What differs between sample mode and Supabase mode (Phase A2). Sample mode passes
 * sampleOptions, so its screen and behavior are exactly the Week 11 ones.
 */
export type DecisionOptions = {
  note: string;
  reviewingAs: string;
  historyEmpty: string;
  // Saves the decision. Sample mode answers at once; Supabase mode waits for the database.
  save: (task: ReviewTask, decision: ReviewDecisionKind, note: string) => SaveResult | Promise<SaveResult>;
  // Sample: Reset sample data. Supabase: none (decisions are append-only)
  reset?: () => boolean;
  // Supabase mode only: who may decide (D4) and whether a task can be decided again (D12)
  live?: { canDecide: boolean };
  saveErrors?: { failed: string; refused: string };
};

const sampleOptions: DecisionOptions = {
  note: copy.sampleDataNote,
  reviewingAs: copy.decision.reviewingAs(placeholderReviewer),
  historyEmpty: copy.history.empty,
  save: (task, decision, note) =>
    recordDecision({ taskId: task.id, decision, note, decidedBy: placeholderReviewer, decidedAt: formatDecisionDate(new Date()) })
      ? 'saved'
      : 'failed',
  reset: resetReviewSession,
};

export function TaskDetail({ task, state, options }: { task: ReviewTask | undefined; state: TaskDetailState; options: DecisionOptions }) {
  if (state === 'loading' || state === 'error' || state === 'unavailable' || !task) {
    const panelState = state === 'loading' || state === 'error' ? state : 'empty';
    return (
      <div className={styles.view} aria-busy={state === 'loading'}>
        <p className="note">{options.note}</p>
        <ReviewStatePanel state={panelState} messages={copy.states} emptyActionHref={reviewTasksHref} />
      </div>
    );
  }

  return (
    <div className={styles.view}>
      <p className="note">{options.note}</p>
      <div className={styles.body}>
        <TaskSummary task={task} historyEmpty={options.historyEmpty} />
        <DecisionPanel task={task} preview={state === 'ready' ? undefined : state} options={options} />
      </div>
    </div>
  );
}

function TaskSummary({ task, historyEmpty }: { task: ReviewTask; historyEmpty: string }) {
  const checklist = reviewChecklists[task.item];
  return (
    <div className={styles.column}>
      <section className={styles.panel} aria-labelledby="task-summary-heading">
        <h2 id="task-summary-heading" className={styles.label}>
          {copy.summary.heading}
        </h2>
        <p className={styles.meta}>
          <ReviewStatusLabel status={task.status} />
          <span>{copy.summary.priority(task.priority)}</span>
        </p>
        <dl className={styles.fields}>
          <div>
            <dt>{copy.summary.type}</dt>
            <dd>{task.type}</dd>
          </div>
          <div>
            <dt>{copy.summary.assignedTo}</dt>
            <dd>{task.assignedTo}</dd>
          </div>
          <div>
            <dt>{copy.summary.updated}</dt>
            <dd>{task.updated}</dd>
          </div>
        </dl>
        <div className={styles.section}>
          <h3 className={styles.label}>{copy.summary.taskContext}</h3>
          <p className={styles.muted}>{copy.summary.pending}</p>
        </div>
        <div className={styles.section}>
          <h3 className={styles.label}>{copy.summary.relatedContent}</h3>
          <p className={styles.muted}>{copy.summary.pending}</p>
        </div>
        <div className={styles.section}>
          <h3 className={styles.label}>{copy.summary.checklist}</h3>
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
            <p className={styles.muted}>{copy.summary.pending}</p>
          )}
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="task-history-heading">
        <h2 id="task-history-heading" className={styles.label}>
          {copy.history.heading}
        </h2>
        {task.history.length === 0 ? (
          <p className={styles.muted}>{historyEmpty}</p>
        ) : (
          <ol className={styles.history}>
            {task.history.map((entry, index) => (
              <li key={index} className={styles.historyEntry}>
                <p className={styles.historyTitle}>
                  {copy.history.entry(copy.decisionNames[entry.decision], entry.decidedBy, entry.decidedAt)}
                </p>
                <p className={entry.note ? styles.noteText : styles.muted}>{entry.note || copy.history.noNote}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

type Preview = Exclude<TaskDetailState, 'ready' | 'loading' | 'error' | 'unavailable'>;

function DecisionPanel({ task, preview, options }: { task: ReviewTask; preview?: Preview; options: DecisionOptions }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const recordedId = 'decision-recorded';
  const latest = task.history.at(-1);
  // Supabase mode (D12): after Needs changes, the assigned Reviewer may decide again
  const [decidingAgain, setDecidingAgain] = useState(false);
  const previewDecision: ReviewDecision = {
    taskId: task.id,
    decision: 'approved',
    note: '',
    decidedBy: placeholderReviewer,
    decidedAt: formatDecisionDate(new Date()),
  };
  const recorded = preview === 'success' ? previewDecision : preview || decidingAgain ? undefined : latest;
  const live = options.live;

  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus());
  // After a decision is saved, focus moves to "Decision recorded." so it's read out
  const focusRecorded = () => requestAnimationFrame(() => document.getElementById(recordedId)?.focus());

  return (
    <aside className={`${styles.panel} ${styles.decisionPanel}`} aria-labelledby="decision-heading">
      <h2 id="decision-heading" ref={headingRef} tabIndex={-1} className={styles.decisionHeading}>
        {copy.decision.heading}
      </h2>
      <p className={styles.muted}>{options.reviewingAs}</p>
      <p className={styles.policy}>{copy.decision.policy}</p>

      {recorded ? (
        <RecordedDecision
          id={recordedId}
          decision={recorded}
          onReset={
            options.reset
              ? () => {
                  if (!preview && options.reset?.()) focusHeading();
                }
              : undefined
          }
          // Supabase mode: approved tasks are final; Needs changes can be decided again (D12)
          liveNote={live && !preview ? (task.status === 'Approved' ? supabaseModeCopy.detail.approved : supabaseModeCopy.detail.saved) : undefined}
          onDecideAgain={
            live?.canDecide && !preview
              ? () => {
                  setDecidingAgain(true);
                  focusHeading();
                }
              : undefined
          }
        />
      ) : live && !live.canDecide && !preview ? (
        // D4: only the assigned Reviewer records a decision
        <p className={styles.muted} role="note">
          <span aria-hidden="true">{uiSymbols.empty}</span>{' '}
          {task.status === 'Approved' ? supabaseModeCopy.detail.approved : supabaseModeCopy.detail.notAssigned}
        </p>
      ) : (
        <DecisionForm
          task={task}
          preview={preview}
          options={options}
          onRecorded={() => {
            setDecidingAgain(false);
            focusRecorded();
          }}
        />
      )}
    </aside>
  );
}

function DecisionForm({
  task,
  preview,
  options: modeOptions,
  onRecorded,
}: {
  task: ReviewTask;
  preview?: Preview;
  options: DecisionOptions;
  onRecorded: () => void;
}) {
  const id = useId();
  const [decision, setDecision] = useState<ReviewDecisionKind | null>(null);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<DecisionErrors>({});
  const [saveFailed, setSaveFailed] = useState<Exclude<SaveResult, 'saved'> | false>(false);
  const [submitting, setSubmitting] = useState(false);
  const saving = preview === 'saving' || submitting;
  const showSaveError = saveFailed || preview === 'save-error';
  const saveErrorText =
    saveFailed === 'refused' && modeOptions.saveErrors ? modeOptions.saveErrors.refused : modeOptions.saveErrors?.failed ?? copy.decision.errors.save;

  const legendId = `${id}-legend`;
  const decisionErrorId = `${id}-decision-error`;
  const noteId = `${id}-note`;
  const firstOptionId = `${id}-approve`;

  const helper =
    decision === 'approved'
      ? copy.decision.noteHelperApprove
      : decision === 'changes-requested'
        ? copy.decision.noteHelperChanges
        : copy.decision.noteHelperNone;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (preview || submitting) return;
    const found = validateDecision(decision, note);
    setErrors(found);
    if (found.decision) return document.getElementById(firstOptionId)?.focus();
    if (found.note) return document.getElementById(noteId)?.focus();

    const finish = (result: SaveResult) => {
      setSubmitting(false);
      setSaveFailed(result === 'saved' ? false : result);
      if (result === 'saved') onRecorded();
    };
    const result = modeOptions.save(task, decision!, note.trim());
    if (typeof result === 'string') return finish(result);
    setSubmitting(true);
    setSaveFailed(false);
    void result.then(finish, () => finish('failed'));
  };

  const options: { value: ReviewDecisionKind; label: string }[] = [
    { value: 'approved', label: copy.decision.approve },
    { value: 'changes-requested', label: copy.decision.requestChanges },
  ];

  return (
    <>
      {/* The form can't work without JavaScript, so it's hidden and a message shows instead */}
      <noscript>
        <style>{`.${styles.form} { display: none !important; }`}</style>
        <p className={styles.muted}>{copy.decision.noScript}</p>
      </noscript>
      <form className={styles.form} onSubmit={submit} noValidate aria-busy={saving}>
        <fieldset
          className={styles.fieldset}
          aria-labelledby={legendId}
          aria-describedby={errors.decision ? decisionErrorId : undefined}
          disabled={saving}
        >
          <legend id={legendId} className={styles.legend}>
            {copy.decision.legend}
          </legend>
          {options.map((option) => (
            <div key={option.value} className={styles.option}>
              <input
                id={option.value === 'approved' ? firstOptionId : `${id}-changes`}
                type="radio"
                name={`${id}-decision`}
                value={option.value}
                className={errors.decision ? `${styles.radio} ${styles.invalid}` : styles.radio}
                checked={decision === option.value}
                aria-invalid={errors.decision ? true : undefined}
                onChange={() => {
                  setDecision(option.value);
                  setErrors((current) => ({ ...current, decision: undefined, note: undefined }));
                }}
              />
              <label htmlFor={option.value === 'approved' ? firstOptionId : `${id}-changes`} className={styles.optionLabel}>
                {option.label}
              </label>
            </div>
          ))}
          {errors.decision && (
            <p id={decisionErrorId} className={styles.fieldError}>
              <span aria-hidden="true">{uiSymbols.error}</span> {copy.decision.errors.decision}
            </p>
          )}
        </fieldset>

        <Textarea
          id={noteId}
          label={copy.decision.noteLabel}
          helper={helper}
          error={errors.note ? copy.decision.errors.note : undefined}
          value={note}
          disabled={saving}
          aria-required={decision === 'changes-requested' ? true : undefined}
          onChange={(event) => {
            setNote(event.target.value);
            if (errors.note && event.target.value.trim()) setErrors((current) => ({ ...current, note: undefined }));
          }}
        />

        {saving && (
          <p className={styles.saving} role="status">
            <span aria-hidden="true">{uiSymbols.loading}</span> {copy.decision.saving}
          </p>
        )}
        {showSaveError && (
          <p className={styles.saveError} role="alert">
            <span aria-hidden="true">{uiSymbols.error}</span> {saveErrorText}
          </p>
        )}

        <div>
          <Button variant="primary" type="submit" disabled={saving}>
            {copy.decision.submit}
          </Button>
        </div>
      </form>
    </>
  );
}

function RecordedDecision({
  id,
  decision,
  onReset,
  liveNote,
  onDecideAgain,
}: {
  id: string;
  decision: ReviewDecision;
  onReset?: () => void;
  liveNote?: string;
  onDecideAgain?: () => void;
}) {
  const status = statusAfter[decision.decision];
  return (
    <div className={styles.recorded}>
      <div className={styles.success} role="status">
        <p id={id} className={styles.successTitle} tabIndex={-1}>
          <span className={styles.successIcon} aria-hidden="true">
            {uiSymbols.success}
          </span>
          {copy.recorded.heading}
        </p>
        <p className={styles.successMeta}>
          <span>{copy.recorded.status(status)}</span>
          <span>{copy.history.entry(copy.decisionNames[decision.decision], decision.decidedBy, decision.decidedAt)}</span>
        </p>
      </div>
      <div className={styles.section}>
        <h3 className={styles.label}>{copy.recorded.note}</h3>
        <p className={decision.note ? styles.noteText : styles.muted}>{decision.note || copy.history.noNote}</p>
      </div>
      <div className={styles.actions}>
        <ButtonLink variant="secondary" href={dashboardHref}>
          {copy.recorded.goToDashboard}
        </ButtonLink>
      </div>
      {onReset && (
        <div className={styles.reset}>
          <Button variant="ghost" onClick={onReset} aria-describedby="reset-help">
            {copy.recorded.reset}
          </Button>
          <p id="reset-help" className={styles.muted}>
            {copy.recorded.resetHelp}
          </p>
        </div>
      )}
      {liveNote && <p className={styles.muted}>{liveNote}</p>}
      {onDecideAgain && (
        <div className={styles.reset}>
          <Button variant="ghost" onClick={onDecideAgain} aria-describedby="decide-again-help">
            {supabaseModeCopy.detail.decideAgain}
          </Button>
          <p id="decide-again-help" className={styles.muted}>
            {supabaseModeCopy.detail.decideAgainHelp}
          </p>
        </div>
      )}
    </div>
  );
}
