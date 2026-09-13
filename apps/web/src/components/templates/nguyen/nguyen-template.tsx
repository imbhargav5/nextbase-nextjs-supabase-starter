'use client';

import { useSearchParams } from 'next/navigation';

import { NguyenBackground } from '@/components/templates/nguyen/nguyen-background';
import { NguyenFaq } from '@/components/templates/nguyen/nguyen-faq';
import { NguyenFeatures } from '@/components/templates/nguyen/nguyen-features';
import { NguyenFooter } from '@/components/templates/nguyen/nguyen-footer';
import { NguyenHeader } from '@/components/templates/nguyen/nguyen-header';
import { NguyenHero } from '@/components/templates/nguyen/nguyen-hero';
import { NguyenPricing } from '@/components/templates/nguyen/nguyen-pricing';
import { NguyenSolution } from '@/components/templates/nguyen/nguyen-solution';
import { NguyenTestimonials } from '@/components/templates/nguyen/nguyen-testimonials';
import { NguyenThemeProvider } from '@/components/templates/nguyen/nguyen-theme-provider';
import { FramePreviewScrollRelease } from '@/components/templates/frame-preview-scroll-release';
import { TemplateFramePreviewLock } from '@/components/templates/template-frame-preview-lock';
import { KIT_PREVIEW_HEIGHT } from '@/lib/kits/preview-frame';

export function NguyenTemplate() {
  const searchParams = useSearchParams();
  const isFramePreview = searchParams.get('frame') === '1';

  if (isFramePreview) {
    return (
      <NguyenThemeProvider>
        <TemplateFramePreviewLock />
        <div
          className="overflow-hidden bg-background"
          style={{ height: KIT_PREVIEW_HEIGHT }}
        >
          <NguyenBackground />
          <NguyenHeader />
          <main className="relative z-10">
            <NguyenHero />
          </main>
        </div>
      </NguyenThemeProvider>
    );
  }

  return (
    <NguyenThemeProvider>
      <FramePreviewScrollRelease />
      <NguyenBackground />
      <NguyenHeader />
      <main className="relative z-10">
        <NguyenHero />
        <NguyenFeatures />
        <NguyenSolution />
        <NguyenTestimonials />
        <NguyenPricing />
        <NguyenFaq />
      </main>
      <div className="relative z-10">
        <NguyenFooter />
      </div>
    </NguyenThemeProvider>
  );
}
