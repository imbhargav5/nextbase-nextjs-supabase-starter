import type { LucideIcon } from 'lucide-react';
import { Database, LockKeyhole, Palette, Rocket, ShieldCheck, Zap } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Rocket,
    title: 'Next.js 16',
    description:
      'App Router, Server Components, Server Actions, and modern caching patterns in a production-ready structure.',
  },
  {
    icon: Database,
    title: 'Supabase',
    description:
      'PostgreSQL, authentication, generated types, migrations, and local development are already connected.',
  },
  {
    icon: ShieldCheck,
    title: 'Type-safe by default',
    description:
      'TypeScript, Zod, and generated database types keep contracts clear from forms through data access.',
  },
  {
    icon: Palette,
    title: 'shadcn/ui system',
    description:
      'Accessible components, semantic tokens, responsive layouts, and dark mode form one coherent interface.',
  },
  {
    icon: LockKeyhole,
    title: 'Complete authentication',
    description:
      'Password, magic link, OAuth-ready providers, recovery flows, and protected routes are included.',
  },
  {
    icon: Zap,
    title: 'Developer experience',
    description:
      'Fast local setup, Turborepo tasks, linting, testing, and clear package boundaries keep iteration quick.',
  },
];

export function AboutFeaturesGrid() {
  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-muted-foreground">The foundation</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for product teams and independent developers
        </h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          The stack stays intentionally familiar, composable, and easy to own.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="border-border/70 shadow-none">
            <CardHeader className="space-y-4">
              <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
                <feature.icon className="size-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-6">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
