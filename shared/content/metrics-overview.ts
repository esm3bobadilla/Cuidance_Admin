/*
 * Metrics overview (Phase B1, approved prototype): App, Website and Communication tabs
 * with KPI cards, an engagement chart and top content. SAMPLE DATA ONLY: real
 * analytics are deferred (Team 03 decision). Internal content metrics, not participant
 * analytics. The existing Content metrics view stays as its own tab.
 */
export type Kpi = { key: string; label: string; value: string; change: string; art: 'visits' | 'guidance' | 'quiz' | 'push'; series: number[] };
export type MetricsTab = { id: 'app' | 'web' | 'comms'; label: string; source: string; kpis: Kpi[]; top: { label: string; share: number }[] };

export const metricsOverviewCopy = {
  heroEyebrow: 'Sample data · not connected',
  heroTitle: 'Metrics',
  heroSubtitle: 'View App, Website and Communication performance in one place.',
  tabsLabel: 'Metrics area',
  contentTab: 'Content',
  kpiLabel: 'Key numbers. Choose a card to see its trend.',
  chartTitle: (kpi: string) => `${kpi} over time`,
  chartNote: (source: string) => `${source} · Last 8 weeks · Sample data`,
  tableToggleShow: 'Show as table',
  tableToggleHide: 'Show as chart',
  week: (n: number) => `Week ${n}`,
  topTitle: 'Top-performing content',
  topNote: 'Share of views · Sample data',
  columns: { week: 'Week', value: 'Value' },
  changeLabel: (change: string) => `${change} vs last period`,
  banner: 'Sample numbers for layout review. They are not real analytics and are not connected to the Cuidance App, Website or email.',
};

const s = (...n: number[]) => n;

export const metricsTabs: MetricsTab[] = [
  {
    id: 'app',
    label: 'App',
    source: 'Cuidance App',
    kpis: [
      { key: 'visits', label: 'App visits', value: '12,480', change: '+18%', art: 'visits', series: s(1180, 1260, 1310, 1290, 1420, 1500, 1610, 1680) },
      { key: 'guidance', label: 'Guidance views', value: '4,806', change: '+24%', art: 'guidance', series: s(420, 470, 510, 560, 600, 640, 690, 720) },
      { key: 'quiz', label: 'Quiz completions', value: '1,284', change: '+8%', art: 'quiz', series: s(140, 150, 152, 160, 158, 168, 172, 184) },
      { key: 'push', label: 'Push opens', value: '1,026', change: '+5%', art: 'push', series: s(118, 120, 124, 126, 128, 130, 136, 144) },
    ],
    top: [
      { label: 'Ingredient education', share: 42 },
      { label: 'Guidance articles', share: 31 },
      { label: 'Quiz results', share: 18 },
      { label: 'Saved routine notes', share: 9 },
    ],
  },
  {
    id: 'web',
    label: 'Website',
    source: 'Brand Website',
    kpis: [
      { key: 'visits', label: 'Website visits', value: '8,932', change: '+11%', art: 'visits', series: s(980, 1010, 1060, 1090, 1110, 1150, 1240, 1290) },
      { key: 'guidance', label: 'Article reads', value: '3,214', change: '+9%', art: 'guidance', series: s(350, 370, 380, 390, 400, 420, 440, 460) },
      { key: 'quiz', label: 'Quiz starts', value: '962', change: '+4%', art: 'quiz', series: s(112, 114, 118, 116, 120, 124, 126, 132) },
      { key: 'push', label: 'App sign-ups', value: '418', change: '+6%', art: 'push', series: s(44, 46, 48, 50, 52, 54, 60, 64) },
    ],
    top: [
      { label: 'Homepage', share: 38 },
      { label: 'Care guides', share: 34 },
      { label: 'About Cuidance', share: 16 },
      { label: 'Partner highlights', share: 12 },
    ],
  },
  {
    id: 'comms',
    label: 'Communication',
    source: 'Email (not connected)',
    kpis: [
      { key: 'visits', label: 'Emails delivered', value: '2,140', change: '+3%', art: 'visits', series: s(250, 255, 260, 262, 266, 270, 274, 280) },
      { key: 'guidance', label: 'Open rate', value: '46%', change: '+2%', art: 'guidance', series: s(42, 43, 43, 44, 44, 45, 45, 46) },
      { key: 'quiz', label: 'Click rate', value: '12%', change: '+1%', art: 'quiz', series: s(10, 10, 11, 11, 11, 12, 12, 12) },
      { key: 'push', label: 'Unsubscribes', value: '0.4%', change: '0%', art: 'push', series: s(0.5, 0.4, 0.4, 0.5, 0.4, 0.4, 0.4, 0.4) },
    ],
    top: [
      { label: 'Welcome email', share: 44 },
      { label: 'Routine reminder', share: 28 },
      { label: 'New guidance digest', share: 20 },
      { label: 'Password reset', share: 8 },
    ],
  },
];
