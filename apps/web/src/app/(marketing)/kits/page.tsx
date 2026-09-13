import Link from 'next/link';

import { KitCatalogCard } from '@/components/marketing/kits/kit-catalog-card';
import { createPageMetadata } from '@/lib/seo/metadata';
import { kitProductCatalog } from '@/lib/kits/catalog';

export const metadata = createPageMetadata({
  title: 'Kits',
  description:
    'Prompt packs with ship-ready Next.js templates. Copy into your agent and launch.',
  path: '/kits',
});

export default function KitsPage() {
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8 brand-surface-glow">
      <div className="relative mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <p className="brand-page-eyebrow">Prompt Market</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Kits built around real templates
          </h1>
          <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            One kit means one template family (multiple pages) and matching
            agent prompts. Choose SaaS or portfolio, not a pile of unrelated
            demos.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {kitProductCatalog.map((kit) => (
            <KitCatalogCard key={kit.slug} kit={kit} />
          ))}
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Not sure what to ship? See{' '}
          <Link
            href="/prompts"
            className="link-brand"
          >
            build ideas
          </Link>{' '}
          for product concepts you can launch with each kit.
        </p>
      </div>
    </div>
  );
}
