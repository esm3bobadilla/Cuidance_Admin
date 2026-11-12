'use client';

import { profileCopy } from '../../../shared/content/profile';
import { supabaseModeCopy as copy } from '../../../shared/content/supabase-mode';
import { initialsOf, unnamedLabel } from '../../../shared/review-loop/supabase-mapping';
import { useAuth } from './authStore';

export type Identity = { initials: string; name: string; role: string; status: string };

const sampleIdentity: Identity = {
  initials: profileCopy.initials,
  name: profileCopy.name,
  role: profileCopy.role,
  status: profileCopy.status,
};

// Phase A2: who the Profile card and panel show. Sample mode: the Phase A1 sample identity.
// Supabase mode: the signed-in member's name, role and workspace.
export function useIdentity(): Identity {
  const auth = useAuth();
  if (auth.status === 'sample') return sampleIdentity;
  if (auth.status !== 'signed-in') {
    return { initials: initialsOf(unnamedLabel), name: unnamedLabel, role: '', status: copy.session.checking };
  }
  const role = auth.membership ? copy.profile.roleLabels[auth.membership.role] ?? auth.membership.role : '';
  return {
    initials: initialsOf(auth.name || auth.email),
    name: auth.name || auth.email,
    role,
    status: auth.membership ? copy.profile.status(auth.membership.workspaceName) : copy.session.noAccess.title,
  };
}
