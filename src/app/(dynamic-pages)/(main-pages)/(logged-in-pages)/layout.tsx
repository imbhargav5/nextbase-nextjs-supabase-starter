import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerComponentClient } from '@/supabase-clients/createSupabaseServerComponentClient';

export default async function Layout({ children }: { children: ReactNode }) {
  const supabaseClient = createSupabaseServerComponentClient();
  const { data, error } = await supabaseClient.auth.getUser();

  if (!data.user) {
    // This is unreachable because the user is authenticated
    // But we need to check for it anyway for TypeScript.
    return redirect('/login');
  } else if (error) {
    return <p>Error: An error occurred.</p>;
  }

  return <>{children}</>;
}
