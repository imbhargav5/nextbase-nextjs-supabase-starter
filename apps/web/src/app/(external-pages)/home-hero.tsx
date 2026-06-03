import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/components/SocialIcons';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HomeHero() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-24 px-4 text-center">
      <Badge variant="secondary" className="px-3 py-1">
        Open Source Starter Kit
      </Badge>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl max-w-3xl">
        Build your{' '}
        <span className="text-primary">SaaS product</span>{' '}
        faster
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl">
        A production-ready Next.js + Supabase starter with authentication, database, UI components, and everything you need.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/sign-up">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter" target="_blank" rel="noopener noreferrer">
            <GithubIcon className="mr-2 h-4 w-4" /> View on GitHub
          </Link>
        </Button>
      </div>
    </section>
  );
}
