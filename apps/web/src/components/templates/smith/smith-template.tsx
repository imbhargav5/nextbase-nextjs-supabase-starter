'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { SmithContact } from '@/components/templates/smith/smith-contact';
import { SmithExplorations } from '@/components/templates/smith/smith-explorations';
import { SmithHero } from '@/components/templates/smith/smith-hero';
import { SmithJournal } from '@/components/templates/smith/smith-journal';
import { SmithLoadingScreen } from '@/components/templates/smith/smith-loading-screen';
import { SmithStats } from '@/components/templates/smith/smith-stats';
import { SmithWorks } from '@/components/templates/smith/smith-works';
import { SmithThemeProvider } from '@/components/templates/smith/smith-theme-provider';
import { FramePreviewScrollRelease } from '@/components/templates/frame-preview-scroll-release';
import { TemplateFramePreviewLock } from '@/components/templates/template-frame-preview-lock';
import { KIT_PREVIEW_HEIGHT } from '@/lib/kits/preview-frame';

export function SmithTemplate() {
  const searchParams = useSearchParams();
  const isFramePreview = searchParams.get('frame') === '1';
  const [isLoading, setIsLoading] = useState(!isFramePreview);

  if (isFramePreview) {
    return (
      <SmithThemeProvider>
        <TemplateFramePreviewLock />
        <div
          className="overflow-hidden bg-[hsl(var(--smith-bg))]"
          style={{ height: KIT_PREVIEW_HEIGHT }}
        >
          <SmithHero />
        </div>
      </SmithThemeProvider>
    );
  }

  return (
    <SmithThemeProvider>
      <FramePreviewScrollRelease />
      {isLoading ? (
        <SmithLoadingScreen onComplete={() => setIsLoading(false)} />
      ) : null}
      <SmithHero />
      <main>
        <SmithWorks />
        <SmithJournal />
        <SmithExplorations />
        <SmithStats />
      </main>
      <SmithContact />
    </SmithThemeProvider>
  );
}
