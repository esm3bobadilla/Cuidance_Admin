import {
  dashboardCopy as copy,
  dashboardKeyAreas,
  needsAttentionSeed,
  reviewQueueSummary,
} from '../../../shared/content/dashboard-review-queue';
import { adminScreens, type AdminScreenId } from '../../../shared/content/admin-web-screens';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { DataTable } from '../../components/data/DataTable';
import { MetricTile } from '../../components/data/MetricTile';
import { ButtonLink } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { reviewTableColumns, reviewTableRows, ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import styles from './dashboard.module.css';

export type DashboardState = ReviewViewState;

// Plain links need the GitHub Pages base path added by hand
const hrefFor = (id: AdminScreenId) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens[id].path}`;

// Dashboard / Review Queue sections. The state comes from data later; today it's seed data.
export function DashboardContent({ state }: { state: DashboardState }) {
  const hasCounts = state === 'ready' || state === 'empty';
  // While loading or on error the counts show the approved state symbol; the message below explains it
  const unavailableCount = state === 'error' ? uiSymbols.error : uiSymbols.loading;
  const items = state === 'ready' ? needsAttentionSeed : [];

  return (
    <>
      <Card as="section">
        <div className={styles.queue} aria-busy={state === 'loading'}>
          <div className={styles.queueText}>
            <h2 className="section-title">{copy.reviewQueue.title}</h2>
            <p className={styles.description}>{copy.reviewQueue.description}</p>
          </div>
          <div className={styles.tiles}>
            {reviewQueueSummary.map((count) => (
              <MetricTile
                key={count.label}
                label={count.label}
                value={hasCounts ? String(state === 'empty' ? 0 : count.value) : unavailableCount}
              />
            ))}
          </div>
          <div className={styles.queueAction}>
            <ButtonLink variant="primary" href={hrefFor('review-tasks')}>
              {copy.reviewQueue.action}
            </ButtonLink>
          </div>
        </div>
      </Card>

      <section className="section" aria-labelledby="key-areas-heading">
        <div className={styles.sectionText}>
          <h2 id="key-areas-heading" className="section-title">
            {copy.keyAreas.title}
          </h2>
          <p className={styles.description}>{copy.keyAreas.description}</p>
        </div>
        <ul className={styles.keyAreas}>
          {dashboardKeyAreas.map((area) => (
            <li key={area.id} className={styles.keyArea}>
              <Card as="div">
                <h3 className={styles.keyAreaTitle}>
                  <a className={styles.keyAreaLink} href={hrefFor(area.id)}>
                    {adminScreens[area.id].name}
                  </a>
                </h3>
                <p className={styles.keyAreaDescription}>{area.description}</p>
              </Card>
              <span className={styles.chevron} aria-hidden="true">
                ›
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="needs-attention-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionText}>
            <h2 id="needs-attention-heading" className="section-title">
              {copy.needsAttention.title}
            </h2>
            <p className={styles.description}>{copy.needsAttention.description}</p>
          </div>
          <a className={styles.textLink} href={hrefFor('review-tasks')}>
            {copy.needsAttention.action}
          </a>
        </div>

        <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={hrefFor('review-tasks')} />

        {state === 'ready' && (
          <DataTable
            caption={copy.needsAttention.tableCaption}
            columns={reviewTableColumns}
            rows={reviewTableRows(items)}
          />
        )}
      </section>

      <Card as="div" title={copy.reminder.title} headingLevel={2}>
        <p className={styles.description}>{copy.reminder.body}</p>
      </Card>
    </>
  );
}
