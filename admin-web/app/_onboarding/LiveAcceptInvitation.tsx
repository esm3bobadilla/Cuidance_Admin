'use client';

import { useEffect, useRef, useState } from 'react';
import { adminRoles } from '../../../shared/content/admin-roles';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { invitationCopy as copy } from '../../../shared/content/invitation';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { formatDecisionDate } from '../../../shared/review-loop/review-decisions';
import { isTaskId as isUuid, unnamedLabel } from '../../../shared/review-loop/supabase-mapping';
import { Button, ButtonLink } from '../../components/ui/Button';
import { callInvitations, takeLinkToken, verifyLinkToken, type InvitationSummary } from '../_data/invitationsApi';
import { getSupabase } from '../_data/supabaseClient';
import { SetupFrame } from './SetupFrame';
import styles from './onboarding.module.css';

const live = supabaseModeCopy.invitation;
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const href = (id: keyof typeof adminScreens, query = '') => `${base}${adminScreens[id].path}${query}`;

type View =
  | { kind: 'checking' }
  | { kind: 'link-invalid' }
  | { kind: 'sign-in-needed'; invitationId: string | null }
  | { kind: 'not-found' }
  | { kind: 'error' }
  | { kind: 'invitation'; invitation: InvitationSummary; needsSetup: boolean; justAnswered?: 'accepted' | 'declined' };

/*
 * Phase A3, Supabase mode: Accept Invitation (/accept-invitation/?invitation=<id>).
 *
 * 1. The email link's single-use token is read once and removed from the address.
 * 2. Supabase Auth checks it, which signs the invited person in.
 * 3. The invitations Edge Function shows the invitation only to the person it was
 *    sent to, then records Accept or Decline (single use).
 * New accounts continue to Account Setup to choose a name and password.
 */
export function LiveAcceptInvitation() {
  const [view, setView] = useState<View>({ kind: 'checking' });
  const [busy, setBusy] = useState<'accepting' | 'declining' | null>(null);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      const invitationId = new URL(window.location.href).searchParams.get('invitation');
      const link = takeLinkToken();
      if (link && !(await verifyLinkToken(link))) return setView({ kind: 'link-invalid' });

      const supabase = await getSupabase().catch(() => null);
      const user = supabase ? (await supabase.auth.getUser()).data.user : null;
      if (!user) return setView({ kind: 'sign-in-needed', invitationId });
      if (!isUuid(invitationId)) return setView({ kind: 'not-found' });

      const result = await callInvitations({ action: 'get', invitationId });
      if (!result.ok) return setView(result.error === 'not-found' ? { kind: 'not-found' } : { kind: 'error' });
      // New accounts (invited, password not chosen yet) go on to Account Setup
      const needsSetup = link?.type === 'invite' || (!!user.invited_at && !user.user_metadata?.account_ready);
      setView({ kind: 'invitation', invitation: result.data.invitation, needsSetup });
    })();
  }, []);

  // Focus moves to the heading only after the person answers (see answer()), not when the
  // page first loads: the page title and heading are already read out on arrival.

  const answer = async (action: 'accept' | 'decline') => {
    if (view.kind !== 'invitation' || busy) return;
    setBusy(action === 'accept' ? 'accepting' : 'declining');
    setAnswerError(null);
    const result = await callInvitations({ action, invitationId: view.invitation.id });
    setBusy(null);
    if (result.ok) {
      setView({ ...view, invitation: { ...view.invitation, state: result.data.invitation.state }, justAnswered: action === 'accept' ? 'accepted' : 'declined' });
      requestAnimationFrame(() => headingRef.current?.focus());
      return;
    }
    if (result.error === 'not-pending' || result.error === 'expired') {
      setView({ ...view, invitation: { ...view.invitation, state: result.error === 'expired' ? 'expired' : result.state ?? 'revoked' } });
      setAnswerError(live.errors.changed);
    } else setAnswerError(live.errors.answer);
  };

  const invitation = view.kind === 'invitation' ? view.invitation : null;
  const state = invitation?.state;
  const title =
    view.kind === 'checking'
      ? copy.valid.title
      : view.kind === 'link-invalid'
        ? supabaseModeCopy.link.invalid.title
        : view.kind === 'sign-in-needed'
          ? supabaseModeCopy.link.signInNeeded.title
          : view.kind === 'not-found'
            ? copy.notFound.title
            : view.kind === 'error'
              ? copy.valid.title
              : state === 'pending'
                ? copy.valid.title
                : state === 'accepted'
                  ? view.justAnswered
                    ? copy.accepted.title
                    : copy.alreadyAccepted.title
                  : state === 'expired'
                    ? copy.expired.title
                    : state === 'declined'
                      ? copy.declined.title
                      : live.revoked.title;

  return (
    <SetupFrame step={state === 'accepted' ? 1 : 0}>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
        {state === 'accepted' && view.kind === 'invitation' && view.justAnswered && (
          <span className={styles.titleIconSuccess} aria-hidden="true">
            {uiSymbols.success}{' '}
          </span>
        )}
        {title}
      </h1>

      {view.kind === 'checking' && (
        <p className={styles.statusLine} role="status">
          <span aria-hidden="true">{uiSymbols.loading}</span> {supabaseModeCopy.link.checking}
        </p>
      )}

      {view.kind === 'link-invalid' && (
        <p className={styles.problem} role="alert">
          <span className={styles.problemIcon} aria-hidden="true">
            {uiSymbols.error}
          </span>
          {supabaseModeCopy.link.invalid.body}
        </p>
      )}

      {view.kind === 'sign-in-needed' && (
        <>
          <p className={styles.intro}>{supabaseModeCopy.link.signInNeeded.body}</p>
          <div className={styles.actions}>
            <ButtonLink
              variant="primary"
              href={href('sign-in', `?next=${encodeURIComponent(`${href('accept-invitation')}${view.invitationId ? `?invitation=${encodeURIComponent(view.invitationId)}` : ''}`)}`)}
            >
              {supabaseModeCopy.link.signInNeeded.action}
            </ButtonLink>
          </div>
        </>
      )}

      {view.kind === 'not-found' && (
        <p className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            {uiSymbols.empty}
          </span>
          {copy.notFound.body}
        </p>
      )}

      {view.kind === 'error' && (
        <p className={styles.problem} role="alert">
          <span className={styles.problemIcon} aria-hidden="true">
            {uiSymbols.error}
          </span>
          {live.errors.answer}
        </p>
      )}

      {invitation && view.kind === 'invitation' && (
        <>
          {state === 'pending' && <p className={styles.intro}>{copy.valid.intro}</p>}
          {state === 'accepted' &&
            (view.justAnswered ? (
              <p className={styles.success} role="status">
                <span className={styles.successIcon} aria-hidden="true">
                  {uiSymbols.success}
                </span>
                {view.needsSetup ? live.accepted.setupBody : live.accepted.memberBody}
              </p>
            ) : (
              <p className={styles.intro}>{copy.alreadyAccepted.body}</p>
            ))}
          {state === 'expired' && (
            <p className={styles.problem}>
              <span className={styles.problemIcon} aria-hidden="true">
                {uiSymbols.error}
              </span>
              {copy.expired.body(formatDecisionDate(new Date(invitation.expiresAt)))}
            </p>
          )}
          {state === 'declined' && <p className={styles.intro}>{copy.declined.body}</p>}
          {state === 'revoked' && <p className={styles.intro}>{live.revoked.body}</p>}

          {(state === 'pending' || state === 'accepted' || state === 'expired') && <LiveDetails invitation={invitation} />}

          {answerError && (
            <p className={styles.problem} role="alert">
              <span className={styles.problemIcon} aria-hidden="true">
                {uiSymbols.error}
              </span>
              {answerError}
            </p>
          )}
          {busy && (
            <p className={styles.statusLine} role="status">
              <span aria-hidden="true">{uiSymbols.loading}</span> {busy === 'accepting' ? live.accepting : live.declining}
            </p>
          )}

          {state === 'pending' && (
            <div className={styles.actions}>
              <Button variant="primary" disabled={!!busy} onClick={() => void answer('accept')}>
                {copy.valid.accept}
              </Button>
              <Button variant="secondary" disabled={!!busy} onClick={() => void answer('decline')}>
                {copy.valid.decline}
              </Button>
            </div>
          )}
          {state === 'accepted' && (
            <div className={styles.actions}>
              {view.needsSetup ? (
                <ButtonLink variant="primary" href={href('account-setup')}>
                  {view.justAnswered ? copy.accepted.continue : copy.alreadyAccepted.continueSetup}
                </ButtonLink>
              ) : (
                <ButtonLink variant="primary" href={href('review-tasks')}>
                  {copy.alreadyAccepted.goToReviewTasks}
                </ButtonLink>
              )}
            </div>
          )}
        </>
      )}
    </SetupFrame>
  );
}

function LiveDetails({ invitation }: { invitation: InvitationSummary }) {
  const role = adminRoles.find((item) => item.id === invitation.role.replace('_', '-'));
  const rows: [string, string][] = [
    [copy.fields.workspace, invitation.workspaceName ?? ''],
    [copy.fields.invitedEmail, invitation.email],
    [copy.fields.role, role?.name ?? invitation.role],
    [copy.fields.invitedBy, invitation.invitedBy || unnamedLabel],
    [copy.fields.expires, formatDecisionDate(new Date(invitation.expiresAt))],
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
