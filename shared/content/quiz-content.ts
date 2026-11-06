/*
 * Quiz Content screen: wording and SAMPLE DATA (prototype alignment, Slice 3).
 *
 * Source: the approved Week 9 hi-fi screenshot of Quiz Content (A2). Question
 * titles, types, care area, statuses and dates are taken from it as shown.
 * - Only the "Universal" questions are used. A2's rows with the care areas
 *   "Emotional Wellbeing" and "Practical Support" are left out: they aren't
 *   Cuidance care areas (hair, skin, makeup, body care). Team 03 to confirm.
 * - A2's answer options are left out for the same reason (they include
 *   "Understanding a condition or topic"). PROVISIONAL placeholder below.
 * - A2's editor names are replaced by placeholders, as on the Dashboard.
 * Nothing here is live content. Supabase replaces this file later.
 */

export type QuizQuestionStatus = 'Published' | 'In review' | 'Draft';

export type QuizQuestion = {
  id: string;
  question: string;
  type: string;
  careArea: string;
  status: QuizQuestionStatus;
  updated: string;
  updatedBy: string;
};

export const quizContentCopy = {
  // Hi-fi eyebrow for content screens
  eyebrow: 'Internal tool',
  sampleDataNote: 'Sample data. Nothing here is connected to live content, and these screens are not part of participant testing.',
  searchLabel: 'Search questions',
  searchPlaceholder: 'Search questions, care areas, or keywords…',
  statusLabel: 'Status',
  allStatuses: 'All statuses',
  tableCaption: 'Quiz questions (sample data)',
  columns: { question: 'Question', type: 'Type', careArea: 'Care area', status: 'Status', updated: 'Last updated' },
  count: (shown: number, total: number) => (shown === 0 ? `0 of ${total} questions` : `1–${shown} of ${total} questions`),
  updatedBy: (by: string) => `by ${by}`,
  detail: {
    heading: 'Question details',
    lastUpdated: (date: string, by: string) => `Last updated ${date} by ${by}`,
    type: 'Type',
    careArea: 'Care area',
    answerOptions: 'Answer options',
    // PROVISIONAL: A2's answer options are outside Cuidance's scope
    answerOptionsPending: 'To be confirmed by Team 03.',
  },
  // Shown under the care area. Wording from A2.
  careAreaNotes: {
    Universal: 'Shown to all participants at the start of the quiz.',
  } as Record<string, string>,
  // PROVISIONAL state messages: the board marks Empty and Loading as provisional
  states: {
    loading: 'Loading quiz questions…',
    empty: 'No quiz questions yet.',
    emptyAction: 'Go to Content',
    error: "Couldn't load quiz questions. Check your connection, then reload the page.",
    noResults: 'No questions match your search or filter.',
    clear: 'Clear search and filter',
  },
};

export const quizQuestionSeed: QuizQuestion[] = [
  { id: 'q1', question: 'What are you most interested in exploring?', type: 'Multiple choice', careArea: 'Universal', status: 'Published', updated: 'Mar 12, 2024', updatedBy: 'Team member A' },
  { id: 'q2', question: 'How confident do you feel exploring the areas you picked?', type: 'Scale', careArea: 'Universal', status: 'In review', updated: 'Mar 10, 2024', updatedBy: 'Team member B' },
  { id: 'q3', question: 'Which care areas would you like guidance on?', type: 'Multiple select', careArea: 'Universal', status: 'Published', updated: 'Mar 05, 2024', updatedBy: 'Team member A' },
  { id: 'q4', question: 'What would you like help understanding?', type: 'Open text', careArea: 'Universal', status: 'Draft', updated: 'Feb 28, 2024', updatedBy: 'Team member C' },
  { id: 'q5', question: 'Are you looking for guidance for yourself or a loved one?', type: 'Multiple choice', careArea: 'Universal', status: 'Draft', updated: 'Feb 02, 2024', updatedBy: 'Team member B' },
];

export const quizStatuses: QuizQuestionStatus[] = ['Published', 'In review', 'Draft'];
