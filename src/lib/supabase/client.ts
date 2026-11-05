import { createClient, SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = 'https://pxbmhjqfxfjgjtcuqlbr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_mWOtgggvIUu8bjZR71kfCQ_8ddUIF5L';

/** Supabase Auth is enabled when configured. Courses are stored locally in the browser. */
export function isSupabaseConfigured(): boolean {
  if (process.env.NEXT_PUBLIC_SUPABASE_AUTH_ENABLED === 'false') return false;

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL)?.trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY)?.trim();
  if (!url || !anonKey || anonKey === 'your-anon-public-key') return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.hostname === 'localhost';
  } catch {
    return false;
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL)?.trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY)?.trim();
  if (!url || !anonKey) return null;

  if (!clientInstance) {
    clientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return clientInstance;
}
