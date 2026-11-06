/*
 * Content Metrics screen: wording and SAMPLE DATA (final alignment batch).
 *
 * Source: the approved Week 9 hi-fi screenshot of Content Metrics (attached Nov 6,
 * 2026). Tiles, the care-area table and the banner are taken from it as shown.
 * The chart's "Remaining (not published)" bars are total minus published, in
 * review and needs changes, which matches the hi-fi chart.
 * PROVISIONAL:
 * - The hi-fi's tile totals (In review 28, Needs changes 14) don't match the
 *   table's totals (34 and 26). Both are shown as the hi-fi has them. Team 03 to confirm.
 * - Date range, Care area and Content type filters aren't built: the hi-fi only
 *   shows one range and has no content-type breakdown. The range is shown as text.
 * - Chart colors: no data-visualization tokens are approved yet; existing
 *   semantic tokens are used, and every bar shows its number.
 * These are internal content-management metrics, not participant analytics.
 */

export const contentMetricsCopy = {
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  dateRangeLabel: 'Date range',
  dateRange: 'Last 90 days',
  // Accessible name for the four totals
  tilesLabel: 'Content totals',
  tiles: [
    { label: 'Published content', value: 156 },
    { label: 'In review', value: 28 },
    { label: 'Needs changes', value: 14 },
    { label: 'Sources reviewed', value: 198 },
  ],
  chartTitle: 'Content by care area',
  chartScaleMax: 60,
  // Accessible name for the chart region; the same values are in the table below it
  chartLabel: 'Content by care area. The same values are listed in the table Content details by care area.',
  legend: { published: 'Published', inReview: 'In review', needsChanges: 'Needs changes', remaining: 'Remaining (not published)' },
  tableTitle: 'Content details by care area',
  tableCaption: 'Content details by care area (sample data)',
  columns: { careArea: 'Care area', total: 'Total items', published: 'Published', inReview: 'In review', needsChanges: 'Needs changes' },
  // Hi-fi banner wording
  banner: 'These are internal content-management metrics. They do not represent participant analytics, user behavior, outcomes, or performance claims.',
  states: {
    loading: 'Loading content metrics…',
    empty: 'No content metrics yet.',
    emptyAction: 'Go to Dashboard',
    error: "Couldn't load content metrics. Check your connection, then reload the page.",
  },
};

export type CareAreaMetric = { careArea: string; total: number; published: number; inReview: number; needsChanges: number };

export const careAreaMetrics: CareAreaMetric[] = [
  { careArea: 'Hair care', total: 80, published: 45, inReview: 10, needsChanges: 8 },
  { careArea: 'Skin care', total: 63, published: 38, inReview: 8, needsChanges: 5 },
  { careArea: 'Makeup', total: 47, published: 26, inReview: 6, needsChanges: 5 },
  { careArea: 'Body care', total: 37, published: 22, inReview: 3, needsChanges: 4 },
  { careArea: 'Products and ingredients', total: 50, published: 25, inReview: 7, needsChanges: 4 },
];

export const remaining = (m: CareAreaMetric) => m.total - m.published - m.inReview - m.needsChanges;
