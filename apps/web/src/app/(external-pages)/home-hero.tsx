'use client';

import BlurText from '@/components/BlurText';
import ShinyText from '@/components/ShinyText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

export function HomeHero() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-24 px-4 text-center">
      <Badge variant="secondary" className="px-3 py-1">
        Open Source Starter Kit
      </Badge>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl max-w-3xl">
        <ShinyText
          text="Build your SaaS product faster"
          className="font-bold"
          color="var(--foreground)"
          shineColor="var(--primary)"
        />
      </h1>
      <BlurText
        text="A production-ready Next.js + Supabase starter with authentication, database, UI components, and everything you need."
        className="text-muted-foreground text-lg max-w-xl justify-center"
        delay={30}
        animateBy="words"
      />
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/sign-up">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link
            href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-4 w-4" /> View on GitHub
          </Link>
        </Button>
      </div>
    </section>
  );
}
