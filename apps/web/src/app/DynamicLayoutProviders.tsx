'use client';
import React, { Suspense } from 'react';

import { ThemeProvider } from 'next-themes';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Toaster } from '@/components/ui/sonner';

export function DynamicLayoutProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem
      themes={['light', 'dark']}
      defaultTheme="light"
      disableTransitionOnChange
    >
      {children}
      <Suspense>
        <ProgressBar
          height="3px"
          color="var(--primary)"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <Toaster richColors closeButton />
      </Suspense>
    </ThemeProvider>
  );
}
