'use client';

import { useRef, useState, type FormEvent } from 'react';
import { accountSetupCopy as copy } from '../../../shared/content/account-setup';
import { adminRoles } from '../../../shared/content/admin-roles';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { defaultInvitationId, invitationsSeed, prototypeNotice } from '../../../shared/content/invitation';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import {
  passwordRequirements,
  setupFieldOrder,
  setupView,
  validateSetup,
  type SetupErrors,
  type SetupFields,
} from '../../../shared/onboarding/onboarding-rules';
import { TextInput } from '../../components/forms/TextInput';
import { Button, ButtonLink } from '../../components/ui/Button';
import { createAccount, resetOnboarding, useOnboardingSession } from './onboardingStore';
import { isSupabaseMode } from '../_data/config';
import { LiveAccountSetup } from './LiveAccountSetup';
import { SetupFrame } from './SetupFrame';
import styles from './onboarding.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const invitationHref = `${base}${adminScreens['accept-invitation'].path}`;
const reviewTasksHref = `${base}${adminScreens['review-tasks'].path}`;

// Review aid only (?state=): shows a state without saving anything
export type SetupPreview = 'loading' | 'missing' | 'submit-error' | 'success';

const invitation = invitationsSeed[defaultInvitationId];
const role = adminRoles.find((item) => item.id === invitation.role)!;
const fieldIds: Record<keyof SetupFields, string> = {
  fullName: 'setup-full-name',
  email: 'setup-email',
  password: 'setup-password',
  confirm: 'setup-confirm',
};

// Account Setup (Week 11 feature 2). PROTOTYPE ONLY: no account is created, and the
// password is checked on screen and never saved or sent.
export function AccountSetupView({ preview }: { preview?: SetupPreview }) {
  // Phase A2: real invitations arrive in Phase 2.5, so Supabase mode doesn't show the sample flow
  // Phase A3: Supabase mode sets the password (first setup or reset) through Supabase Auth
  if (isSupabaseMode) return <LiveAccountSetup />;
  return <SampleAccountSetup preview={preview} />;
}

function SampleAccountSetup({ preview }: { preview?: SetupPreview }) {
  const session = useOnboardingSession();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [fields, setFields] = useState<SetupFields>({ fullName: '', email: invitation.invitedEmail, password: '', confirm: '' });
  const [errors, setErrors] = useState<SetupErrors>({});
  const [submitFailed, setSubmitFailed] = useState(false);

  const view = preview === 'success' ? 'created' : preview === 'missing' ? 'missing' : preview ? 'form' : setupView(session);
  const createdName = preview === 'success' ? invitation.invitedName : session.account?.fullName ?? '';

  const set = (key: keyof SetupFields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (preview) return;
    const found = validateSetup(fields, invitation);
    setErrors(found);
    const first = setupFieldOrder.find((key) => found[key]);
    if (first) {
      document.getElementById(fieldIds[first])?.focus();
      return;
    }
    const saved = createAccount({ fullName: fields.fullName, email: fields.email });
    setSubmitFailed(!saved);
    if (saved) {
      // The password is never kept: clear it from the screen's memory too
      setFields((current) => ({ ...current, password: '', confirm: '' }));
      requestAnimationFrame(() => headingRef.current?.focus());
    }
  };

  const errorText = {
    fullName: errors.fullName && copy.errors.fullName,
    email:
      errors.email === 'missing'
        ? copy.errors.emailMissing
        : errors.email === 'invalid'
          ? copy.errors.emailInvalid
          : errors.email === 'mismatch'
            ? copy.errors.emailMismatch(invitation.invitedEmail)
            : undefined,
    password: errors.password === 'missing' ? copy.errors.passwordMissing : errors.password === 'requirements' ? copy.errors.passwordRequirements : undefined,
    confirm: errors.confirm === 'missing' ? copy.errors.confirmMissing : errors.confirm === 'mismatch' ? copy.errors.confirmMismatch : undefined,
  };

  return (
    <SetupFrame step={view === 'created' ? 2 : 1}>
      <noscript>
        <style>{`.${styles.jsOnly} { display: none !important; }`}</style>
      </noscript>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
        {view === 'created' && (
          <span className={styles.titleIconSuccess} aria-hidden="true">
            {uiSymbols.success}{' '}
          </span>
        )}
        {view === 'created' ? copy.success.title : view === 'missing' ? copy.missing.title : copy.title}
      </h1>

      {preview === 'loading' ? (
        <p className={styles.statusLine} role="status">
          <span aria-hidden="true">{uiSymbols.loading}</span> {copy.states.loading}
        </p>
      ) : view === 'missing' ? (
        <>
          <p className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              {uiSymbols.empty}
            </span>
            {copy.missing.body}
          </p>
          <div className={styles.actions}>
            <ButtonLink variant="primary" href={invitationHref}>
              {copy.missing.action}
            </ButtonLink>
          </div>
        </>
      ) : view === 'created' ? (
        <>
          <p className={styles.success} role="status">
            <span className={styles.successIcon} aria-hidden="true">
              {uiSymbols.success}
            </span>
            {copy.success.body(createdName, role.name, invitation.workspace)}
          </p>
          <p className={styles.notice}>{copy.success.note}</p>
          <div className={styles.actions}>
            <ButtonLink variant="primary" href={reviewTasksHref}>
              {copy.success.goToReviewTasks}
            </ButtonLink>
          </div>
          <div className={`${styles.reset} ${styles.jsOnly}`}>
            <Button variant="ghost" onClick={() => !preview && resetOnboarding()} aria-describedby="onboarding-reset-help">
              {copy.reset}
            </Button>
            <p id="onboarding-reset-help" className={styles.muted}>
              {copy.resetHelp}
            </p>
          </div>
        </>
      ) : (
        <>
          <p className={styles.intro}>{copy.intro}</p>
          <section className={styles.summary} aria-labelledby="setup-summary-heading">
            <h2 id="setup-summary-heading" className={styles.label}>
              {copy.summary.heading}
            </h2>
            <dl className={styles.summaryList}>
              <div>
                <dt>{copy.summary.workspace}</dt>
                <dd>{invitation.workspace}</dd>
              </div>
              <div>
                <dt>{copy.summary.role}</dt>
                <dd>
                  {role.name}
                  <span className={styles.roleSummary}>{role.summary}</span>
                </dd>
              </div>
              <div>
                <dt>{copy.summary.invitedBy}</dt>
                <dd>{invitation.invitedBy}</dd>
              </div>
            </dl>
          </section>

          <form className={styles.form} onSubmit={submit} noValidate>
            <TextInput
              id={fieldIds.fullName}
              label={copy.fields.fullName}
              autoComplete="name"
              value={fields.fullName}
              error={errorText.fullName}
              onChange={(event) => set('fullName')(event.target.value)}
            />
            <TextInput
              id={fieldIds.email}
              label={copy.fields.email}
              type="email"
              inputMode="email"
              autoComplete="email"
              helper={copy.fields.emailHelper}
              value={fields.email}
              error={errorText.email}
              onChange={(event) => set('email')(event.target.value)}
            />
            <div className={styles.passwordGroup}>
              <TextInput
                id={fieldIds.password}
                label={copy.fields.password}
                type="password"
                autoComplete="new-password"
                value={fields.password}
                error={errorText.password}
                aria-describedby={`${errorText.password ? `${fieldIds.password}-error ` : ''}setup-requirements`}
                onChange={(event) => set('password')(event.target.value)}
              />
              <div id="setup-requirements" className={styles.requirements}>
                <p className={styles.requirementsHeading}>{copy.requirements.heading}</p>
                <ul className={styles.requirementList}>
                  {passwordRequirements.map((rule) => {
                    const met = rule.test(fields.password);
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
              id={fieldIds.confirm}
              label={copy.fields.confirm}
              type="password"
              autoComplete="new-password"
              value={fields.confirm}
              error={errorText.confirm}
              onChange={(event) => set('confirm')(event.target.value)}
            />

            <p className={styles.notice}>{prototypeNotice}</p>
            {(submitFailed || preview === 'submit-error') && (
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
            <div className={styles.actions}>
              <span className={styles.jsOnly}>
                <Button variant="primary" type="submit">
                  {copy.create}
                </Button>
              </span>
              <ButtonLink variant="secondary" href={invitationHref}>
                {copy.back}
              </ButtonLink>
            </div>
          </form>
        </>
      )}
    </SetupFrame>
  );
}
