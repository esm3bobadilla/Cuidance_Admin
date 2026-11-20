'use client';

import { useState } from 'react';
import { demoModeCopy as copy } from '../../../shared/content/demo-mode';
import { resetDemo } from '../../app/_data/demoStore';
import { Dialog } from '../overlay/Dialog';
import { Button } from '../ui/Button';
import { CuIcon } from '../ui/CuIcon';
import styles from './DemoBanner.module.css';

// Compact Demo mode banner (Phase 2 PR 2), the same on Product Library, Email, Live and the
// Dashboard. Reset demo data asks for confirmation first, and the result is announced.
export function DemoBanner({ imagesNote = false }: { imagesNote?: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState('');
  return (
    <div className={styles.banner} role="note" aria-label={copy.label}>
      <p className={styles.text}>
        <span className={styles.label}>
          <CuIcon name="live" size={14} /> {copy.label}
        </span>{' '}
        {copy.message}
        {imagesNote && ` ${copy.imagesNote}`}
      </p>
      <Button variant="ghost" onClick={() => setConfirming(true)} aria-haspopup="dialog">
        {copy.reset}
      </Button>
      <p role="status" className={styles.status}>
        {status}
      </p>
      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        tone="alert"
        title={copy.resetDialog.title}
        actions={
          <>
            <Button onClick={() => setConfirming(false)}>{copy.resetDialog.cancel}</Button>
            <Button
              variant="primary"
              onClick={() => {
                setConfirming(false);
                setStatus(resetDemo() ? copy.resetDone : copy.resetFailed);
              }}
            >
              {copy.resetDialog.confirm}
            </Button>
          </>
        }
      >
        <p>{copy.resetDialog.body}</p>
      </Dialog>
    </div>
  );
}
