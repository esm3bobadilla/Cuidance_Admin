'use client';

import { useEffect, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { dashboardHomeCopy as copy, glanceCards, liveStatus, quickLinks, recentActivity } from '../../../shared/content/dashboard-home';
import { can, roleNames } from '../../../shared/content/permissions';
import { isOpen } from '../../../shared/review-loop/review-decisions';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import heroDashboard from '../../../shared/brand/heroes/hero-dashboard.jpg';
import heroDashboardWide from '../../../shared/brand/heroes/hero-dashboard-wide.jpg';
import glanceReview from '../../../shared/brand/illustrations/glance/glance-review.svg';
import glanceEmail from '../../../shared/brand/illustrations/glance/glance-email.svg';
import glanceApp from '../../../shared/brand/illustrations/glance/glance-app.svg';
import glanceWeb from '../../../shared/brand/illustrations/glance/glance-web.svg';
import { CuIcon } from '../../components/ui/CuIcon';
import { HeroBanner } from '../../components/ui/HeroBanner';
import { DecisionNotice } from '../_reviewLoop/DecisionNotice';
import { useIdentity } from '../_data/identity';
import { useReviewData } from '../_data/reviewData';
import { isSupabaseMode } from '../_data/config';
import styles from './dashboardHome.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const art = { review: glanceReview, email: glanceEmail, app: glanceApp, web: glanceWeb };

// Greeting by the visitor's local time, after load (the static page says "Welcome back")
function useGreeting() {
  const [greeting, setGreeting] = useState(copy.greeting.fallback);
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? copy.greeting.morning : hour < 18 ? copy.greeting.afternoon : copy.greeting.evening);
  }, []);
  return greeting;
}

export function DashboardHero() {
  const me = useIdentity();
  const greeting = useGreeting();
  // Sample mode has no real person, so the greeting has no name
  const first = isSupabaseMode && me.name ? me.name.split(' ')[0] : '';
  return (
    <HeroBanner
      eyebrow={copy.eyebrow}
      title={first ? `${greeting}, ${first}.` : `${greeting}.`}
      description={copy.subtitle}
      image={heroDashboard}
      wideImage={heroDashboardWide}
    />
  );
}

export function DashboardGlance() {
  const data = useReviewData();
  const open = data.state === 'ready' ? data.tasks.filter(isOpen).length : null;
  return (
    <section className={styles.section} aria-labelledby="glance-heading">
      <h2 id="glance-heading" className={styles.title}>
        {copy.glanceTitle}
      </h2>
      <ul className={styles.glance}>
        {glanceCards.map((card) => (
          <li key={card.key} className={styles.card}>
            <div className={styles.cardText}>
              <p className={styles.cardLabel}>{card.label}</p>
              <p className={styles.cardValue}>{card.value ?? (open === null ? uiSymbols.loading : String(open))}</p>
              <p className={styles.cardDetail}>{card.detail}</p>
              {card.sample && <span className={styles.sample}>{copy.sampleBadge}</span>}
            </div>
            <img className={styles.cardArt} src={art[card.key].src} width={56} height={56} alt="" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DashboardQuickWork() {
  const me = useIdentity();
  const rights = can(me.adminRole);
  const links = quickLinks.filter((link) => !link.requires || rights?.[link.requires]);
  return (
    <section className={`${styles.panel} ${styles.warm}`} aria-labelledby="quick-work-heading">
      <div className={styles.panelHeader}>
        <h2 id="quick-work-heading" className={styles.title}>
          {copy.quickWorkTitle}
        </h2>
        {me.adminRole && <p className={styles.note}>{copy.quickWorkNote(roleNames[me.adminRole])}</p>}
      </div>
      <ul className={styles.quick}>
        {links.map((link) => (
          <li key={link.label}>
            <a className={styles.quickLink} href={`${base}${adminScreens[link.screen].path}${link.query ?? ''}`}>
              <CuIcon name={link.icon} variant="badge" size={32} />
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Week 11 review loop: "Decision recorded" shows once on the Dashboard after a decision
export function DashboardDecisionNotice() {
  const data = useReviewData();
  return data.state === 'ready' ? <DecisionNotice tasks={data.tasks} /> : null;
}

export function DashboardLiveStatus() {
  return (
    <section className={styles.panel} aria-labelledby="live-status-heading">
      <div className={styles.panelHeader}>
        <h2 id="live-status-heading" className={styles.title}>
          {copy.liveTitle}
        </h2>
        <span className={styles.sample}>{copy.sampleBadge}</span>
      </div>
      <p className={styles.note}>{copy.liveNote}</p>
      <ul className={styles.live}>
        {liveStatus.map((row) => (
          <li key={row.key} className={styles.liveRow}>
            <CuIcon name={row.icon} variant="badge" size={36} />
            <span className={styles.liveText}>
              <span className={styles.liveName}>
                {row.name}
                <span className={styles.liveState}>
                  <CuIcon name="live" size={14} />
                  {copy.liveStateLabel(row.state)}
                </span>
              </span>
              <span className={styles.activityMeta}>{row.detail}</span>
              {/* Phase 2 PR 1: the static preview (sample data, nothing is published) */}
              <a className={styles.livePending} href={`${base}${adminScreens[row.screen].path}`}>
                <CuIcon name="arrowR" size={14} />
                {copy.livePreviewLink(row.name)}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DashboardActivity() {
  return (
    <section className={styles.panel} aria-labelledby="activity-heading">
      <div className={styles.panelHeader}>
        <h2 id="activity-heading" className={styles.title}>
          {copy.activityTitle}
        </h2>
        <p className={styles.note}>{copy.activityNote}</p>
      </div>
      <ul className={styles.activity}>
        {recentActivity.map((row) => (
          <li key={row.item} className={styles.activityRow}>
            <span className={styles.activityText}>
              <strong>{row.who}</strong> {row.what} <strong>{row.item}</strong>
              <span className={styles.activityMeta}>{row.area}</span>
            </span>
            <span className={styles.activityWhen}>{row.when}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
