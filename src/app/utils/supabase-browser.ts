// https://supabase.com/docs/guides/auth/auth-helpers/nextjs-server-components#creating-a-supabase-client
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export default createBrowserSupabaseClient<Database>();
