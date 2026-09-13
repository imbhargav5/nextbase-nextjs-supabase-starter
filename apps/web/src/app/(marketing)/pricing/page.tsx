import type { Metadata } from 'next';

import { PricingTableDemo } from '@/components/blocks/pricing-table-demo';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Pricing',
  description:
    'Transparent SaaS pricing layouts for Menace Next — monthly and yearly tiers, feature comparison, and checkout-ready UI you can wire to Stripe or Polar.',
  path: '/pricing',
});

export default function PricingPage() {
  return (
    <div>
      <div className="border-b bg-muted/10 px-4 py-8 text-center sm:py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Choose the plan that fits your team. Switch between monthly and yearly
          billing anytime.
        </p>
      </div>
      <PricingTableDemo />
    </div>
  )
}
