import { HoverStack, type HoverStackCard } from '@/components/ui/hover-stack';

const featureCards: HoverStackCard[] = [
  {
    tag: 'Type-Safe',
    quote: 'TypeScript end to end, with Supabase types generated from your schema. Fewer surprises in CI.',
    bg: 'color-mix(in oklch, var(--card) 88%, var(--foreground) 12%)',
  },
  {
    tag: 'Modern Stack',
    quote: 'Next.js 16, Supabase, and Tailwind CSS. The same stack the templates use in production.',
    bg: 'color-mix(in oklch, var(--muted) 72%, var(--card) 28%)',
  },
  {
    tag: 'UI Components',
    quote: 'shadcn/ui on Radix. Accessible defaults and a consistent visual system.',
    bg: 'color-mix(in oklch, var(--card) 82%, var(--foreground) 18%)',
  },
  {
    tag: 'Authentication',
    quote: 'Magic links, OAuth, and protected routes wired for real sign-up flows.',
    bg: 'color-mix(in oklch, var(--secondary) 65%, var(--card) 35%)',
  },
  {
    tag: 'Database',
    quote: 'Supabase with RLS, migrations, and seed data when you need a database on day one.',
    bg: 'color-mix(in oklch, var(--card) 90%, var(--muted-foreground) 10%)',
  },
  {
    tag: 'Deployment',
    quote: 'Deploy to Vercel with preview environments and CI hooks already in the repo.',
    bg: 'color-mix(in oklch, var(--muted) 80%, var(--foreground) 20%)',
  },
];

export function HomeFeatures() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-medium text-brand">Built to ship</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            The boring parts are already wired
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Auth, database access, and UI primitives ship with the repo so you
            can focus on the landing page and the offer.
          </p>
        </div>

        <div className="overflow-x-clip py-4">
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
