import { Suspense } from 'react';
import { quizContentCopy } from '../../../../shared/content/quiz-content';
import { QuizContentView } from '../../_quiz/QuizContentView';
import { QuizStateFromUrl } from '../../_quiz/QuizStateFromUrl';
import { ScreenPage, screenMetadata } from '../../_screens/ScreenPage';

export const metadata = screenMetadata('quiz-content');

// Quiz Content, aligned with the approved Week 9 hi-fi (A2). Sample data only.
export default function Page() {
  return (
    <ScreenPage id="quiz-content" eyebrow={quizContentCopy.eyebrow}>
      {/* The static page shows the sample list, so it works without JavaScript */}
      <Suspense fallback={<QuizContentView state="ready" />}>
        <QuizStateFromUrl />
      </Suspense>
    </ScreenPage>
  );
}
