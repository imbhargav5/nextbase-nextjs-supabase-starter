import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { createPageMetadata } from '@/lib/seo/metadata';
import { HomeBento } from './home-bento';
import { HomeCTA } from './home-cta';
import { HomeFaq } from './home-faq';
import { HomeFeatures } from './home-features';
import { HomeHero } from './home-hero';
import { HomePricing } from './home-pricing';

export const metadata: Metadata = createPageMetadata({
  title: 'Complete SaaS starter kit for Next.js and Supabase',
  description:
    'Launch faster with Menace Next — production auth, RLS, marketing pages, pricing UI, template demos, and SEO built for teams shipping real SaaS products.',
  path: '/',
  keywords: [
    'Menace Next',
    'SaaS starter kit',
    'Next.js Supabase boilerplate',
    'commercial SaaS template',
  ],
});

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <Separator />
      <HomeBento />
      <Separator />
      <HomeFeatures />
      <Separator />
      <HomePricing />
      <HomeFaq />
      <div className="border-t bg-muted/10">
        <HomeCTA />
      </div>
    </div>
  );
}
