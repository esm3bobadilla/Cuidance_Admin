import type { ReactNode } from 'react';
import { invitationCopy } from '../../../shared/content/invitation';
import styles from './onboarding.module.css';

// Week 11 feature 2: the frame for Accept Invitation and Account Setup. A Grounded Green
// welcome panel (brand surface) beside the form card; stacked on tablets and phones.
// `step` marks where the person is in the three getting-started steps.
export function SetupFrame({ step, children }: { step: 0 | 1 | 2; children: ReactNode }) {
  const { welcome } = invitationCopy;
  return (
    <main className={`shell ${styles.page}`}>
      <div className={styles.frame}>
        <aside className={styles.welcome} aria-labelledby="setup-welcome-heading">
          <h2 id="setup-welcome-heading" className={styles.welcomeHeading}>
            {welcome.heading}
          </h2>
          <p className={styles.welcomeBody}>{welcome.body}</p>
          <ol className={styles.steps} aria-label={welcome.stepsLabel}>
            {welcome.steps.map((label, index) => (
              <li key={label} className={styles.step} aria-current={index === step ? 'step' : undefined}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
        </aside>
        <div className={styles.card}>{children}</div>
      </div>
    </main>
  );
}
