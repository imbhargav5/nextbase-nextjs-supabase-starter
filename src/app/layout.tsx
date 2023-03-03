import 'server-only';
import './globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import createClient from '@/utils/supabase-server';
import AppProviders from './AppProviders';
import { errors } from '@/utils/errors';
import { AppSupabaseClient } from '@/types';
import { getIsAppInMaintenanceMode } from '@/utils/supabase-queries';

// do not cache this layout
export const revalidate = 0;

async function fetchSession(supabaseClient: AppSupabaseClient) {
  // This is a server-side call, so it will not trigger a revalidation
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    errors.add(error);
  }

  return session;
}

async function fetchIsAppInMaintenanceMode(supabaseClient: AppSupabaseClient) {
  try {
    const isAppInMaintenanceMode = await getIsAppInMaintenanceMode(
      supabaseClient
    );

    return isAppInMaintenanceMode;
  } catch (error) {
    if (error instanceof Error) {
      errors.add(error);
    } else {
      errors.add(new Error(error));
    }
    throw error;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const [session, isAppInMaintenanceMode] = await Promise.all([
    fetchSession(supabase),
    fetchIsAppInMaintenanceMode(supabase),
  ]);
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head></head>
      <body>
        <AppProviders
          initialSession={session}
          initialIsAppInMaintenanceMode={isAppInMaintenanceMode}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
