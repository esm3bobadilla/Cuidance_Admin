import { adminScreens } from '../../../shared/content/admin-web-screens';
import { reviewTasksCopy as copy, reviewTasksSeed } from '../../../shared/content/review-tasks';
import { DataTable } from '../../components/data/DataTable';
import { reviewTableColumns, reviewTableRows, ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';

const dashboardHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.dashboard.path}`;

// Review Tasks content: the sample-data note, then the table or a state panel
export function ReviewTasksContent({ state }: { state: ReviewViewState }) {
  return (
    <>
      <p className="note">{copy.sampleDataNote}</p>
      <section className="section" aria-label="Review tasks" aria-busy={state === 'loading'}>
        <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={dashboardHref} />
        {state === 'ready' && (
          <DataTable caption={copy.tableCaption} columns={reviewTableColumns} rows={reviewTableRows(reviewTasksSeed)} />
        )}
      </section>
    </>
  );
}
