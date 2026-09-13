import Link from 'next/link';

import { KitPromptLibrary } from '@/components/marketing/kits/kit-prompt-library';
import { Badge } from '@/components/ui/badge';
import { createPageMetadata } from '@/lib/seo/metadata';
import { kitProductCatalog } from '@/lib/kits/catalog';
import { getTransformationPrompts } from '@/lib/prompts/transformation-prompts';

const buildIdeaCount = getTransformationPrompts().length - 1;

export const metadata = createPageMetadata({
  title: 'Build ideas & prompts',
  description:
    'Product ideas for the SaaS Launch Kit and Portfolio Launch Kit, each with an agent prompt to rebrand the template for that business.',
  path: '/prompts',
});

export default function PromptsPage() {
  const prompts = getTransformationPrompts();

  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8 brand-surface-glow">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl text-center sm:mx-auto">
          <Badge variant="brand" className="mb-4 rounded-full px-3 py-1">
            {buildIdeaCount} build ideas
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What you can build with a kit
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Same template, different business. Each idea spells out the audience,
            offer, and section copy, plus a prompt to run in your coding agent
            after you buy.
          </p>
        </div>

        <ul className="mb-12 grid gap-3 sm:grid-cols-2">
          {kitProductCatalog.map((kit) => (
            <li key={kit.slug}>
              <Link
                href={`/kit/${kit.slug}`}
                className="flex h-full flex-col rounded-lg border border-border/70 bg-card/50 px-4 py-3 text-left transition-colors hover:border-brand/35 hover:bg-card"
              >
                <span className="font-medium text-foreground">{kit.name}</span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {kit.tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <KitPromptLibrary
          kitName="Build ideas"
          showHeader={false}
          prompts={prompts}
        />

        <p className="mt-14 text-center text-sm text-muted-foreground">
          Section-by-section kit prompts unlock on your{' '}
          <Link href="/kits" className="text-foreground underline">
            kit product page
          </Link>{' '}
          after purchase.
        </p>
      </div>
    </div>
  );
}
