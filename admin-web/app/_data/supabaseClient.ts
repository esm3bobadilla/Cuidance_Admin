'use client';

import type { SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseMode, supabaseSettings } from './config';

/*
 * Phase A2: the one Supabase client for the browser (Supabase mode only).
 *
 * Loaded on demand, so sample-mode pages never download @supabase/supabase-js.
 * The session is kept by Supabase Auth in this browser's local storage and refreshed
 * automatically. Only the public key is used; Row Level Security does the rest.
 */

let client: Promise<SupabaseClient> | null = null;

export function getSupabase(): Promise<SupabaseClient> {
  if (!isSupabaseMode) return Promise.reject(new Error('Supabase mode is off.'));
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(supabaseSettings.url, supabaseSettings.publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Admin Web signs in with email and password; it never reads tokens from the address
        detectSessionInUrl: false,
        storageKey: 'cuidance-admin-auth',
      },
    }),
  );
  return client;
}
