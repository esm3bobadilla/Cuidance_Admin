'use client';

import { useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { profileCopy } from '../../../shared/content/profile';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { signOut } from '../../app/_data/authStore';
import { isSupabaseMode } from '../../app/_data/config';
import { CuIcon } from '../ui/CuIcon';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Sign out (Phase 3: also in the lower-left account area). One control for every place
// that offers it:
// - Supabase mode: ends the session, then goes to Sign In; a failure is announced.
// - Sample mode: nothing is signed in, so it simply opens the sample Sign In screen.
// `iconOnly` is the 92 px rail: the icon shows, the name stays for screen readers and the tooltip.
export function SignOutControl({ className, errorClassName, iconOnly = false }: { className?: string; errorClassName?: string; iconOnly?: boolean }) {
  const [state, setState] = useState<'idle' | 'busy' | 'failed'>('idle');
  const signInHref = `${base}${adminScreens['sign-in'].path}`;
  const label = state === 'busy' ? supabaseModeCopy.session.signingOut : isSupabaseMode ? supabaseModeCopy.session.signOut : profileCopy.signOut;
  const content = (
    <>
      <CuIcon name="logout" size={16} />
      <span className={iconOnly ? 'visually-hidden' : undefined}>{label}</span>
    </>
  );
  return (
    <>
      {isSupabaseMode ? (
        <button
          type="button"
          className={className}
          title={iconOnly ? label : undefined}
          disabled={state === 'busy'}
          onClick={async () => {
            setState('busy');
            if (await signOut()) window.location.assign(signInHref);
            else setState('failed');
          }}
        >
          {content}
        </button>
      ) : (
        <a className={className} href={signInHref} title={iconOnly ? label : undefined}>
          {content}
        </a>
      )}
      {state === 'failed' && (
        <span role="alert" className={errorClassName}>
          {supabaseModeCopy.session.signOutError}
        </span>
      )}
    </>
  );
}
