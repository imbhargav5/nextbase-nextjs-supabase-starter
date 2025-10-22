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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { T } from '@/components/ui/Typography';
import {
  Database,
  Github,
  Lock,
  Palette,
  Rocket,
  Shield,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="container mx-auto py-12 space-y-12 max-w-6xl">
      {/* Hero Section */}
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
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <T.H2 className="text-3xl">Built for Developers</T.H2>
          <T.P className="text-muted-foreground">
            Everything you need to build production-ready applications
          </T.P>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Next.js 14</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built on the latest Next.js with App Router, Server Components,
                and Server Actions for optimal performance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <Database className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Supabase</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                PostgreSQL database, authentication, real-time subscriptions,
                and storage - all in one platform.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Type-Safe</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Full TypeScript support with type-safe database queries and API
                routes for confidence in your code.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                  <Palette className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>shadcn/ui</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Beautiful, accessible components built with Radix UI and
                Tailwind CSS. Customizable and production-ready.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                  <Lock className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>Authentication</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete auth flows including magic links, OAuth providers,
                password reset, and protected routes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                  <Zap className="h-6 w-6 text-chart-5" />
                </div>
                <CardTitle>Developer UX</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Hot reload, TypeScript, ESLint, Prettier, and more. Optimized
                for the best developer experience.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <Empty className="border-2 border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Rocket />
          </EmptyMedia>
          <EmptyTitle>Ready to Build Something Amazing?</EmptyTitle>
          <EmptyDescription>
            Clone the repository and start building your next project with the
            best tools in the ecosystem.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start Building</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link
                href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter"
                target="_blank"
              >
                <Github className="mr-2 h-5 w-5" />
                Star on GitHub
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>

      {/* Tech Stack Section */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Built with modern, production-ready technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <Badge>Next.js 14</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge>TypeScript</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Supabase</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Tailwind CSS</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge>shadcn/ui</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge>React Hook Form</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Zod</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Framer Motion</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
