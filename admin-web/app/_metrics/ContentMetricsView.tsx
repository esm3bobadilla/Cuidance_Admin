import { careAreaMetrics, contentMetricsCopy as copy, remaining } from '../../../shared/content/content-metrics';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { DataTable } from '../../components/data/DataTable';
import { MetricTile } from '../../components/data/MetricTile';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import styles from './metrics.module.css';

const dashboardHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.dashboard.path}`;

const series = [
  { key: 'published', label: copy.legend.published, className: styles.published, value: (m: (typeof careAreaMetrics)[number]) => m.published },
  { key: 'inReview', label: copy.legend.inReview, className: styles.inReview, value: (m: (typeof careAreaMetrics)[number]) => m.inReview },
  { key: 'needsChanges', label: copy.legend.needsChanges, className: styles.needsChanges, value: (m: (typeof careAreaMetrics)[number]) => m.needsChanges },
  { key: 'remaining', label: copy.legend.remaining, className: styles.remaining, value: remaining },
];

// Content Metrics (aligned with the approved hi-fi): internal content-management
// counts only, never participant analytics. The chart is CSS only (no chart
// library) and every bar shows its number, so color is never the only signal.
export function ContentMetricsView({ state }: { state: ReviewViewState }) {
  const ready = state === 'ready';
  const tileValue = (value: number) => (ready ? String(value) : state === 'empty' ? '0' : state === 'error' ? uiSymbols.error : uiSymbols.loading);

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>
      <p className={styles.range}>
        <span className={styles.rangeLabel}>{copy.dateRangeLabel}</span> {copy.dateRange}
      </p>

      <section className={styles.tiles} aria-label={copy.tilesLabel} aria-busy={state === 'loading'}>
        {copy.tiles.map((tile) => (
          <MetricTile key={tile.label} label={tile.label} value={tileValue(tile.value)} />
        ))}
      </section>

      {!ready ? (
        <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={dashboardHref} />
      ) : (
        <div className={styles.panels}>
          <section className={styles.panel} aria-labelledby="metrics-chart-title">
            <h2 id="metrics-chart-title" className={styles.panelTitle}>
              {copy.chartTitle}
            </h2>
            <div className={styles.chartScroll} role="region" aria-label={copy.chartLabel} tabIndex={0}>
              <ul className={styles.chart}>
                {careAreaMetrics.map((m) => (
                  <li key={m.careArea} className={styles.group}>
                    <div className={styles.bars} aria-hidden="true">
                      {series.map((s) => (
                        <span key={s.key} className={styles.barSlot}>
                          <span className={styles.barValue}>{s.value(m)}</span>
                          {/* Height is the value as a share of the chart scale (data, not a design value) */}
                          <span className={`${styles.bar} ${s.className}`} style={{ height: `${(s.value(m) / copy.chartScaleMax) * 100}%` }} />
                        </span>
                      ))}
                    </div>
                    <span className={styles.groupLabel}>{m.careArea}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className={styles.legend}>
              {series.map((s) => (
                <li key={s.key}>
                  <span className={`${styles.swatch} ${s.className}`} aria-hidden="true" />
                  {s.label}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.panel} aria-labelledby="metrics-table-title">
            <h2 id="metrics-table-title" className={styles.panelTitle}>
              {copy.tableTitle}
            </h2>
            <DataTable
              caption={copy.tableCaption}
              columns={[
                { key: 'careArea', header: copy.columns.careArea },
                { key: 'total', header: copy.columns.total, align: 'end' },
                { key: 'published', header: copy.columns.published, align: 'end' },
                { key: 'inReview', header: copy.columns.inReview, align: 'end' },
                { key: 'needsChanges', header: copy.columns.needsChanges, align: 'end' },
              ]}
              rows={careAreaMetrics.map((m) => ({
                id: m.careArea,
                cells: { careArea: m.careArea, total: String(m.total), published: String(m.published), inReview: String(m.inReview), needsChanges: String(m.needsChanges) },
              }))}
              compact
            />
          </section>
        </div>
      )}

      <p className={styles.banner}>{copy.banner}</p>
    </div>
  );
}
