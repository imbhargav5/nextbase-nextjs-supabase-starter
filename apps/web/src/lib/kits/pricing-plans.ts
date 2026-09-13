import type { PricingFeature, PricingPlan } from '@/components/ui/pricing-table';

export type PromptMarketTierId = 'starter' | 'pro' | 'studio';

export interface PromptMarketTier {
  id: PromptMarketTierId;
  name: string;
  description: string;
  /** One-time license price in USD */
  price: number;
  /** Shown when running a founding-member toggle on marketing pages */
  foundingPrice: number;
  popular?: boolean;
  ctaLabel: string;
  ctaHref: string;
  highlights: string[];
  includesLabel: string;
  includes: string[];
}

export const promptMarketTiers: PromptMarketTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description:
      'The full SaaS app shell plus one launch kit. Pick SaaS or Portfolio at checkout.',
    price: 89,
    foundingPrice: 79,
    ctaLabel: 'Browse kits',
    ctaHref: '/kits',
    highlights: [
      'Next.js + Supabase starter (auth, dashboard, RLS patterns)',
      'Your choice of 1 launch kit template',
      'Section prompts and ship checklist for that kit',
    ],
    includesLabel: 'License & access',
    includes: [
      'Personal use on unlimited side projects',
      'Lifetime updates for your tier',
      'Live template demos before you buy',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description:
      'Both launch kits and permission to ship a real product for customers.',
    price: 149,
    foundingPrice: 129,
    popular: true,
    ctaLabel: 'Get Pro',
    ctaHref: '/kits?tier=pro',
    highlights: [
      'Everything in Starter',
      'SaaS Launch + Portfolio Launch kits included',
      'Build-idea prompts on /prompts for each template',
    ],
    includesLabel: 'License & access',
    includes: [
      'Commercial use for one shipped product',
      'All section prompts for both templates',
      'Priority email support for launch week',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    description:
      'For freelancers and agencies shipping multiple client landings.',
    price: 229,
    foundingPrice: 199,
    ctaLabel: 'Get Studio',
    ctaHref: '/kits?tier=studio',
    highlights: [
      'Everything in Pro',
      'Every kit we ship today and the next releases in this tier',
      'Shared prompt library access for your team',
    ],
    includesLabel: 'License & access',
    includes: [
      'Client work on up to 5 projects',
      'Team license (3 seats)',
      'Extended redistribution rights for client deliverables',
    ],
  },
];

/** Feature matrix for `/pricing` comparison table (`level` maps to tier id). */
export const promptMarketPricingFeatures: PricingFeature[] = [
  {
    name: 'Nextbase SaaS shell (auth, Supabase, app routes)',
    included: 'starter',
  },
  {
    name: 'One launch kit (SaaS or Portfolio)',
    included: 'starter',
  },
  {
    name: 'Section prompts for included kits',
    included: 'starter',
  },
  {
    name: 'Both SaaS + Portfolio kits',
    included: 'pro',
  },
  {
    name: 'Build-idea / transformation prompts',
    included: 'pro',
  },
  {
    name: 'Commercial license (one product)',
    included: 'pro',
  },
  {
    name: 'Future kits in Studio tier',
    included: 'all',
  },
  {
    name: 'Client projects (up to 5)',
    included: 'all',
  },
  {
    name: 'Team seats (3)',
    included: 'all',
  },
];

export function promptMarketTiersToPricingPlans(
  useFoundingPrice: boolean,
): PricingPlan[] {
  return promptMarketTiers.map((tier) => {
    const amount = useFoundingPrice ? tier.foundingPrice : tier.price;

    return {
      name: tier.name,
      level: tier.id === 'studio' ? 'all' : tier.id,
      popular: tier.popular,
      price: {
        monthly: amount,
        yearly: amount,
      },
    };
  });
}

export function getPromptMarketTier(id: PromptMarketTierId) {
  return promptMarketTiers.find((tier) => tier.id === id);
}
