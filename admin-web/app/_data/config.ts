/*
 * Phase A2: which data the app uses, chosen when the site is built.
 *
 * - "sample" (the DEFAULT, D9): the Week 10 / Week 11 / Phase A1 sample data and the
 *   browser-only review loop. The GitHub Pages build always uses this.
 * - "supabase": real sign-in and review data from the Cuidance Admin Web development
 *   project. Turned on only when NEXT_PUBLIC_ADMIN_DATA_MODE=supabase AND both public
 *   settings below are present (see admin-web/.env.example).
 *
 * The browser only ever gets the project URL and the public (anon / publishable) key.
 * Row Level Security in the database is the security boundary. A secret or
 * service-role key must never be used here: the app refuses to start Supabase mode
 * with one.
 */

export type DataMode = 'sample' | 'supabase';

// Written out in full so Next.js can put the values into the build
const requestedMode = process.env.NEXT_PUBLIC_ADMIN_DATA_MODE;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

// A secret key ("sb_secret_…") or a JWT whose role is service_role
export function looksLikeSecretKey(key: string): boolean {
  if (key.startsWith('sb_secret_')) return true;
  const parts = key.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.role === 'service_role';
  } catch {
    return false;
  }
}

if (requestedMode === 'supabase' && looksLikeSecretKey(supabaseKey)) {
  throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be the public (anon / publishable) key, never a secret key.');
}

export const dataMode: DataMode = requestedMode === 'supabase' && supabaseUrl && supabaseKey ? 'supabase' : 'sample';

export const isSupabaseMode = dataMode === 'supabase';

export const supabaseSettings = { url: supabaseUrl, publishableKey: supabaseKey };
