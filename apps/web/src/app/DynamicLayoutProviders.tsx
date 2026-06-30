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

export function DynamicLayoutProviders({
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
