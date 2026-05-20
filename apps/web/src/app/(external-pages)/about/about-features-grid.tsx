import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { T } from '@/components/ui/Typography';
import {
  Database,
  Lock,
  Palette,
  Rocket,
  Shield,
  Zap,
} from 'lucide-react';

export function AboutFeaturesGrid() {
  return (
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
  );
}
