'use server';
import { Database } from '@/lib/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createSupabaseServerComponentClient = () =>
  createServerComponentClient<Database>(
    {
      cookies,
    },
    {
      options: {
        global: {
          fetch,
        },
      },
    }
  );
