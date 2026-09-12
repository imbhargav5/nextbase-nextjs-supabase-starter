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

export function NguyenTemplate() {
  return (
    <NguyenThemeProvider>
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
