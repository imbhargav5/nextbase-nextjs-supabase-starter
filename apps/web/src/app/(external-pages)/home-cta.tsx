import { ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function HomeCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Card className="mx-auto max-w-5xl overflow-hidden border-border/70 bg-muted/30 shadow-none">
        <CardContent className="flex flex-col items-start gap-8 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-2xl gap-4">
            <div className="hidden size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:flex">
              <Rocket className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Start with a foundation you can trust
              </h2>
              <p className="leading-7 text-muted-foreground">
                Create an account, explore the protected workspace, and make
                Nextbase your own.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/sign-up">
              Start building
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
