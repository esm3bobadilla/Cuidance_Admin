import { adminScreens } from '../../../shared/content/admin-web-screens';
import { createAccountCopy } from '../../../shared/content/sign-in';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { ButtonLink } from '../../components/ui/Button';
import { SetupFrame } from './SetupFrame';
import styles from './onboarding.module.css';

const signInHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens['sign-in'].path}`;

// Phase A2, Supabase mode only: Create Account, Accept Invitation and Account Setup are
// sample flows, and real invitations arrive in Phase 2.5 (Edge Functions). Until then
// these pages say so and point back to Sign In. Nothing is created or saved.
export function InvitationsUnavailable({ title, intro }: { title: string; intro?: string }) {
  return (
    <SetupFrame variant="entry">
      <h1 className={styles.title}>{title}</h1>
      {intro && <p className={styles.intro}>{intro}</p>}
      <p className={styles.empty} role="status">
        <span className={styles.emptyIcon} aria-hidden="true">
          {uiSymbols.empty}
        </span>
        {supabaseModeCopy.createAccount.unavailable}
      </p>
      <div className={styles.stackActions}>
        <ButtonLink variant="primary" href={signInHref}>
          {createAccountCopy.back}
        </ButtonLink>
      </div>
      <p className={styles.notice}>{supabaseModeCopy.entryNotice}</p>
    </SetupFrame>
  );
}
