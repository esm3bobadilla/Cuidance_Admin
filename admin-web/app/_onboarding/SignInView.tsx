'use client';

import { useState, type FormEvent } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { entryCopy, signInCopy as copy } from '../../../shared/content/sign-in';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { validateSignIn, type SignInErrors } from '../../../shared/onboarding/onboarding-rules';
import { TextInput } from '../../components/forms/TextInput';
import { Button, ButtonLink } from '../../components/ui/Button';
import { SetupFrame } from './SetupFrame';
import styles from './onboarding.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const dashboardHref = `${base}${adminScreens.dashboard.path}`;
const createAccountHref = `${base}${adminScreens['create-account'].path}`;

// Review aid only (?state=): shows a state without doing anything
export type SignInPreview = 'loading' | 'submit-error';

// Sign In (Phase A1): the Admin Web landing and sign-in entry, from the Sign-in Entry reference.
// PROTOTYPE ONLY: sign-in isn't connected. A well-formed email and any password open the
// sample Dashboard; nothing is checked, saved or sent, and the password never leaves the field.
export function SignInView({ preview }: { preview?: SignInPreview }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignInErrors>({});
  const [forgotOpen, setForgotOpen] = useState(false);
  const loading = preview === 'loading';

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (preview) return;
    const found = validateSignIn(email, password);
    setErrors(found);
    if (found.email) return document.getElementById('sign-in-email')?.focus();
    if (found.password) return document.getElementById('sign-in-password')?.focus();
    setPassword('');
    window.location.assign(dashboardHref);
  };

  return (
    <SetupFrame variant="entry">
      <noscript>
        <style>{`.${styles.jsOnly} { display: none !important; }`}</style>
      </noscript>
      <h1 className={styles.title}>{copy.title}</h1>

      <form className={styles.form} onSubmit={submit} noValidate aria-busy={loading}>
        <TextInput
          id="sign-in-email"
          label={copy.email}
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder={copy.emailPlaceholder}
          value={email}
          disabled={loading}
          error={errors.email === 'missing' ? copy.errors.emailMissing : errors.email === 'invalid' ? copy.errors.emailInvalid : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
          }}
        />
        <div className={styles.passwordGroup}>
          <TextInput
            id="sign-in-password"
            label={copy.password}
            type="password"
            autoComplete="current-password"
            placeholder={copy.passwordPlaceholder}
            value={password}
            disabled={loading}
            error={errors.password ? copy.errors.passwordMissing : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
            }}
          />
          <div className={`${styles.forgot} ${styles.jsOnly}`}>
            <Button variant="ghost" aria-expanded={forgotOpen} aria-controls="sign-in-forgot" onClick={() => setForgotOpen(!forgotOpen)}>
              {copy.forgot}
            </Button>
          </div>
          <p id="sign-in-forgot" className={styles.muted} hidden={!forgotOpen} role="status">
            {copy.forgotHelp}
          </p>
        </div>

        {loading && (
          <p className={styles.statusLine} role="status">
            <span aria-hidden="true">{uiSymbols.loading}</span> {copy.signingIn}
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
        <noscript>
          <p className={styles.muted}>{copy.noScript}</p>
        </noscript>

        <div className={styles.stackActions}>
          <span className={styles.jsOnly}>
            <Button variant="primary" type="submit" disabled={loading}>
              {copy.submit}
            </Button>
          </span>
          <ButtonLink variant="secondary" href={createAccountHref}>
            {copy.createAccount}
          </ButtonLink>
        </div>
      </form>
      <p className={styles.muted}>{copy.help}</p>
      <p className={styles.notice}>{entryCopy.notice}</p>
    </SetupFrame>
  );
}
