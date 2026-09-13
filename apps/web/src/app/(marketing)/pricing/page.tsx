import type { Metadata } from 'next';

import { PricingTableDemo } from '@/components/blocks/pricing-table-demo';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Pricing',
  description:
    'One-time Prompt Market licenses: SaaS starter shell plus launch kits, with higher tiers for more templates and commercial use.',
  path: '/pricing',
});

export default function PricingPage() {
  return (
    <div>
      <div className="border-b border-brand/15 bg-muted/10 px-4 py-8 text-center brand-surface-glow sm:py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          One-time licenses. Every tier includes the Nextbase SaaS foundation;
          templates and permissions scale with Pro and Studio.
        </p>
      </div>
      <PricingTableDemo />
    </div>
  )
}
