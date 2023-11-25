import { DynamicLayoutProviders } from './DynamicLayoutProviders';
import { AppSupabaseClient } from '@/types';
import { createSupabaseServerComponentClient } from '@/supabase-clients/createSupabaseServerComponentClient';

// do not cache this layout
export const dynamic = 'force-dynamic';
export const fetchCache = 'only-no-store';
export const revalidate = 0;

async function fetchSession(supabaseClient: AppSupabaseClient) {
  // This is a server-side call, so it will not trigger a revalidation
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

export const metadata = {
  icons: {
    icon: '/images/logo-black-main.ico',
  },
  title: 'Nextbase Open source',
  description: 'Nextbase Open source',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseClient = createSupabaseServerComponentClient();
  const [session] = await Promise.all([fetchSession(supabaseClient)]);
  return (
    <DynamicLayoutProviders initialSession={session}>
      {children}
    </DynamicLayoutProviders>
  );
}
