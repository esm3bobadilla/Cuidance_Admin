'use client';

import { useState, type FormEvent } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { forgotPasswordCopy as copy } from '../../../shared/content/sign-in';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { isValidEmail } from '../../../shared/onboarding/onboarding-rules';
import { TextInput } from '../../components/forms/TextInput';
import { Button, ButtonLink } from '../../components/ui/Button';
import { isSupabaseMode } from '../_data/config';
import { requestPasswordReset, type ResetResult } from '../_data/invitationsApi';
import { SetupFrame } from './SetupFrame';
import styles from './onboarding.module.css';

const signInHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens['sign-in'].path}`;

// Forgot Password (Phase 3): its own screen, with the same behavior the Sign In toggle had.
// Supabase mode (Phase A3): Supabase Auth emails a reset link. The answer is the same whether
// or not the email has an account. Sample mode: nothing is sent, and the message says so.
export function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [state, setState] = useState<'idle' | 'sending' | 'sample' | ResetResult>('idle');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'sending') return;
    const value = email.trim();
    const problem = !value ? copy.errors.emailMissing : !isValidEmail(value) ? copy.errors.emailInvalid : undefined;
    setError(problem);
    if (problem) return document.getElementById('forgot-email')?.focus();
    if (!isSupabaseMode) return setState('sample');
    setState('sending');
    setState(await requestPasswordReset(value));
  };

  const ok = state === 'sent' || state === 'sample';
  const message =
    state === 'sending'
      ? supabaseModeCopy.forgot.sending
      : state === 'sent'
        ? supabaseModeCopy.forgot.sent
        : state === 'sample'
          ? copy.sampleSent
          : state === 'too-soon'
            ? supabaseModeCopy.forgot.errors.tooSoon
            : state === 'failed'
              ? supabaseModeCopy.forgot.errors.failed
              : '';

  return (
    <SetupFrame variant="entry">
      <noscript>
        <style>{`.${styles.jsOnly} { display: none !important; }`}</style>
      </noscript>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.intro}>{copy.intro}</p>
      <form className={styles.form} onSubmit={submit} noValidate aria-busy={state === 'sending'}>
        <TextInput
          id="forgot-email"
          label={copy.email}
          type="email"
          inputMode="email"
          autoComplete="username"
          value={email}
          disabled={state === 'sending'}
          error={error}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(undefined);
          }}
        />
        <p className={ok || state === 'sending' || state === 'idle' ? styles.muted : styles.problem} role="status">
          {message && !ok && state !== 'sending' && (
            <span className={styles.problemIcon} aria-hidden="true">
              {uiSymbols.error}{' '}
            </span>
          )}
          {ok && <span aria-hidden="true">✓ </span>}
          {message}
        </p>
        <noscript>
          <p className={styles.muted}>{copy.noScript}</p>
        </noscript>
        <div className={styles.stackActions}>
          <span className={styles.jsOnly}>
            <Button variant="primary" type="submit" disabled={state === 'sending'}>
              {copy.submit}
            </Button>
          </span>
          <ButtonLink variant="secondary" href={signInHref}>
            {copy.back}
          </ButtonLink>
        </div>
      </form>
    </SetupFrame>
  );
}
