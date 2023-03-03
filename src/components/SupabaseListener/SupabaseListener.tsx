'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import supabase from '@/utils/supabase-browser';

/**
 * This component listens for changes to the user's session and refreshes the page when it changes.
 * This is used to update the UI when the user logs in or out for security reasons.
 */
export function SupabaseListener({ accessToken }: { accessToken?: string }) {
  const router = useRouter();

  // BUG - https://github.com/supabase/auth-ui/issues/44
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (accessToken && !session?.access_token) {
          router.push('/login');
        } else if (session?.access_token && !accessToken) {
          router.push('/dashboard');
        } else if (session?.access_token !== accessToken) {
          router.refresh();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [accessToken]);

  return null;
}
