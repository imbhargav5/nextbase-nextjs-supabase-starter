import Link from 'next/link';

import { ArrowRightIcon } from '@/components/icons/arrow-right';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function HomeCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Card className="mx-auto max-w-5xl overflow-hidden border-border/70 bg-muted/30 shadow-none">
        <CardContent className="flex flex-col items-start gap-8 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-2xl gap-4">
            <Logo size={44} className="hidden shrink-0 sm:block" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Premium prompts that ship
              </h2>
              <p className="leading-7 text-muted-foreground">
                Pick a kit, preview the template, and copy prompts into your
                agent. Checkout is rolling out; create an account to hear when
                yours is ready.
              </p>
            </div>
          </div>
          <Button asChild size="lg" variant="brand" className="shrink-0">
            <Link href="/kits" className="group">
              Browse kits
              <ArrowRightIcon aria-hidden size={16} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
