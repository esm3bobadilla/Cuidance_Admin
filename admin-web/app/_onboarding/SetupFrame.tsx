import type { ReactNode } from 'react';
import { invitationCopy } from '../../../shared/content/invitation';
import { entryCopy } from '../../../shared/content/sign-in';
import handStone from '../../../shared/brand/illustrations/illus-hand-stone.png';
import leafHand from '../../../shared/brand/illustrations/illus-leaf-hand.png';
import styles from './onboarding.module.css';

// The frame for Sign In, Create Account, Accept Invitation and Account Setup (Week 11
// feature 2, Phase A1), so the four feel like one connected experience:
// - "entry" (Sign In, Create Account): the Sign-in Entry hero (large Newsreader line and
//   an approved flat illustration) beside the card.
// - "steps" (Accept Invitation, Account Setup): the Grounded Green welcome panel with the
//   three getting-started steps; `step` marks where the person is.
// Both sit on Quiet Paper with restrained Grounded Green and Care Terracotta shapes in the
// corners (decorative). Stacked on tablets and phones.
export function SetupFrame({ variant = 'steps', step = 0, children }: { variant?: 'entry' | 'steps'; step?: 0 | 1 | 2; children: ReactNode }) {
  const { welcome } = invitationCopy;
  return (
    <main className={`shell ${styles.page}`}>
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.shapeBrand} />
        <span className={styles.shapeTerracotta} />
        <span className={styles.shapeWarm} />
      </div>
      <div className={variant === 'entry' ? `${styles.frame} ${styles.entryFrame}` : styles.frame}>
        {variant === 'entry' ? (
          <div className={styles.hero}>
            <p className={styles.headline}>{entryCopy.headline}</p>
            <p className={styles.heroBody}>{entryCopy.body}</p>
            <img className={styles.heroArt} src={handStone.src} width={handStone.width} height={handStone.height} alt="" aria-hidden="true" />
          </div>
        ) : (
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
            <span className={styles.welcomeArt} aria-hidden="true">
              <img src={leafHand.src} width={leafHand.width} height={leafHand.height} alt="" />
            </span>
          </aside>
        )}
        <div className={styles.card}>{children}</div>
      </div>
    </main>
  );
}
