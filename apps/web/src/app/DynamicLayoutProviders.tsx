'use client';
import React, { Suspense } from 'react';

import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider, useTheme } from 'next-themes';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

function CustomerToaster() {
  const theme = useTheme();
  const currentTheme = theme.theme === 'light' ? 'light' : 'dark';
  return <SonnerToaster richColors theme={currentTheme} />;
}

/**
 * This is a wrapper for the app that provides the supabase client, the router event wrapper
 * the react-query client, supabase listener, and the navigation progress bar.
 *
 * The listener is used to listen for changes to the user's session and update the UI accordingly.
 */
export function DynamicLayoutProviders({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider enableSystem themes={['light', 'dark']} defaultTheme="light">
      {children}
      <Suspense>
        <ProgressBar
          height="4px"
          color="#0047ab"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <CustomerToaster />
      </Suspense>
    </ThemeProvider>
  );
}
