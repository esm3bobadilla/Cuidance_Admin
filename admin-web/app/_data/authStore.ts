'use client';

import { useSyncExternalStore } from 'react';
import { isSupabaseMode } from './config';
import { getSupabase } from './supabaseClient';

/*
 * Phase A2: who is signed in, and their workspace role (Supabase mode only).
 *
 * Same pattern as the other stores: the built page shows the server snapshot
 * ("checking" in Supabase mode, "sample" in sample mode), then the browser reads the
 * Supabase session after the page loads, so there are no hydration warnings.
 *
 * The role shown here only decides what the screens offer. The database enforces
 * every rule again (RLS and triggers), so changing it in the browser changes nothing.
 */

export type Membership = { workspaceId: string; workspaceName: string; role: string };

export type AuthState =
  | { status: 'sample' }
  | { status: 'checking' }
  | { status: 'signed-out' }
  | { status: 'error' }
  | { status: 'signed-in'; userId: string; email: string; name: string; membership: Membership | null };

export type SignInResult = { ok: true } | { ok: false; reason: 'invalid' | 'unavailable' };

const initial: AuthState = isSupabaseMode ? { status: 'checking' } : { status: 'sample' };
const listeners = new Set<() => void>();
let state: AuthState = initial;
let started = false;

const set = (next: AuthState) => {
  state = next;
  listeners.forEach((listener) => listener());
};

async function load() {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const user = data.session?.user;
    if (!user) return set({ status: 'signed-out' });

    const [profile, member] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
      supabase
        .from('workspace_members')
        .select('workspace_id, role, workspaces(name)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('joined_at')
        .limit(1)
        .maybeSingle(),
    ]);
    if (profile.error || member.error) throw profile.error ?? member.error;

    const row = member.data as { workspace_id: string; role: string; workspaces: { name: string } | null } | null;
    set({
      status: 'signed-in',
      userId: user.id,
      email: user.email ?? '',
      name: profile.data?.full_name?.trim() || user.email || '',
      membership: row ? { workspaceId: row.workspace_id, workspaceName: row.workspaces?.name ?? '', role: row.role } : null,
    });
  } catch {
    set({ status: 'error' });
  }
}

function start() {
  if (started || !isSupabaseMode) return;
  started = true;
  void load();
  void getSupabase().then((supabase) =>
    supabase.auth.onAuthStateChange((event) => {
      // Reading data inside this callback can stall Supabase Auth, so it waits a moment
      if (event === 'SIGNED_OUT') set({ status: 'signed-out' });
      else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') setTimeout(() => void load(), 0);
    }),
  );
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  start();
  return () => listeners.delete(listener);
};

export function useAuth(): AuthState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (!error) {
      await load();
      return { ok: true };
    }
    // 400 means the details were wrong; anything else is the service or the network
    return { ok: false, reason: error.status === 400 ? 'invalid' : 'unavailable' };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

export async function signOut(): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) return false;
    set({ status: 'signed-out' });
    return true;
  } catch {
    return false;
  }
}

// The signed-in user's id and role, or nulls (used to decide what the screens offer)
export const whoAmI = (auth: AuthState) =>
  auth.status === 'signed-in'
    ? { userId: auth.userId, name: auth.name, role: auth.membership?.role ?? null }
    : { userId: null, name: null, role: null };
