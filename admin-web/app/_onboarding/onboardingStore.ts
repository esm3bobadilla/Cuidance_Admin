'use client';

import { useSyncExternalStore } from 'react';
import {
  emptyOnboardingSession,
  parseOnboardingSession,
  type OnboardingSession,
} from '../../../shared/onboarding/onboarding-rules';

/*
 * Week 11 feature 2: the invitation answer and account setup for this browser tab.
 *
 * PROTOTYPE ONLY. Kept in session storage, so it survives moving between the two
 * screens and clears when the tab closes. Nothing leaves the browser.
 * The password is NEVER stored: only the invitation answer, the full name and the
 * work email are saved. Same pattern as the review store (_reviewLoop/reviewStore.ts).
 * It doesn't touch review decisions.
 */

export const onboardingSessionKey = 'cuidance-admin-onboarding';

const listeners = new Set<() => void>();
let session: OnboardingSession | null = null;

const readSaved = (): OnboardingSession => {
  try {
    const saved = sessionStorage.getItem(onboardingSessionKey);
    return saved ? parseOnboardingSession(JSON.parse(saved)) : emptyOnboardingSession;
  } catch {
    return emptyOnboardingSession;
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSession = () => (session ??= readSaved());
const getServerSession = () => emptyOnboardingSession;

// Saves first, so the screens only change when the save worked. Returns false if it didn't.
const save = (next: OnboardingSession): boolean => {
  try {
    if (!next.invitation && !next.account && !next.requested) sessionStorage.removeItem(onboardingSessionKey);
    else sessionStorage.setItem(onboardingSessionKey, JSON.stringify(next));
  } catch {
    return false;
  }
  session = next;
  listeners.forEach((listener) => listener());
  return true;
};

export const acceptInvitation = () => save({ ...getSession(), invitation: 'accepted' });
export const declineInvitation = () => save({ ...getSession(), invitation: 'declined', account: null });
export const requestNewInvitation = () => save({ ...getSession(), requested: true });

// Saves the name and email only. The password is deliberately not a parameter.
export const createAccount = (account: { fullName: string; email: string }) =>
  save({ ...getSession(), account: { fullName: account.fullName.trim(), email: account.email.trim() } });

// Reset sample data: clears the invitation and account setup in this tab
export const resetOnboarding = () => save(emptyOnboardingSession);

export function useOnboardingSession(): OnboardingSession {
  return useSyncExternalStore(subscribe, getSession, getServerSession);
}
