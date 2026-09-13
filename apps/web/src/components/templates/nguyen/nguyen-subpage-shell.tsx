import { type ReactNode } from 'react';

import { FramePreviewScrollRelease } from '@/components/templates/frame-preview-scroll-release';
import { NguyenBackground } from '@/components/templates/nguyen/nguyen-background';
import { NguyenFooter } from '@/components/templates/nguyen/nguyen-footer';
import { NguyenHeader } from '@/components/templates/nguyen/nguyen-header';
import { NguyenThemeProvider } from '@/components/templates/nguyen/nguyen-theme-provider';

interface NguyenSubpageShellProps {
  children: ReactNode;
}

export function NguyenSubpageShell({ children }: NguyenSubpageShellProps) {
  return (
    <NguyenThemeProvider>
      <FramePreviewScrollRelease />
      <NguyenBackground />
      <NguyenHeader />
      <main className="relative z-10">{children}</main>
      <div className="relative z-10">
        <NguyenFooter />
      </div>
    </NguyenThemeProvider>
  );
}
