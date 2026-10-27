import {
  dashboardCopy as copy,
  dashboardKeyAreas,
  needsAttentionSeed,
  reviewQueueSummary,
  type ReviewStatus,
} from '../../../shared/content/dashboard-review-queue';
import { adminScreens, type AdminScreenId } from '../../../shared/content/admin-web-screens';
import { DataTable } from '../../components/data/DataTable';
import { MetricTile } from '../../components/data/MetricTile';
import { ButtonLink } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './dashboard.module.css';

export type DashboardState = 'ready' | 'loading' | 'empty' | 'error';

// Plain links need the GitHub Pages base path added by hand
const hrefFor = (id: AdminScreenId) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens[id].path}`;

// PROVISIONAL status treatment (no approved status-to-token mapping yet). Text always shows.
const statusTreatment: Record<ReviewStatus, { className: string; icon?: string }> = {
  'In review': { className: styles.statusNeutral },
  'Needs changes': { className: styles.statusError, icon: '⚠' },
  'Pending disclosure': { className: styles.statusPartner, icon: '◆' },
  'Needs review': { className: styles.statusAlert },
};

function StatusText({ status }: { status: ReviewStatus }) {
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

// Dashboard / Review Queue sections. The state comes from data later; today it's seed data.
export function DashboardContent({ state }: { state: DashboardState }) {
  const hasCounts = state === 'ready' || state === 'empty';
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
                value={hasCounts ? String(state === 'empty' ? 0 : count.value) : '…'}
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

        {state === 'loading' && (
          <p className={styles.statePanel} role="status">
            {copy.states.loading}
          </p>
        )}

        {state === 'error' && (
          <p className={`${styles.statePanel} ${styles.errorPanel}`} role="alert">
            <span className={styles.errorIcon} aria-hidden="true">
              ⚠
            </span>
            {copy.states.error}
          </p>
        )}

        {state === 'empty' && (
          <div className={`${styles.statePanel} ${styles.emptyPanel}`}>
            <p>{copy.states.empty}</p>
            <div>
              <ButtonLink variant="secondary" href={hrefFor('review-tasks')}>
                {copy.states.emptyAction}
              </ButtonLink>
            </div>
          </div>
        )}

        {state === 'ready' && (
          <DataTable
            caption={copy.needsAttention.tableCaption}
            columns={[
              { key: 'item', header: 'Item' },
              { key: 'type', header: 'Type' },
              { key: 'status', header: 'Status' },
              { key: 'priority', header: 'Priority' },
              { key: 'assignedTo', header: 'Assigned to' },
              { key: 'updated', header: 'Updated' },
            ]}
            rows={items.map((row) => ({
              id: row.id,
              cells: {
                item: row.item,
                type: row.type,
                status: <StatusText status={row.status} />,
                priority: <span className={`${styles.label} ${styles.statusNeutral}`}>{row.priority}</span>,
                assignedTo: row.assignedTo,
                updated: row.updated,
              },
            }))}
          />
        )}
      </section>

      <Card as="div" title={copy.reminder.title} headingLevel={2}>
        <p className={styles.description}>{copy.reminder.body}</p>
      </Card>
    </>
  );
}
