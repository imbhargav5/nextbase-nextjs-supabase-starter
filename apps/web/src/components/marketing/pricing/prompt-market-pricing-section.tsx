'use client';

import NumberFlow from '@number-flow/react';
import {
  CheckCheck,
  KeyRound,
  LayoutTemplate,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
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
  promptMarketTiers,
  type PromptMarketTier,
} from '@/lib/kits/pricing-plans';
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

const highlightIcons: LucideIcon[] = [Rocket, LayoutTemplate, KeyRound];

interface PromptMarketPricingSectionProps {
  showHeader?: boolean;
  className?: string;
}

function PricingPlanCard({
  plan,
  useFoundingPrice,
}: {
  plan: PromptMarketTier;
  useFoundingPrice: boolean;
}) {
  const price = useFoundingPrice ? plan.foundingPrice : plan.price;

  return (
    <Card
      className={cn(
        'relative border-border/70 shadow-xl shadow-foreground/5',
        plan.popular && 'ring-2 ring-brand/45',
      )}
    >
      <CardHeader className="text-left">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          {plan.popular ? <Badge variant="brand">Popular</Badge> : null}
        </div>
        <CardDescription>{plan.description}</CardDescription>
        <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1 pt-2">
          <NumberFlow
            format={priceFormat}
            value={price}
            className="text-4xl font-semibold tracking-tight"
          />
          <span className="text-sm text-muted-foreground">once</span>
          {useFoundingPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              ${plan.price}
            </span>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <Button
          asChild
          variant={plan.popular ? 'brand' : 'outline'}
          size="lg"
          className="w-full"
        >
          <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
        </Button>

        <ul className="flex flex-col gap-2">
          {plan.highlights.map((feature, index) => {
            const FeatureIcon = highlightIcons[index] ?? Rocket;

            return (
              <li key={feature} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-content-center rounded-md bg-muted text-foreground">
                  <FeatureIcon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">
            {plan.includesLabel}
          </p>
          <ul className="flex flex-col gap-2">
            {plan.includes.map((feature) => (
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

export function PromptMarketPricingSection({
  showHeader = true,
  className,
}: PromptMarketPricingSectionProps) {
  const [useFoundingPrice, setUseFoundingPrice] = useState(true);
  const pricingRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={pricingRef}
      className={cn('px-4 py-20 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      <div className="mx-auto max-w-7xl">
        {showHeader ? (
          <TimelineContent
            as="div"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <p className="text-sm font-medium text-muted-foreground">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Start with the{' '}
              <span className="rounded-xl border border-dashed border-primary/40 bg-primary/10 px-2 py-1">
                SaaS shell
              </span>
              , add templates as you grow
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              One-time licenses. Starter includes the Nextbase app foundation and
              one launch kit. Higher tiers unlock more templates and commercial
              permissions.
            </p>
          </TimelineContent>
        ) : null}

        <div className="mb-10 flex justify-center">
          <div
            role="radiogroup"
            aria-label="Pricing offer"
            className="relative inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1"
          >
            {(
              [
                {
                  id: 'founding',
                  label: 'Founding price',
                  value: true as const,
                  badge: 'Limited',
                },
                { id: 'standard', label: 'Standard', value: false as const },
              ] as const
            ).map((option) => {
              const isActive = useFoundingPrice === option.value;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setUseFoundingPrice(option.value)}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="prompt-market-pricing-offer"
                      className="absolute inset-0 rounded-full bg-background shadow-sm ring-1 ring-border/60"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  ) : null}
                  <span className="relative z-10 inline-flex items-center">
                    {option.label}
                    {'badge' in option && option.badge ? (
                      <Badge variant="secondary" className="ml-1.5 font-normal">
                        {option.badge}
                      </Badge>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {promptMarketTiers.map((plan) => (
            <PricingPlanCard
              key={plan.id}
              plan={plan}
              useFoundingPrice={useFoundingPrice}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
