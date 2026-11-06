'use client';

import { useEffect, useState } from 'react';
import { decisionNoticeCopy as copy } from '../../../shared/content/review-task-detail';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import type { ReviewNotice, ReviewTask } from '../../../shared/review-loop/review-decisions';
import { Button } from '../../components/ui/Button';
import { reviewTaskHref } from '../_review/ReviewShared';
import { clearReviewNotice, useReviewSession } from './reviewStore';
import styles from './reviewLoop.module.css';

// "Decision recorded" on the Dashboard after a review decision (Team 03, Nov 6, 2026).
// Temporary: it shows on the first Dashboard visit after the decision, then the saved
// message is cleared, so a reload or a later visit doesn't show it again.
export function DecisionNotice({ tasks }: { tasks: ReviewTask[] }) {
  const { notice } = useReviewSession();
  const [shown, setShown] = useState<ReviewNotice | null>(null);

  useEffect(() => {
    if (!notice) return;
    setShown(notice);
    clearReviewNotice();
  }, [notice]);

  const task = shown && tasks.find((item) => item.id === shown.taskId);
  if (!task) return null;

  return (
    <div className={styles.notice} role="status">
      <span className={styles.noticeIcon} aria-hidden="true">
        {uiSymbols.success}
      </span>
      <p className={styles.noticeMessage}>{copy.message(task.item, task.status)}</p>
      <div className={styles.noticeActions}>
        <a className={styles.textLink} href={reviewTaskHref(task.id)}>
          {copy.action}
        </a>
        <Button
          variant="ghost"
          onClick={() => {
            setShown(null);
            // The button goes away, so focus moves to the start of the page content
            document.getElementById('main-content')?.focus();
          }}
        >
          {copy.dismiss}
        </Button>
      </div>
    </div>
  );
}
