import { ReactNode } from 'react';
import { ClientLayout } from './ClientLayout';
import createClient from '@/utils/supabase-server';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data?.user) {
    return redirect('/login');
  } else if (error) {
    return <p>{String(error.message)}</p>;
  }
  return <ClientLayout>{children}</ClientLayout>;
}
