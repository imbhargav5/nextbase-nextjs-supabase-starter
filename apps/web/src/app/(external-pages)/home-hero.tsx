import {
  ArrowRight,
  Check,
  Github,
  LockKeyhole,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

const previewItems = ['Launch checklist', 'Customer notes', 'Product roadmap'];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--color-muted),transparent_45%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-32">
        <div className="max-w-2xl space-y-7">
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
            <Check className="size-3.5" aria-hidden="true" />
            Open-source starter kit
          </Badge>
          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Build your SaaS product faster.
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
              Start with secure authentication, a typed Supabase database, and
              an accessible shadcn/ui foundation that is ready for real product
              work.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Get started
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link
                href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter"
                target="_blank"
                rel="noreferrer"
              >
                <Github aria-hidden="true" />
                View source
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {['Next.js 16', 'Supabase Auth', 'Type-safe schema'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-foreground" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-8 -z-10 rounded-full bg-muted/70 blur-3xl" />
          <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/5">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base">Private items</CardTitle>
                  <CardDescription>Your secure workspace</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1.5 bg-background">
                  <LockKeyhole className="size-3" aria-hidden="true" />
                  Protected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <ItemGroup className="gap-2">
                {previewItems.map((item, index) => (
                  <Item key={item} variant={index === 0 ? 'muted' : 'outline'}>
                    <ItemMedia variant="icon">
                      <LockKeyhole aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{item}</ItemTitle>
                      <span className="text-xs text-muted-foreground">
                        Updated {index + 1} day{index === 0 ? '' : 's'} ago
                      </span>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${item}`}>
                        <MoreHorizontal aria-hidden="true" />
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
