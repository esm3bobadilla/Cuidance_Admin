import type { ReviewItem, ReviewPriority, ReviewStatus } from '../../../shared/content/dashboard-review-queue';
import { liveReviewTaskPath, reviewTaskPath } from '../../../shared/content/review-task-detail';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { ButtonLink } from '../../components/ui/Button';
import { isSupabaseMode } from '../_data/config';
import styles from './review.module.css';

// Shared by the Dashboard and Review Tasks screens, so review items look the same on both.

export type ReviewViewState = 'ready' | 'loading' | 'empty' | 'error';

// PROVISIONAL status treatment (no approved status-to-token mapping yet). Text always shows.
const statusTreatment: Record<ReviewStatus, { className: string; icon?: string }> = {
  'In review': { className: styles.statusNeutral },
  'Needs changes': { className: styles.statusError, icon: uiSymbols.error },
  'Pending disclosure': { className: styles.statusPartner, icon: uiSymbols.partner },
  'Needs review': { className: styles.statusAlert },
  // Week 11: set by a Reviewer's decision. Success colors plus ✓, as Week 10 uses for approved items
  Approved: { className: styles.statusSuccess, icon: uiSymbols.success },
};

// Link to a task's detail page (plain links need the GitHub Pages base path added by hand)
// Phase A2: Supabase tasks open the one live detail page (?id=); sample tasks keep their own pages
export const reviewTaskHref = (taskId: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${isSupabaseMode ? liveReviewTaskPath(taskId) : reviewTaskPath(taskId)}`;

export function ReviewTaskLink({ task }: { task: ReviewItem }) {
  return (
    <a className={styles.itemLink} href={reviewTaskHref(task.id)}>
      {task.item}
    </a>
  );
}

export function ReviewStatusLabel({ status }: { status: ReviewStatus }) {
  const { className, icon } = statusTreatment[status];
  return (
    <span className={`${styles.label} ${className}`}>
      {icon && (
        <span className={styles.labelIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      {status}
    </span>
  );
}

// PROVISIONAL: priority is neutral text only until a priority mapping is approved
export function ReviewPriorityLabel({ priority }: { priority: ReviewPriority }) {
  return <span className={`${styles.label} ${styles.statusNeutral}`}>{priority}</span>;
}

export const reviewTableColumns = [
  { key: 'item', header: 'Item' },
  { key: 'type', header: 'Type' },
  { key: 'status', header: 'Status' },
  { key: 'priority', header: 'Priority' },
  { key: 'assignedTo', header: 'Assigned to' },
  { key: 'updated', header: 'Updated' },
];

export function reviewTableRows(items: ReviewItem[]) {
  return items.map((row) => ({
    id: row.id,
    cells: {
      // Week 11: the title opens the task's detail page
      item: <ReviewTaskLink task={row} />,
      type: row.type,
      status: <ReviewStatusLabel status={row.status} />,
      priority: <ReviewPriorityLabel priority={row.priority} />,
      assignedTo: row.assignedTo,
      updated: row.updated,
    },
  }));
}

type StateMessages = {
  loading: string;
  empty: string;
  emptyAction: string;
  error: string;
};

// Loading, empty and error panels with the approved Week 8 symbols (⋯, ◌, ⚠).
// Each symbol sits beside its message and is hidden from screen readers.
// Nothing renders in the ready state.
export function ReviewStatePanel({
  state,
  messages,
  emptyActionHref,
}: {
  state: ReviewViewState;
  messages: StateMessages;
  emptyActionHref: string;
}) {
  if (state === 'loading') {
    return (
      <p className={`${styles.statePanel} ${styles.symbolPanel}`} role="status">
        <span className={styles.stateSymbol} aria-hidden="true">
          {uiSymbols.loading}
        </span>
        {messages.loading}
      </p>
    );
  }

  if (state === 'error') {
    return (
      <p className={`${styles.statePanel} ${styles.errorPanel}`} role="alert">
        <span className={styles.errorIcon} aria-hidden="true">
          {uiSymbols.error}
        </span>
        {messages.error}
      </p>
    );
  }

  if (state === 'empty') {
    return (
      <div className={`${styles.statePanel} ${styles.emptyPanel}`}>
        <p className={styles.symbolPanel}>
          <span className={styles.stateSymbol} aria-hidden="true">
            {uiSymbols.empty}
          </span>
          {messages.empty}
        </p>
        <div>
          <ButtonLink variant="secondary" href={emptyActionHref}>
            {messages.emptyAction}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return null;
}
