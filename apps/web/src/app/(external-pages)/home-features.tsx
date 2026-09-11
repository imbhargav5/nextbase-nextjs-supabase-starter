import { HoverStack, type HoverStackCard } from '@/components/ui/hover-stack';

const featureCards: HoverStackCard[] = [
  {
    tag: 'Type-Safe',
    quote: 'End-to-end TypeScript with auto-generated Supabase types. Catch errors before they ship.',
    bg: 'color-mix(in oklch, var(--card) 88%, var(--foreground) 12%)',
  },
  {
    tag: 'Modern Stack',
    quote: 'Next.js 16, Supabase, and Tailwind CSS — a focused toolkit for production web apps.',
    bg: 'color-mix(in oklch, var(--muted) 72%, var(--card) 28%)',
  },
  {
    tag: 'UI Components',
    quote: 'Accessible shadcn/ui primitives with Radix behavior and a polished visual system.',
    bg: 'color-mix(in oklch, var(--card) 82%, var(--foreground) 18%)',
  },
  {
    tag: 'Authentication',
    quote: 'Magic links, OAuth, and protected routes configured for real sign-up flows.',
    bg: 'color-mix(in oklch, var(--secondary) 65%, var(--card) 35%)',
  },
  {
    tag: 'Database',
    quote: 'Supabase with row-level security, migrations, and seed data ready for launch.',
    bg: 'color-mix(in oklch, var(--card) 90%, var(--muted-foreground) 10%)',
  },
  {
    tag: 'Deployment',
    quote: 'Ship to Vercel in minutes with preview environments and CI already wired up.',
    bg: 'color-mix(in oklch, var(--muted) 80%, var(--foreground) 20%)',
  },
];

export function HomeFeatures() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">Built to ship</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need, already connected
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Spend your time on the product instead of rebuilding the same foundation for every
            project.
          </p>
        </div>

        <div className="overflow-visible py-4">
          <HoverStack
            cards={featureCards}
            cardWidth={272}
            cardHeight={340}
            overlap={88}
            rotation={4}
            pushDistance={180}
          />
        </div>
      </div>
    </section>
  );
}
