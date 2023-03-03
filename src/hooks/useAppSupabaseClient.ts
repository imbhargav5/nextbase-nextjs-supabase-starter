// eslint-disable-next-line no-restricted-imports
import { Database } from '@/lib/database.types';
import { AppSupabaseClient } from '@/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

/**
 * The original useSupabaseClient hook from @supabase/auth-helpers-react
 * is not typed. This hook adds the database types to the Supabase client.
 * @returns The Supabase client with the database types
 */
export const useBrandmagicSupabaseClient = (): AppSupabaseClient => {
  return useSupabaseClient<Database>();
};
