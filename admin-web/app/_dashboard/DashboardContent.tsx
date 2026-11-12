'use client';

import { dashboardCopy as copy, dashboardKeyAreas } from '../../../shared/content/dashboard-review-queue';
import { dashboardSummary, needsAttention } from '../../../shared/review-loop/review-decisions';
import { adminScreens, type AdminScreenId } from '../../../shared/content/admin-web-screens';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { DataTable } from '../../components/data/DataTable';
import { MetricTile } from '../../components/data/MetricTile';
import { ButtonLink } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { reviewTableColumns, reviewTableRows, ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import { DecisionNotice } from '../_reviewLoop/DecisionNotice';
import { isSupabaseMode } from '../_data/config';
import { useReviewData } from '../_data/reviewData';
import styles from './dashboard.module.css';

export type DashboardState = ReviewViewState;

// Plain links need the GitHub Pages base path added by hand
const hrefFor = (id: AdminScreenId) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens[id].path}`;

// Dashboard / Review Queue sections. The state comes from data later; today it's seed data.
// Week 11: counts and Needs attention come from the seed plus this tab's review decisions
// (shared/review-loop). With no decisions they're the Week 10 values: 3 / 1 / 1 / 0 and five items.
// Phase A2: in Supabase mode the tasks come from the database (loading and error are real states).
export function DashboardContent({ state: preview }: { state: DashboardState }) {
  const data = useReviewData();
  const tasks = data.tasks;
  // A ?state= preview wins; otherwise the data's own state
  const state: DashboardState = preview !== 'ready' ? preview : data.state;
  const summary = dashboardSummary(tasks);
  const hasCounts = state === 'ready' || state === 'empty';
  // While loading or on error the counts show the approved state symbol; the message below explains it
  const unavailableCount = state === 'error' ? uiSymbols.error : uiSymbols.loading;
  const items = state === 'ready' ? needsAttention(tasks) : [];
  // Every item approved: the existing Empty panel
  const listState: DashboardState = state === 'ready' && items.length === 0 ? 'empty' : state;

  return (
    <div className={styles.dashboard}>
      {/* Week 11: "Decision recorded" once after a review decision */}
      {state === 'ready' && <DecisionNotice tasks={tasks} />}

      {/* Review Queue: header row, then the four counts as standalone tiles (prototype F08 hierarchy) */}
      <section className={styles.block} aria-labelledby="review-queue-heading" aria-busy={state === 'loading'}>
        <div className={styles.blockHeader}>
          <div className={styles.sectionText}>
            <h2 id="review-queue-heading" className={styles.label}>
              {copy.reviewQueue.title}
            </h2>
            <p className={styles.description}>{copy.reviewQueue.description}</p>
          </div>
          <ButtonLink variant="primary" href={hrefFor('review-tasks')}>
            {copy.reviewQueue.action}
          </ButtonLink>
        </div>
        <div className={styles.tiles}>
          {summary.map((count) => (
            <MetricTile
              key={count.label}
              label={count.label}
              value={hasCounts ? String(state === 'empty' ? 0 : count.value) : unavailableCount}
            />
          ))}
        </div>
      </section>

      {/* Needs attention: a panel with its header bar, then the table or a state panel */}
      <section className={styles.panel} aria-labelledby="needs-attention-heading">
        <div className={styles.panelHeader}>
          <div className={styles.sectionText}>
            <h2 id="needs-attention-heading" className={styles.label}>
              {copy.needsAttention.title}
            </h2>
            <p className={styles.description}>{copy.needsAttention.description}</p>
          </div>
          <a className={styles.textLink} href={hrefFor('review-tasks')}>
            {copy.needsAttention.action}
          </a>
        </div>

        {listState === 'ready' ? (
          <DataTable
            caption={isSupabaseMode ? supabaseModeCopy.needsAttentionCaption : copy.needsAttention.tableCaption}
            columns={reviewTableColumns}
            rows={reviewTableRows(items)}
            flush
          />
        ) : (
          <div className={styles.panelBody}>
            <ReviewStatePanel state={listState} messages={copy.states} emptyActionHref={hrefFor('review-tasks')} />
          </div>
        )}
      </section>

      {/* Key Areas: a panel of six links. Three across on desktop (hi-fi), one below 1280 px */}
      <section className={styles.panel} aria-labelledby="key-areas-heading">
        <div className={styles.panelHeader}>
          <div className={styles.sectionText}>
            <h2 id="key-areas-heading" className={styles.label}>
              {copy.keyAreas.title}
            </h2>
            <p className={styles.description}>{copy.keyAreas.description}</p>
          </div>
        </div>
        <ul className={styles.keyAreas}>
          {dashboardKeyAreas.map((area) => (
            <li key={area.id} className={styles.keyArea}>
              <div className={styles.keyAreaText}>
                <h3 className={styles.keyAreaTitle}>
                  <a className={styles.keyAreaLink} href={hrefFor(area.id)}>
                    {adminScreens[area.id].name}
                  </a>
                </h3>
                <p className={styles.keyAreaDescription}>{area.description}</p>
              </div>
              <span className={styles.chevron} aria-hidden="true">
                ›
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Card as="div" title={copy.reminder.title} headingLevel={2}>
        <p className={styles.description}>{copy.reminder.body}</p>
      </Card>
    </div>
  );
}
