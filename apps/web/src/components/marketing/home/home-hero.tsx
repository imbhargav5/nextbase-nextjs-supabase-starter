import { Check } from 'lucide-react';
import Link from 'next/link';

import { ArrowRightIcon } from '@/components/icons/arrow-right';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HomeHeroBackground } from './home-hero-background';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden brand-surface-glow">
      <HomeHeroBackground />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="max-w-3xl space-y-7">
          <Badge variant="brand" className="gap-1.5 rounded-full px-3 py-1">
            <Check className="size-3.5 text-brand" aria-hidden="true" />
            Premium prompts that ship
          </Badge>
          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Launch landing pages that{' '}
              <span className="text-brand">actually run.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              Each kit pairs section prompts with a full Next.js template, hero
              through footer, plus guardrails for your stack.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="brand">
              <Link href="/kits" className="group">
                Browse kits
                <ArrowRightIcon aria-hidden size={16} />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {['Next.js templates', 'Agent-ready prompts', 'Live demos'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-brand" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
