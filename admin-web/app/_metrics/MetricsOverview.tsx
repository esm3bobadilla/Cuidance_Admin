'use client';

import { useState, type ReactNode } from 'react';
import { metricsOverviewCopy as copy, metricsTabs, type Kpi, type MetricsTab } from '../../../shared/content/metrics-overview';
import kpiGuidance from '../../../shared/brand/illustrations/metrics/kpi-guidance.webp';
import kpiPush from '../../../shared/brand/illustrations/metrics/kpi-push.webp';
import kpiQuiz from '../../../shared/brand/illustrations/metrics/kpi-quiz.webp';
import kpiVisits from '../../../shared/brand/illustrations/metrics/kpi-visits.webp';
import { DataTable } from '../../components/data/DataTable';
import { Tabs } from '../../components/ui/Tabs';
import styles from './metricsOverview.module.css';

const art = { visits: kpiVisits, guidance: kpiGuidance, quiz: kpiQuiz, push: kpiPush };
const W = 640;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 32, left: 48 };

// One series, one axis: the title names it, so no legend. Hover or focus a point for its value.
function TrendChart({ kpi }: { kpi: Kpi }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...kpi.series);
  const top = max * 1.15;
  const x = (i: number) => PAD.left + (i * (W - PAD.left - PAD.right)) / (kpi.series.length - 1);
  const y = (v: number) => PAD.top + (1 - v / top) * (H - PAD.top - PAD.bottom);
  const ticks = [0, top / 2, top].map((t) => Math.round(t * 10) / 10);
  const line = kpi.series.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join('');
  return (
    <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${copy.chartTitle(kpi.label)}. Values are in the table view.`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className={styles.grid} />
          <text x={PAD.left - 8} y={y(t)} className={styles.axis} textAnchor="end" dominantBaseline="middle">
            {t.toLocaleString()}
          </text>
        </g>
      ))}
      {kpi.series.map((_, i) => (
        <text key={i} x={x(i)} y={H - 8} className={styles.axis} textAnchor="middle">
          {i + 1}
        </text>
      ))}
      <path d={line} className={styles.line} />
      {kpi.series.map((v, i) => (
        <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          {/* Larger invisible hit area than the mark */}
          <rect x={x(i) - 20} y={PAD.top} width={40} height={H - PAD.top - PAD.bottom} fill="transparent" />
          <circle cx={x(i)} cy={y(v)} r={hover === i ? 6 : 4} className={styles.dot} />
        </g>
      ))}
      {/* Last value labeled directly */}
      <text x={x(kpi.series.length - 1)} y={y(kpi.series[kpi.series.length - 1]) - 12} className={styles.label} textAnchor="end">
        {kpi.series[kpi.series.length - 1].toLocaleString()}
      </text>
      {hover !== null && (
        <g pointerEvents="none">
          <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={H - PAD.bottom} className={styles.crosshair} />
          <text x={x(hover)} y={PAD.top + 4} className={styles.tooltip} textAnchor={hover > kpi.series.length / 2 ? 'end' : 'start'} dx={hover > kpi.series.length / 2 ? -8 : 8}>
            {copy.week(hover + 1)}: {kpi.series[hover].toLocaleString()}
          </text>
        </g>
      )}
    </svg>
  );
}

function TabPanel({ tab }: { tab: MetricsTab }) {
  const [selected, setSelected] = useState(tab.kpis[0].key);
  const [asTable, setAsTable] = useState(false);
  const kpi = tab.kpis.find((k) => k.key === selected) ?? tab.kpis[0];
  return (
    <div className={styles.panelStack}>
      <ul className={styles.kpis} aria-label={copy.kpiLabel}>
        {tab.kpis.map((k) => (
          <li key={k.key}>
            <button type="button" className={styles.kpi} aria-pressed={k.key === kpi.key} onClick={() => setSelected(k.key)}>
              <span className={styles.kpiText}>
                <span className={styles.kpiLabel}>{k.label}</span>
                <span className={styles.kpiValue}>{k.value}</span>
                <span className={styles.kpiChange}>{copy.changeLabel(k.change)}</span>
              </span>
              <img src={art[k.art].src} width={48} height={48} alt="" className={styles.kpiArt} />
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.split}>
        <section className={styles.card} aria-labelledby={`${tab.id}-trend`}>
          <div className={styles.cardHeader}>
            <div>
              <h2 id={`${tab.id}-trend`} className={styles.cardTitle}>
                {copy.chartTitle(kpi.label)}
              </h2>
              <p className="note">{copy.chartNote(tab.source)}</p>
            </div>
            <button type="button" className={styles.textButton} onClick={() => setAsTable(!asTable)}>
              {asTable ? copy.tableToggleHide : copy.tableToggleShow}
            </button>
          </div>
          {asTable ? (
            <DataTable
              caption={copy.chartTitle(kpi.label)}
              flush
              columns={[
                { key: 'week', header: copy.columns.week },
                { key: 'value', header: copy.columns.value, align: 'end' },
              ]}
              rows={kpi.series.map((v, i) => ({ id: String(i), cells: { week: copy.week(i + 1), value: v.toLocaleString() } }))}
            />
          ) : (
            <TrendChart kpi={kpi} />
          )}
        </section>
        <section className={styles.card} aria-labelledby={`${tab.id}-top`}>
          <h2 id={`${tab.id}-top`} className={styles.cardTitle}>
            {copy.topTitle}
          </h2>
          <p className="note">{copy.topNote}</p>
          <ul className={styles.bars}>
            {tab.top.map((row) => (
              <li key={row.label} className={styles.barRow}>
                <span className={styles.barText}>
                  <span>{row.label}</span>
                  <strong>{row.share}%</strong>
                </span>
                <span className={styles.barTrack} aria-hidden="true">
                  <span className={styles.barFill} style={{ width: `${row.share}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

// App, Website and Communication (sample), then the existing internal Content metrics
export function MetricsOverview({ contentView }: { contentView: ReactNode }) {
  return (
    <>
      <p className={styles.banner} role="note">
        {copy.banner}
      </p>
      <Tabs
        label={copy.tabsLabel}
        tabs={[
          ...metricsTabs.map((tab) => ({ id: tab.id, label: tab.label, content: <TabPanel tab={tab} /> })),
          { id: 'content', label: copy.contentTab, content: contentView },
        ]}
      />
    </>
  );
}
