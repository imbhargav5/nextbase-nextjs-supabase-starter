'use client';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import RouterProgressionContext from '@/contexts/RouterProgressionContext';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import NavigationProgressBar from './NavigationProgressBar';
import {
  SessionContextProvider,
  SessionContextProviderProps,
} from '@supabase/auth-helpers-react';
import supabaseClient from '@/utils/supabase-browser';
import { SupabaseListener } from '@/components/SupabaseListener';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import ReactNoSSR from 'react-no-ssr';
import { MaintenanceModeContextProvider } from '@/contexts/MaintenanceModeContext';

/**
 ** Inspiration from here
 ** The original Router component from Next.js no longer has router events.
 ** More discussion here
 @link https://github.com/vercel/next.js/discussions/41745#discussioncomment-3986452
 @link https://github.com/vercel/next.js/discussions/41745#discussioncomment-4202641
 @link https://github.com/joulev/nextjs13-router-events/blob/main/app/Anchor.client.tsx
*/
function RouterEventWrapper({ children }: { children: ReactNode }) {
  const onStart = useCallback(() => NProgress.start(), []);
  const onComplete = useCallback(() => NProgress.done(), []);
  const [isChanging, setIsChanging] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onCompleteFresh = useRef(onComplete);
  const onStartFresh = useRef(onStart);
  useEffect(() => setIsChanging(false), [pathname, searchParams]);

  useEffect(() => {
    if (isChanging) onStartFresh.current();
    else onCompleteFresh.current();
  }, [isChanging]);

  return (
    <RouterProgressionContext.Provider value={() => setIsChanging(true)}>
      {children}
    </RouterProgressionContext.Provider>
  );
}

// Create a client
const queryClient = new QueryClient();

/**
 * This is a wrapper for the app that provides the supabase client, the router event wrapper
 * the react-query client, supabase listener, and the navigation progress bar.
 *
 * The listener is used to listen for changes to the user's session and update the UI accordingly.
 */
export default function AppProviders({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  initialSession,
  initialIsAppInMaintenanceMode,
}: {
  children: React.ReactNode;
  initialSession: Pick<
    SessionContextProviderProps,
    'initialSession'
  >['initialSession'];
  initialIsAppInMaintenanceMode: boolean;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={initialSession}
      >
        <RouterEventWrapper>
          <NavigationProgressBar />
          <SupabaseListener accessToken={initialSession?.access_token} />
          <MaintenanceModeContextProvider
            initialIsAppInMaintenanceMode={initialIsAppInMaintenanceMode}
          >
            {children}
          </MaintenanceModeContextProvider>
          <ReactNoSSR>
            <Toaster />
          </ReactNoSSR>
        </RouterEventWrapper>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
