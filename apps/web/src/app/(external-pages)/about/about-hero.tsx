import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { T } from '@/components/ui/Typography';
import { GithubIcon } from '@/components/SocialIcons';
import Link from 'next/link';

export function AboutHero() {
  return (
    <div className="text-center space-y-4">
      <Badge variant="outline" className="mb-4">
        About Nextbase
      </Badge>
      <T.H1 className="text-4xl sm:text-5xl md:text-6xl">
        Modern Full-Stack{' '}
        <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
          Starter Kit
        </span>
      </T.H1>
      <T.P className="mx-auto max-w-[700px] text-lg text-muted-foreground">
        Built with Next.js, TypeScript, Supabase, and shadcn/ui. Everything
        you need to ship your next SaaS product fast.
      </T.P>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Button size="lg" asChild>
          <Link href="/login">Get Started</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link
            href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter"
            target="_blank"
          >
            <GithubIcon className="mr-2 h-5 w-5" />
            View on GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}
