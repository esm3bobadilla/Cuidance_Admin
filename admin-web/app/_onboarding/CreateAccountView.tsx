'use client';

import { useRef, useState, type FormEvent } from 'react';
import { adminRoles } from '../../../shared/content/admin-roles';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { defaultInvitationId, invitationsSeed } from '../../../shared/content/invitation';
import { createAccountCopy as copy, entryCopy } from '../../../shared/content/sign-in';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { findInvitationByEmail, isValidEmail } from '../../../shared/onboarding/onboarding-rules';
import { TextInput } from '../../components/forms/TextInput';
import { Button, ButtonLink } from '../../components/ui/Button';
import { isSupabaseMode } from '../_data/config';
import { InvitationsUnavailable } from './InvitationsUnavailable';
import { SetupFrame } from './SetupFrame';
import styles from './onboarding.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const signInHref = `${base}${adminScreens['sign-in'].path}`;
const invitationHref = `${base}${adminScreens['accept-invitation'].path}`;
const invitation = invitationsSeed[defaultInvitationId];
const roleName = adminRoles.find((role) => role.id === invitation.role)?.name ?? invitation.role;

// Review aid only (?state=): shows a state without doing anything
export type CreateAccountPreview = 'loading' | 'found' | 'not-found' | 'submit-error';

// Create Account (Phase A1). Accounts are INVITATION ONLY (no public sign-ups): this screen
// looks for an invitation for the email and sends the person to Accept Invitation. It never
// creates an account by itself. PROTOTYPE ONLY: the sample invitation is for reviewer.b@example.com.
export function CreateAccountView({ preview }: { preview?: CreateAccountPreview }) {
  // Supabase mode (Phase A2): invitations aren't connected until Phase 2.5, so there's
  // nothing to look up. The page says so; it still never creates an account.
  if (isSupabaseMode) return <InvitationsUnavailable title={copy.title} intro={copy.intro} />;
  return <SampleCreateAccount preview={preview} />;
}

function SampleCreateAccount({ preview }: { preview?: CreateAccountPreview }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<'missing' | 'invalid' | undefined>();
  const [result, setResult] = useState<'found' | 'not-found' | undefined>();
  const resultRef = useRef<HTMLDivElement>(null);
  const shown = preview === 'found' || preview === 'not-found' ? preview : result;
  const loading = preview === 'loading';

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (preview) return;
    const problem = !email.trim() ? 'missing' : !isValidEmail(email) ? 'invalid' : undefined;
    setError(problem);
    if (problem) {
      setResult(undefined);
      document.getElementById('create-account-email')?.focus();
      return;
    }
    setResult(findInvitationByEmail(email, invitation) ? 'found' : 'not-found');
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  return (
    <SetupFrame variant="entry">
      <noscript>
        <style>{`.${styles.jsOnly} { display: none !important; }`}</style>
      </noscript>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.intro}>{copy.intro}</p>

      <form className={styles.form} onSubmit={submit} noValidate aria-busy={loading}>
        <TextInput
          id="create-account-email"
          label={copy.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          disabled={loading}
          error={error === 'missing' ? copy.errors.emailMissing : error === 'invalid' ? copy.errors.emailInvalid : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(undefined);
            setResult(undefined);
          }}
        />

        {loading && (
          <p className={styles.statusLine} role="status">
            <span aria-hidden="true">{uiSymbols.loading}</span> {copy.searching}
          </p>
        )}
        {preview === 'submit-error' && (
          <p className={styles.problem} role="alert">
            <span className={styles.problemIcon} aria-hidden="true">
              {uiSymbols.error}
            </span>
            {copy.errors.submit}
          </p>
        )}

        <div ref={resultRef} tabIndex={-1} className={styles.result} role="status">
          {shown === 'found' && (
            <div className={styles.success}>
              <span className={styles.successIcon} aria-hidden="true">
                {uiSymbols.success}
              </span>
              <span>
                <strong>{copy.found.title}.</strong> {copy.found.body(invitation.workspace, roleName)}
              </span>
            </div>
          )}
          {shown === 'not-found' && (
            <p className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">
                {uiSymbols.empty}
              </span>
              {copy.notFound}
            </p>
          )}
        </div>
        <noscript>
          <p className={styles.muted}>{copy.noScript}</p>
        </noscript>

        <div className={styles.stackActions}>
          {shown === 'found' ? (
            <ButtonLink variant="primary" href={invitationHref}>
              {copy.found.action}
            </ButtonLink>
          ) : (
            <span className={styles.jsOnly}>
              <Button variant="primary" type="submit" disabled={loading}>
                {copy.submit}
              </Button>
            </span>
          )}
          <ButtonLink variant="secondary" href={signInHref}>
            {copy.back}
          </ButtonLink>
        </div>
      </form>
      <p className={styles.notice}>{entryCopy.notice}</p>
    </SetupFrame>
  );
}
