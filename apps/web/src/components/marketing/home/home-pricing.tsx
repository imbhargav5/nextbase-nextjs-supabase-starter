'use client';

import NumberFlow from '@number-flow/react';
import {
  Briefcase,
  CheckCheck,
  Database,
  Server,
  type LucideIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TimelineContent } from '@/components/ui/timeline-animation';
import {
  SlidingHighlightProvider,
  SlidingHighlightTarget,
} from '@/components/ui/sliding-highlight';
import { cn } from '@/lib/utils';

const revealVariants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
  hidden: {
    filter: 'blur(10px)',
    y: -20,
    opacity: 0,
  },
};

const priceFormat = {
  style: 'currency' as const,
  currency: 'USD',
  trailingZeroDisplay: 'stripIfInteger' as const,
};

type Plan = {
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  popular?: boolean;
  features: Array<{ text: string; icon: LucideIcon }>;
  includes: string[];
};

const plans: Plan[] = [
  {
    name: 'Starter',
    description:
      'Great for small businesses and startups looking to get started with AI',
    price: 12,
    yearlyPrice: 99,
    features: [
      { text: 'Up to 10 boards per workspace', icon: Briefcase },
      { text: 'Up to 10GB storage', icon: Database },
      { text: 'Limited analytics', icon: Server },
    ],
    includes: [
      'Free includes:',
      'Unlimted Cards',
      'Custom background & stickers',
      '2-factor authentication',
    ],
  },
  {
    name: 'Business',
    description:
      'Best value for growing businesses that need more advanced features',
    price: 48,
    yearlyPrice: 399,
    popular: true,
    features: [
      { text: 'Unlimted boards', icon: Briefcase },
      { text: 'Storage (250MB/file)', icon: Database },
      { text: '100 workspace command runs', icon: Server },
    ],
    includes: [
      'Everything in Starter, plus:',
      'Advanced checklists',
      'Custom fields',
      'Servedless functions',
    ],
  },
  {
    name: 'Enterprise',
    description:
      'Advanced plan with enhanced security and unlimited access for large teams',
    price: 96,
    yearlyPrice: 899,
    features: [
      { text: 'Unlimited board', icon: Briefcase },
      { text: 'Unlimited storage', icon: Database },
      { text: 'Unlimited workspaces', icon: Server },
    ],
    includes: [
      'Everything in Business, plus:',
      'Multi-board management',
      'Multi-board guest',
      'Attachment permissions',
    ],
  },
];

function PricingPlanCard({
  plan,
  isYearly,
}: {
  plan: Plan;
  isYearly: boolean;
}) {
  const price = isYearly ? plan.yearlyPrice : plan.price;

  return (
    <Card
      className={cn(
        'relative border-border/70 shadow-xl shadow-foreground/5',
        plan.popular && 'ring-2 ring-primary/40',
      )}
    >
      <CardHeader className="text-left">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          {plan.popular ? <Badge>Popular</Badge> : null}
        </div>
        <CardDescription>{plan.description}</CardDescription>
        <div className="flex items-baseline gap-1 pt-2">
          <NumberFlow
            format={priceFormat}
            value={price}
            className="text-4xl font-semibold tracking-tight"
          />
          <span className="text-sm text-muted-foreground">
            /{isYearly ? 'year' : 'month'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <Button
          type="button"
          variant={plan.popular ? 'default' : 'outline'}
          size="lg"
          className="w-full"
        >
          Get started
        </Button>

        <ul className="flex flex-col gap-2">
          {plan.features.map((feature) => {
            const Icon = feature.icon;

            return (
              <li key={feature.text} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-content-center rounded-md bg-muted text-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm text-muted-foreground">
                  {feature.text}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">
            {plan.includes[0]}
          </p>
          <ul className="flex flex-col gap-2">
            {plan.includes.slice(1).map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="grid size-6 shrink-0 place-content-center rounded-full border border-primary/30 bg-primary/10">
                  <CheckCheck
                    className="size-3.5 text-primary"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function HomePricing() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={pricingRef}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <TimelineContent
          as="div"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-sm font-medium text-muted-foreground">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Plans that work best for your{' '}
            <span className="rounded-xl border border-dashed border-primary/40 bg-primary/10 px-2 py-1 capitalize">
              business
            </span>
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Trusted by teams around the world. Explore which option is right for
            you.
          </p>
        </TimelineContent>

        <div className="mb-10 flex justify-center">
          <SlidingHighlightProvider
            layoutId="home-pricing-billing-interval"
            className="relative inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1"
          >
            {(
              [
                { id: 'monthly', label: 'Monthly', value: false as const },
                {
                  id: 'yearly',
                  label: 'Yearly',
                  value: true as const,
                  badge: 'Save 20%',
                },
              ] as const
            ).map((option) => {
              const isActive = isYearly === option.value;

              return (
                <SlidingHighlightTarget
                  key={option.id}
                  id={option.id}
                  highlightClassName="rounded-full bg-background shadow-sm ring-1 ring-border/60"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onMouseEnter={() => setIsYearly(option.value)}
                    onClick={() => setIsYearly(option.value)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="inline-flex items-center">
                      {option.label}
                      {'badge' in option && option.badge ? (
                        <Badge variant="secondary" className="ml-1.5 font-normal">
                          {option.badge}
                        </Badge>
                      ) : null}
                    </span>
                  </button>
                </SlidingHighlightTarget>
              );
            })}
          </SlidingHighlightProvider>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingPlanCard
              key={plan.name}
              plan={plan}
              isYearly={isYearly}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
