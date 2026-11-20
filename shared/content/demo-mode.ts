/*
 * Demo mode wording (Phase 2 PR 2). Product Library, Email and Live run as a working demo:
 * changes stay in this browser session and nothing is sent, scheduled or published.
 */

export const demoModeCopy = {
  label: 'Demo mode',
  message: 'Changes stay in this browser session and are not sent or published.',
  imagesNote: 'Uploaded images are not kept after you leave the page.',
  reset: 'Reset demo data',
  resetDialog: {
    title: 'Reset demo data?',
    body: 'Product records, email and Live updates go back to the sample data for this browser session. Nothing else changes, and nothing was ever sent or published.',
    confirm: 'Reset demo data',
    cancel: 'Keep my changes',
  },
  resetDone: 'Demo data reset to the sample data.',
  resetFailed: 'This browser could not reset the demo data. Close the tab to clear it.',
  saveFailed: 'This browser could not keep the change. It will be lost when you leave the page.',
};
