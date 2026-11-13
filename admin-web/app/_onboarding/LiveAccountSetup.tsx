'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { accountSetupCopy as copy } from '../../../shared/content/account-setup';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { meetsPasswordRequirements, passwordRequirements } from '../../../shared/onboarding/onboarding-rules';
import { TextInput } from '../../components/forms/TextInput';
import { Button, ButtonLink } from '../../components/ui/Button';
import { savePassword, takeLinkToken, verifyLinkToken, type PasswordResult } from '../_data/invitationsApi';
import { getSupabase } from '../_data/supabaseClient';
import { SetupFrame } from './SetupFrame';
import styles from './onboarding.module.css';

const live = supabaseModeCopy.setup;
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const reviewTasksHref = `${base}${adminScreens['review-tasks'].path}`;
const signInHref = `${base}${adminScreens['sign-in'].path}`;

type Errors = Partial<{ fullName: true; password: 'missing' | 'requirements' | 'weak' | 'same'; confirm: 'missing' | 'mismatch' }>;
type View = 'checking' | 'link-invalid' | 'signed-out' | 'form' | 'done';

/*
 * Phase A3, Supabase mode: Account Setup.
 * - After accepting an invitation (/account-setup/): choose a name and a password.
 * - From a password-reset email (/account-setup/?mode=reset): choose a new password.
 * The password follows the approved rules (12+ characters, a letter and a number), which
 * Supabase Auth also enforces. It's sent only to Supabase Auth and never kept on the page.
 */
export function LiveAccountSetup() {
  const [reset, setReset] = useState(false);
  const [view, setView] = useState<View>('checking');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      const isReset = new URL(window.location.href).searchParams.get('mode') === 'reset';
      setReset(isReset);
      const link = takeLinkToken();
      if (link && !(await verifyLinkToken(link))) return setView('link-invalid');
      const supabase = await getSupabase().catch(() => null);
      const user = supabase ? (await supabase.auth.getUser()).data.user : null;
      if (!user) return setView('signed-out');
      setEmail(user.email ?? '');
      setFullName(String(user.user_metadata?.full_name ?? ''));
      setView('form');
    })();
  }, []);

  // Focus moves to the heading once the password is saved, so the result is read out.
  // Not on first load: the page title and heading are already read out on arrival.
  useEffect(() => {
    if (view === 'done') requestAnimationFrame(() => headingRef.current?.focus());
  }, [view]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const found: Errors = {};
    if (!reset && !fullName.trim()) found.fullName = true;
    if (!password) found.password = 'missing';
    else if (!meetsPasswordRequirements(password)) found.password = 'requirements';
    if (!confirm) found.confirm = 'missing';
    else if (password && confirm !== password) found.confirm = 'mismatch';
    setErrors(found);
    setFailed(false);
    const first = (['fullName', 'password', 'confirm'] as const).find((key) => found[key]);
    if (first) return document.getElementById(`live-setup-${first}`)?.focus();

    setSaving(true);
    const result: PasswordResult = await savePassword(password, reset ? undefined : fullName.trim());
    setSaving(false);
    // The password never stays in the page's memory
    setPassword('');
    setConfirm('');
    if (result === 'saved') return setView('done');
    if (result === 'weak' || result === 'same') {
      setErrors({ password: result });
      return requestAnimationFrame(() => document.getElementById('live-setup-password')?.focus());
    }
    setFailed(true);
  };

  const title =
    view === 'checking'
      ? reset
        ? live.resetTitle
        : live.title
      : view === 'link-invalid'
        ? supabaseModeCopy.link.invalid.title
        : view === 'signed-out'
          ? live.signedOut.title
          : view === 'done'
            ? reset
              ? live.done.resetTitle
              : live.done.title
            : reset
              ? live.resetTitle
              : live.title;

  const passwordError =
    errors.password === 'missing'
      ? copy.errors.passwordMissing
      : errors.password === 'requirements' || errors.password === 'weak'
        ? live.errors.weak
        : errors.password === 'same'
          ? live.errors.same
          : undefined;

  return (
    <SetupFrame step={view === 'done' ? 2 : 1}>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
        {view === 'done' && (
          <span className={styles.titleIconSuccess} aria-hidden="true">
            {uiSymbols.success}{' '}
          </span>
        )}
        {title}
      </h1>

      {view === 'checking' && (
        <p className={styles.statusLine} role="status">
          <span aria-hidden="true">{uiSymbols.loading}</span> {supabaseModeCopy.link.checking}
        </p>
      )}

      {view === 'link-invalid' && (
        <>
          <p className={styles.problem} role="alert">
            <span className={styles.problemIcon} aria-hidden="true">
              {uiSymbols.error}
            </span>
            {reset ? supabaseModeCopy.link.invalid.resetBody : supabaseModeCopy.link.invalid.body}
          </p>
          <div className={styles.actions}>
            <ButtonLink variant="secondary" href={signInHref}>
              {supabaseModeCopy.link.signInNeeded.action}
            </ButtonLink>
          </div>
        </>
      )}

      {view === 'signed-out' && (
        <>
          <p className={styles.intro}>{live.signedOut.body}</p>
          <div className={styles.actions}>
            <ButtonLink variant="secondary" href={signInHref}>
              {supabaseModeCopy.link.signInNeeded.action}
            </ButtonLink>
          </div>
        </>
      )}

      {view === 'done' && (
        <>
          <p className={styles.success} role="status">
            <span className={styles.successIcon} aria-hidden="true">
              {uiSymbols.success}
            </span>
            {reset ? live.done.resetBody : live.done.body(fullName.trim())}
          </p>
          <div className={styles.actions}>
            <ButtonLink variant="primary" href={reviewTasksHref}>
              {live.done.action}
            </ButtonLink>
          </div>
        </>
      )}

      {view === 'form' && (
        <form className={styles.form} onSubmit={submit} noValidate aria-busy={saving}>
          <p className={styles.intro}>{reset ? live.resetIntro : live.intro}</p>
          {!reset && (
            <TextInput
              id="live-setup-fullName"
              label={copy.fields.fullName}
              autoComplete="name"
              value={fullName}
              disabled={saving}
              error={errors.fullName ? copy.errors.fullName : undefined}
              onChange={(event) => {
                setFullName(event.target.value);
                if (errors.fullName) setErrors((current) => ({ ...current, fullName: undefined }));
              }}
            />
          )}
          {/* The email comes from the invitation; it can't be changed here */}
          <TextInput id="live-setup-email" label={copy.fields.email} type="email" autoComplete="username" value={email} readOnly helper={reset ? undefined : live.emailHelper} />
          <div className={styles.passwordGroup}>
            <TextInput
              id="live-setup-password"
              label={copy.fields.password}
              type="password"
              autoComplete="new-password"
              value={password}
              disabled={saving}
              error={passwordError}
              aria-describedby={`${passwordError ? 'live-setup-password-error ' : ''}live-setup-requirements`}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
              }}
            />
            <div id="live-setup-requirements" className={styles.requirements}>
              <p className={styles.requirementsHeading}>{copy.requirements.heading}</p>
              <ul className={styles.requirementList}>
                {passwordRequirements.map((rule) => {
                  const met = rule.test(password);
                  return (
                    <li key={rule.id} className={met ? styles.requirementMet : undefined} data-met={met}>
                      <span className={styles.requirementIcon} aria-hidden="true">
                        {met ? uiSymbols.success : uiSymbols.default}
                      </span>
                      {rule.label}
                      <span className={styles.visuallyHidden}>, {met ? copy.requirements.met : copy.requirements.notMet}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <TextInput
            id="live-setup-confirm"
            label={copy.fields.confirm}
            type="password"
            autoComplete="new-password"
            value={confirm}
            disabled={saving}
            error={errors.confirm === 'missing' ? copy.errors.confirmMissing : errors.confirm === 'mismatch' ? copy.errors.confirmMismatch : undefined}
            onChange={(event) => {
              setConfirm(event.target.value);
              if (errors.confirm) setErrors((current) => ({ ...current, confirm: undefined }));
            }}
          />
          {saving && (
            <p className={styles.statusLine} role="status">
              <span aria-hidden="true">{uiSymbols.loading}</span> {live.saving}
            </p>
          )}
          {failed && (
            <p className={styles.problem} role="alert">
              <span className={styles.problemIcon} aria-hidden="true">
                {uiSymbols.error}
              </span>
              {live.errors.save}
            </p>
          )}
          <div className={styles.actions}>
            <Button variant="primary" type="submit" disabled={saving}>
              {reset ? live.saveReset : live.save}
            </Button>
          </div>
        </form>
      )}
    </SetupFrame>
  );
}
