'use client';

import { useRef, useState } from 'react';
import { adminRoles } from '../../../shared/content/admin-roles';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { invitationCopy as copy, invitationFromParam, invitationsSeed, prototypeNotice, type Invitation } from '../../../shared/content/invitation';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { invitationView, type InvitationView } from '../../../shared/onboarding/onboarding-rules';
import { Button, ButtonLink } from '../../components/ui/Button';
import { acceptInvitation, declineInvitation, requestNewInvitation, resetOnboarding, useOnboardingSession } from './onboardingStore';
import { isSupabaseMode } from '../_data/config';
import { InvitationsUnavailable } from './InvitationsUnavailable';
import { SetupFrame } from './SetupFrame';
import styles from './onboarding.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const accountSetupHref = `${base}${adminScreens['account-setup'].path}`;
const reviewTasksHref = `${base}${adminScreens['review-tasks'].path}`;

// Review aid only (?state=): shows a state without saving anything
export type InvitationPreview = 'loading' | 'expired' | 'declined' | 'not-found' | 'accepted';

const roleName = (invitation: Invitation) => adminRoles.find((role) => role.id === invitation.role)?.name ?? invitation.role;

// Accept Invitation (Week 11 feature 2). PROTOTYPE ONLY: the invitation is sample data,
// and the answer is kept in this browser tab only.
export function AcceptInvitationView({ inviteParam, preview }: { inviteParam: string | null; preview?: InvitationPreview }) {
  // Phase A2: real invitations arrive in Phase 2.5, so Supabase mode doesn't show the sample flow
  if (isSupabaseMode) return <InvitationsUnavailable title={adminScreens['accept-invitation'].name} />;
  return <SampleAcceptInvitation inviteParam={inviteParam} preview={preview} />;
}

function SampleAcceptInvitation({ inviteParam, preview }: { inviteParam: string | null; preview?: InvitationPreview }) {
  const session = useOnboardingSession();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [justAccepted, setJustAccepted] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const invitation = preview === 'expired' ? invitationsSeed.expired : preview === 'not-found' ? undefined : preview ? invitationsSeed.sample : invitationFromParam(inviteParam);
  const view: InvitationView | 'loading' = preview ?? invitationView(invitation, session);
  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus());

  const act = (action: () => boolean, after?: () => void) => {
    if (preview) return;
    const saved = action();
    setSaveFailed(!saved);
    if (saved) {
      after?.();
      focusHeading();
    }
  };

  const title = {
    loading: copy.valid.title,
    valid: copy.valid.title,
    accepted: justAccepted ? copy.accepted.title : copy.alreadyAccepted.title,
    expired: copy.expired.title,
    declined: copy.declined.title,
    'not-found': copy.notFound.title,
  }[view];

  return (
    <SetupFrame step={view === 'accepted' ? 1 : 0}>
      {/* Buttons can't work without JavaScript, so they're hidden there */}
      <noscript>
        <style>{`.${styles.jsOnly} { display: none !important; }`}</style>
      </noscript>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
        {view === 'accepted' && justAccepted && (
          <span className={styles.titleIconSuccess} aria-hidden="true">
            {uiSymbols.success}{' '}
          </span>
        )}
        {title}
      </h1>

      {view === 'loading' && (
        <p className={styles.statusLine} role="status">
          <span aria-hidden="true">{uiSymbols.loading}</span> {copy.states.loading}
        </p>
      )}

      {view === 'valid' && invitation && (
        <>
          <p className={styles.intro}>{copy.valid.intro}</p>
          <InvitationDetails invitation={invitation} />
          <p className={styles.notice}>{prototypeNotice}</p>
          {saveFailed && <SaveError />}
          <noscript>
            <p className={styles.muted}>{copy.noScript}</p>
          </noscript>
          <div className={`${styles.actions} ${styles.jsOnly}`}>
            <Button variant="primary" onClick={() => act(acceptInvitation, () => setJustAccepted(true))}>
              {copy.valid.accept}
            </Button>
            <Button variant="secondary" onClick={() => act(declineInvitation)}>
              {copy.valid.decline}
            </Button>
          </div>
        </>
      )}

      {view === 'accepted' && invitation && (
        <>
          {justAccepted ? (
            <p className={styles.success} role="status">
              <span className={styles.successIcon} aria-hidden="true">
                {uiSymbols.success}
              </span>
              {copy.accepted.body}
            </p>
          ) : (
            <p className={styles.intro}>{copy.alreadyAccepted.body}</p>
          )}
          <InvitationDetails invitation={invitation} />
          <div className={styles.actions}>
            {session.account ? (
              <ButtonLink variant="primary" href={reviewTasksHref}>
                {copy.alreadyAccepted.goToReviewTasks}
              </ButtonLink>
            ) : (
              <ButtonLink variant="primary" href={accountSetupHref}>
                {justAccepted ? copy.accepted.continue : copy.alreadyAccepted.continueSetup}
              </ButtonLink>
            )}
          </div>
          <Reset preview={preview} onReset={() => act(resetOnboarding, () => setJustAccepted(false))} />
        </>
      )}

      {view === 'expired' && invitation && (
        <>
          <p className={styles.problem}>
            <span className={styles.problemIcon} aria-hidden="true">
              {uiSymbols.error}
            </span>
            {copy.expired.body(invitation.expires)}
          </p>
          <InvitationDetails invitation={invitation} />
          <RequestNew requested={session.requested && !preview} onRequest={() => act(requestNewInvitation)} />
        </>
      )}

      {view === 'declined' && (
        <>
          <p className={styles.intro}>{copy.declined.body}</p>
          <RequestNew requested={session.requested && !preview} onRequest={() => act(requestNewInvitation)} />
          <Reset preview={preview} onReset={() => act(resetOnboarding)} />
        </>
      )}

      {view === 'not-found' && (
        <>
          <p className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              {uiSymbols.empty}
            </span>
            {copy.notFound.body}
          </p>
          <RequestNew requested={session.requested && !preview} onRequest={() => act(requestNewInvitation)} />
        </>
      )}

      {saveFailed && view !== 'valid' && <SaveError />}
    </SetupFrame>
  );
}

function InvitationDetails({ invitation }: { invitation: Invitation }) {
  const role = adminRoles.find((item) => item.id === invitation.role);
  const rows: [string, string][] = [
    [copy.fields.workspace, invitation.workspace],
    [copy.fields.invitedPerson, invitation.invitedName],
    [copy.fields.invitedEmail, invitation.invitedEmail],
    [copy.fields.role, roleName(invitation)],
    [copy.fields.invitedBy, invitation.invitedBy],
    [copy.fields.expires, invitation.expires],
  ];
  return (
    <dl className={styles.details}>
      {rows.map(([label, value]) => (
        <div key={label} className={styles.detailRow}>
          <dt>{label}</dt>
          <dd>
            {value}
            {label === copy.fields.role && role && <span className={styles.roleSummary}>{role.summary}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function RequestNew({ requested, onRequest }: { requested: boolean; onRequest: () => void }) {
  if (requested) {
    return (
      <p className={styles.statusLine} role="status">
        {copy.request.done}
      </p>
    );
  }
  return (
    <div className={`${styles.actions} ${styles.jsOnly}`}>
      <Button variant="secondary" onClick={onRequest}>
        {copy.request.action}
      </Button>
    </div>
  );
}

function Reset({ preview, onReset }: { preview?: InvitationPreview; onReset: () => void }) {
  return (
    <div className={styles.reset}>
      <Button variant="ghost" onClick={() => !preview && onReset()} aria-describedby="onboarding-reset-help">
        {copy.reset}
      </Button>
      <p id="onboarding-reset-help" className={styles.muted}>
        {copy.resetHelp}
      </p>
    </div>
  );
}

function SaveError() {
  return (
    <p className={styles.problem} role="alert">
      <span className={styles.problemIcon} aria-hidden="true">
        {uiSymbols.error}
      </span>
      {copy.states.error}
    </p>
  );
}
