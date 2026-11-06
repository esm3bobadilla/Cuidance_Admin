/*
 * Guidance Rules Review screen: wording and SAMPLE DATA (final alignment batch).
 *
 * Source: the approved Week 9 hi-fi screenshot of Guidance Rules Review (attached
 * Nov 6, 2026). Rules, triggers, care areas, linked guidance, statuses, dates, the
 * banner and the first rule's details are taken from it as shown, with these
 * PROVISIONAL changes:
 * - Reviewer names are replaced by "Reviewer A" to "D".
 * - The Question and Version filters aren't built: the hi-fi doesn't say which
 *   questions or versions exist. Status and Care area filters are built.
 * - "Mark in review", "Edit rule", the "…" menu and the version switcher aren't
 *   built: no approved review or publishing flow.
 * - The hi-fi shows details for one rule only; the others show "To be confirmed
 *   by Team 03."
 * Guidance stays educational and non-diagnostic: the hi-fi's banner and safety
 * boundary say so on the screen.
 */

export type RuleStatus = 'Draft' | 'In review' | 'Approved with notes' | 'Needs changes';

export type GuidanceRule = {
  id: string;
  name: string;
  trigger: string;
  careArea: string;
  linkedGuidance: string;
  status: RuleStatus;
  reviewer: string;
  updated: string;
  details?: {
    version: string;
    question: string;
    linkedType: string;
    explanation: string;
    reviewerNotes: string;
    updatedLine: string;
  };
};

export const guidanceRulesCopy = {
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  // Hi-fi banner and safety boundary wording
  banner: 'Rules are reviewed by people. Guidance explains what may be useful; it does not diagnose or make unquestionable automated judgments.',
  safetyBoundary: 'Guidance explains what may be useful; it does not diagnose or make unquestionable automated judgments.',
  searchLabel: 'Search rules',
  searchPlaceholder: 'Search rules, answers, or guidance…',
  careAreaLabel: 'Care area',
  allCareAreas: 'All care areas',
  statusLabel: 'Status',
  allStatuses: 'All statuses',
  tableCaption: 'Guidance rules (sample data)',
  columns: { name: 'Rule name', trigger: 'Trigger or answer', careArea: 'Care area', linkedGuidance: 'Linked guidance', status: 'Status', reviewer: 'Reviewer', updated: 'Last updated' },
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} rules` : `1–${shown} of ${total} rules`),
  detail: {
    heading: 'Rule details',
    version: 'Version',
    trigger: 'Question or answer trigger',
    from: (question: string) => `From: ${question}`,
    linked: 'Linked guidance content',
    explanation: 'Explanation',
    safety: 'Safety boundary',
    reviewerNotes: 'Reviewer notes',
    pending: 'To be confirmed by Team 03.',
  },
  states: {
    loading: 'Loading guidance rules…',
    empty: 'No guidance rules yet.',
    emptyAction: 'Go to Dashboard',
    error: "Couldn't load guidance rules. Check your connection, then reload the page.",
    noResults: 'No rules match your search or filters.',
    clear: 'Clear search and filters',
  },
};

export const ruleStatuses: RuleStatus[] = ['Draft', 'In review', 'Approved with notes', 'Needs changes'];

export const guidanceRuleSeed: GuidanceRule[] = [
  {
    id: 'r1',
    name: 'Sensitive-skin guidance connection',
    trigger: '“My skin often feels sensitive.”',
    careArea: 'Skin Health',
    linkedGuidance: 'Sensitive skin care basics',
    status: 'Draft',
    reviewer: 'Reviewer A',
    updated: 'Apr 10, 2025 2:14 PM',
    details: {
      version: 'Version 1.0',
      question: 'How would you describe your skin?',
      linkedType: 'Education article · Skin Health',
      explanation:
        'This rule connects the sensitive skin response to foundational guidance on gentle care, common triggers, and supportive ingredients. It helps people find relevant education that may be useful for their needs and interests.',
      reviewerNotes: 'Double-check that the linked content reflects our latest guidance on fragrance and essential oils.',
      updatedLine: 'Last updated Apr 10, 2025 at 2:14 PM by Reviewer A',
    },
  },
  { id: 'r2', name: 'Textured-hair education branch', trigger: '“I have textured or curly hair.”', careArea: 'Hair Care', linkedGuidance: 'Caring for textured hair', status: 'In review', reviewer: 'Reviewer B', updated: 'Apr 9, 2025 11:03 AM' },
  { id: 'r3', name: 'Makeup coverage and shade-family branch', trigger: '“I want more coverage.”', careArea: 'Makeup', linkedGuidance: 'Finding your shade family', status: 'Approved with notes', reviewer: 'Reviewer C', updated: 'Apr 8, 2025 4:21 PM' },
  { id: 'r4', name: 'I am not sure yet support route', trigger: '“I am not sure yet.”', careArea: 'General Support', linkedGuidance: 'Next steps and exploration', status: 'Needs changes', reviewer: 'Reviewer D', updated: 'Apr 6, 2025 10:18 AM' },
];
