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
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Modern Full-Stack{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Starter Kit
          </span>
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          Built with Next.js, TypeScript, Supabase, and shadcn/ui. Everything
          you need to ship your next SaaS product fast.
        </p>
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
          <h2 className="text-3xl font-bold tracking-tight">
            Built for Developers
          </h2>
          <p className="text-muted-foreground">
            Everything you need to build production-ready applications
          </p>
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Database className="h-6 w-6 text-green-600" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Shield className="h-6 w-6 text-blue-600" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <Palette className="h-6 w-6 text-purple-600" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <Lock className="h-6 w-6 text-orange-600" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Zap className="h-6 w-6 text-yellow-600" />
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
