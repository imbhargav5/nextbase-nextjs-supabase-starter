import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { createPageMetadata } from '@/lib/seo/metadata';
import { HomeBento } from '@/components/marketing/home/home-bento';
import { HomeCTA } from '@/components/marketing/home/home-cta';
import { HomeFaq } from '@/components/marketing/home/home-faq';
import { HomeFeatures } from '@/components/marketing/home/home-features';
import { HomeHero } from '@/components/marketing/home/home-hero';
import { HomePricing } from '@/components/marketing/home/home-pricing';

export const metadata: Metadata = createPageMetadata({
  title: 'Premium prompts that ship',
  description:
    'Prompt Market: prompt packs with ship-ready Next.js landing templates. Copy into your coding agent and launch faster.',
  path: '/',
  keywords: [
    'Prompt Market',
    'AI landing page prompts',
    'Next.js templates',
    'Agent prompts',
    'SaaS launch kit',
  ],
});

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <Separator className="bg-brand/15" />
      <HomeBento />
      <Separator className="bg-brand/15" />
      <HomeFeatures />
      <Separator className="bg-brand/15" />
      <HomePricing />
      <HomeFaq />
      <div className="border-t border-brand/15 bg-muted/10">
        <HomeCTA />
      </div>
    </div>
  );
}
