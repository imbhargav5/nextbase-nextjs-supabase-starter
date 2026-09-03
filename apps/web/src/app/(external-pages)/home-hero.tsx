import {
  ArrowRight,
  Check,
  CircleCheck,
  Code2,
  Database,
  Github,
  LockKeyhole,
  Rocket,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const activity = [
  ['AK', 'Alex Kim', 'shipped onboarding', '2m'],
  ['MS', 'Maya Singh', 'updated RLS policies', '18m'],
  ['JL', 'Jordan Lee', 'merged pull request #42', '1h'],
];

const chartBars = ['h-3', 'h-5', 'h-4', 'h-7', 'h-6', 'h-9', 'h-8', 'h-10', 'h-9', 'h-12', 'h-11', 'h-14'];

const previewNavigation = [
  { icon: Rocket, label: 'Overview' },
  { icon: Database, label: 'Database' },
  { icon: LockKeyhole, label: 'Authentication' },
  { icon: Code2, label: 'API' },
];

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b">
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-50 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute left-[8%] top-[-18rem] -z-10 size-[36rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-[-22rem] right-[-8rem] -z-10 size-[38rem] rounded-full bg-muted blur-3xl" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-16 sm:px-6 sm:py-24 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-28">
        <div className="relative max-w-2xl">
          <Badge variant="outline" className="mb-7 gap-2 rounded-full bg-background/80 px-3 py-1 shadow-sm backdrop-blur">
            <Sparkles aria-hidden="true" />
            NextBase 3.0 is ready to ship
            <ArrowRight aria-hidden="true" />
          </Badge>

          <h1 className="text-balance text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl lg:leading-[1.02]">
            The serious starter for your next big idea.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            Go from blank repository to production-ready SaaS with secure auth,
            typed data, polished components, and the workflows your team needs
            to keep shipping.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-7">
              <Link href="/sign-up">
                Start building free
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 bg-background/70 px-7">
              <Link href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter" target="_blank" rel="noreferrer">
                <Github data-icon="inline-start" aria-hidden="true" />
                Explore the repo
              </Link>
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
            {['Open source', 'Production patterns', 'Deploy in minutes'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="text-foreground" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 border-t pt-6">
            <div>
              <dt className="text-xs text-muted-foreground">Setup time</dt>
              <dd className="mt-1 font-mono text-lg font-semibold">&lt; 5 min</dd>
            </div>
            <div className="border-l pl-5 sm:pl-7">
              <dt className="text-xs text-muted-foreground">Core stack</dt>
              <dd className="mt-1 font-mono text-lg font-semibold">100% typed</dd>
            </div>
            <div className="border-l pl-5 sm:pl-7">
              <dt className="text-xs text-muted-foreground">License</dt>
              <dd className="mt-1 font-mono text-lg font-semibold">MIT</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:perspective-distant">
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-muted/80 blur-3xl" aria-hidden="true" />

          <Card className="overflow-hidden border-border/80 bg-card/95 shadow-2xl shadow-foreground/10 backdrop-blur lg:-rotate-y-2 lg:rotate-x-1">
            <CardHeader className="flex-row items-center gap-3 border-b bg-muted/35 px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="mx-auto flex h-7 w-full max-w-72 items-center justify-center rounded-md border bg-background/70 px-3 font-mono text-[10px] text-muted-foreground shadow-xs">
                app.nextbase.dev/dashboard
              </div>
              <div className="size-12" aria-hidden="true" />
            </CardHeader>

            <CardContent className="grid min-h-[31rem] grid-cols-[4.5rem_1fr] p-0 sm:grid-cols-[10rem_1fr]">
              <aside className="border-r bg-muted/15 p-3 sm:p-4" aria-label="Dashboard preview navigation">
                <div className="mb-7 flex items-center gap-2 px-1">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                    <Zap className="size-3.5" aria-hidden="true" />
                  </div>
                  <span className="hidden text-sm font-semibold sm:inline">Acme Labs</span>
                </div>
                <nav className="flex flex-col gap-1 text-xs">
                  {previewNavigation.map(({ icon: Icon, label }, index) => (
                    <span
                      key={label}
                      className={cn(
                        'flex h-8 items-center gap-2 px-2',
                        index === 0
                          ? 'rounded-md bg-accent font-medium'
                          : 'text-muted-foreground',
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">{label}</span>
                    </span>
                  ))}
                </nav>
              </aside>

              <div className="min-w-0 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Production workspace</p>
                    <h2 className="mt-1 truncate text-lg font-semibold">Good afternoon, Alex</h2>
                  </div>
                  <Badge variant="secondary" className="shrink-0 gap-1.5">
                    <CircleCheck aria-hidden="true" />
                    <span className="hidden sm:inline">All systems </span>online
                  </Badge>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Card className="shadow-none">
                    <CardHeader className="gap-2 p-4 pb-2">
                      <CardDescription className="flex items-center justify-between">
                        Active users <span className="font-mono text-xs">+18.2%</span>
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums">2,847</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex h-14 items-end gap-1" aria-label="Active users trend: increasing">
                        {chartBars.map((height, index) => (
                          <span key={index} className={'min-w-0 flex-1 rounded-sm bg-primary/70 ' + height} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-none">
                    <CardHeader className="gap-2 p-4 pb-2">
                      <CardDescription>Requests today</CardDescription>
                      <CardTitle className="text-2xl tabular-nums">84.2k</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3 p-4 pt-2">
                      <div className="flex size-10 items-center justify-center rounded-full border bg-muted/40">
                        <Terminal className="size-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">99.99% success</p>
                        <p className="text-[10px] text-muted-foreground">42 ms median response</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Team activity</h3>
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex flex-col gap-3">
                    {activity.map(([initials, name, action, time]) => (
                      <div key={name} className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                        </Avatar>
                        <p className="min-w-0 flex-1 truncate text-xs">
                          <span className="font-medium">{name}</span>{' '}
                          <span className="text-muted-foreground">{action}</span>
                        </p>
                        <span className="font-mono text-[10px] text-muted-foreground">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {['Next.js 16', 'Supabase', 'TypeScript', 'Tailwind CSS'].map((item) => (
                    <Badge key={item} variant="outline" className="font-mono font-normal">{item}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="absolute -right-4 top-24 hidden w-52 shadow-xl xl:block">
            <CardHeader className="flex-row items-center gap-3 p-4 pb-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Rocket className="size-4" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-sm">Deployment live</CardTitle>
                <CardDescription className="text-xs">Production · 38s</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-2 font-mono text-[10px] text-muted-foreground">
              main@8f42a1c
            </CardContent>
          </Card>

          <Card className="absolute -bottom-7 -left-5 hidden w-56 shadow-xl xl:block">
            <CardHeader className="flex-row items-center gap-3 p-4 pb-2">
              <div className="flex size-9 items-center justify-center rounded-full border bg-muted/50">
                <LockKeyhole className="size-4" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-sm">Secure by default</CardTitle>
                <CardDescription className="text-xs">RLS policies enabled</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex gap-1 px-4 pb-4 pt-2">
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className="h-1.5 flex-1 rounded-full bg-muted" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
