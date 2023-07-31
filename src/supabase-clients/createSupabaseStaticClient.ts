import { Database } from '@/lib/database.types';
import { createClient } from '@supabase/supabase-js';

export const createSupabaseStaticClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        fetch,
      },
      auth: {
        persistSession: false,
      },
    }
  );
