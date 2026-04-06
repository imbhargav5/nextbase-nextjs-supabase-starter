import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Database, Github, Lock, Palette, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Shield,
    title: 'Type-Safe',
    description: 'End-to-end TypeScript with auto-generated Supabase types. Catch errors at compile time.',
  },
  {
    icon: Zap,
    title: 'Modern Stack',
    description: 'Next.js 16, TypeScript, Supabase, and Tailwind CSS — the best tools for modern web development.',
  },
  {
    icon: Palette,
    title: 'UI Components',
    description: 'Beautiful components built with Radix UI and Tailwind. Accessible and customizable.',
  },
  {
    icon: Lock,
    title: 'Authentication',
    description: 'Magic links, OAuth providers, and email/password with protected routes — all pre-configured.',
  },
  {
    icon: Database,
    title: 'Database Ready',
    description: 'Supabase with Row Level Security, migrations, and seed data — ready for production.',
  },
  {
    icon: ArrowRight,
    title: 'Fast Deployment',
    description: 'Deploy to Vercel in minutes. CI/CD, preview deployments, and automatic type generation included.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
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
              <Github className="mr-2 h-4 w-4" /> View on GitHub
            </Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
            <p className="text-muted-foreground mt-2">
              Production-ready features included out of the box
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border bg-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto flex flex-col gap-4 items-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to build?</h2>
          <p className="text-muted-foreground">
            Start with a solid foundation and ship faster.
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
