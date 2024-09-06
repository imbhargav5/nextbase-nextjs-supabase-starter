import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';

export default async function Layout({ children }: { children: ReactNode }) {
  try {
    await getCachedLoggedInVerifiedSupabaseUser();
  } catch (error) {
    redirect('/login');
  }

  return <>{children}</>;
}
