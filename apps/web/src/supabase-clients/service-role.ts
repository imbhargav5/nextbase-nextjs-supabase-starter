import 'server-only';

import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/database.types';

/**
 * Privileged Supabase client that bypasses RLS. SERVER-ONLY.
 * Used by the anonymous ingestion path and for minting signed Storage URLs.
 * Never import this into client components.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
