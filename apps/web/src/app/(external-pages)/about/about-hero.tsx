import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AboutHero() {
  return (
    <section className="mx-auto max-w-3xl py-10 text-center sm:py-16">
      <Badge variant="secondary" className="rounded-full px-3 py-1">
        About Nextbase
      </Badge>
      <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
        A modern full-stack starter kit
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
        Nextbase brings the essential parts of a secure SaaS product into one
        approachable codebase, so you can start from a working system instead
        of a blank folder.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/sign-up">
            Get started
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link
            href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter"
            target="_blank"
            rel="noreferrer"
          >
            <Github aria-hidden="true" />
            View on GitHub
          </Link>
        </Button>
      </div>
    </section>
  );
}
