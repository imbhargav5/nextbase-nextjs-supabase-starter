'use client';

import NumberFlow from '@number-flow/react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const priceFormat = {
  style: 'currency' as const,
  currency: 'USD',
  trailingZeroDisplay: 'stripIfInteger' as const,
};

interface PricingPlan {
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for individuals and small projects',
    features: [
      'Up to 5 team members',
      '3 active projects',
      'Basic analytics dashboard',
      '5GB cloud storage',
      'Community support',
      'Mobile app access',
      'Standard integrations',
    ],
  },
  {
    name: 'Professional',
    badge: 'Popular',
    monthlyPrice: 29,
    annualPrice: 23,
    description: 'Best for growing teams and businesses',
    popular: true,
    features: [
      'Unlimited team members',
      'Unlimited projects',
      'Advanced analytics & reports',
      '100GB cloud storage',
      'Priority support (4hr response)',
      '100+ integrations',
      'Custom workflows',
      'Version history',
      'API access',
    ],
  },
  {
    name: 'Enterprise',
    badge: 'Enterprise',
    monthlyPrice: 99,
    annualPrice: 79,
    description: 'For large teams with advanced needs',
    features: [
      'Everything in Professional',
      'Unlimited storage',
      '24/7 dedicated support',
      'Custom integrations',
      'Single Sign-On (SSO)',
      'Advanced security & compliance',
      'Dedicated account manager',
      'Custom SLAs',
      'Onboarding & training',
    ],
  },
];

function PricingPlanCard({
  plan,
  isAnnual,
}: {
  plan: PricingPlan;
  isAnnual: boolean;
}) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const interval = 'mo';

  return (
    <article
      className={cn(
        'nguyen-pricing-card flex h-full flex-col rounded-xl border border-border/60 p-6 shadow-xl backdrop-blur-sm lg:p-8',
        plan.popular && 'nguyen-pricing-card--popular',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
        {plan.badge ? (
          <Badge
            variant={plan.popular ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {plan.badge}
          </Badge>
        ) : null}
      </div>

      <div className="mt-5 flex items-baseline gap-1">
        <NumberFlow
          format={priceFormat}
          value={price}
          className="text-4xl font-semibold tracking-tight text-foreground"
        />
        <span className="text-sm text-muted-foreground">/{interval}</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {plan.description}
      </p>

      <Button asChild className="mt-6 w-full" size="lg">
        <Link href="/sign-up">Get Started</Link>
      </Button>

      <ul className="mt-8 flex flex-1 flex-col gap-3 border-t border-border/60 pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function NguyenPricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby="nguyen-pricing-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="nguyen-pricing-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Choose the Right Plan for Your Team
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Flexible pricing that scales with your business, from solo developers
            to large enterprises.
          </p>
        </div>

        <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <span className="sr-only">Toggle between monthly and annual billing</span>
          <Label
            htmlFor="nguyen-billing-toggle"
            className={cn(
              'text-sm font-medium transition-colors',
              !isAnnual ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Monthly
          </Label>
          <Switch
            id="nguyen-billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            aria-label="Toggle between monthly and annual billing"
          />
          <Label
            htmlFor="nguyen-billing-toggle"
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors',
              isAnnual ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Annual
            <Badge variant="secondary" className="font-normal">
              Save 20%
            </Badge>
          </Label>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingPlanCard key={plan.name} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>
      </div>
    </section>
  );
}
