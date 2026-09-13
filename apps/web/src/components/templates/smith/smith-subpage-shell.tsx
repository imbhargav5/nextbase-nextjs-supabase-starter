import { type ReactNode } from 'react';

import { FramePreviewScrollRelease } from '@/components/templates/frame-preview-scroll-release';
import { SmithContact } from '@/components/templates/smith/smith-contact';
import { SmithHeader } from '@/components/templates/smith/smith-header';
import { SmithThemeProvider } from '@/components/templates/smith/smith-theme-provider';

interface SmithSubpageShellProps {
  children: ReactNode;
}

export function SmithSubpageShell({ children }: SmithSubpageShellProps) {
  return (
    <SmithThemeProvider>
      <FramePreviewScrollRelease />
      <SmithHeader />
      <div className="bg-[hsl(var(--smith-bg))]">{children}</div>
      <SmithContact />
    </SmithThemeProvider>
  );
}
