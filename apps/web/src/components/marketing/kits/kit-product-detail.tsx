import Link from 'next/link';

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
import { KitCheckoutButton } from '@/components/marketing/kits/kit-checkout-button';
import { KitHeroPreview } from '@/components/marketing/kits/kit-hero-preview';
import { KitIncludesCard } from '@/components/marketing/kits/kit-includes-card';
import { KitTemplatePages } from '@/components/marketing/kits/kit-template-pages';
import type { KitProduct } from '@/lib/kits/catalog';
import { getPrimaryTemplateDemoPath } from '@/lib/kits/catalog';

interface KitProductDetailProps {
  kit: KitProduct;
  isOwned?: boolean;
}

export function KitProductDetail({ kit, isOwned = false }: KitProductDetailProps) {
  const demoHref = getPrimaryTemplateDemoPath(kit);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 brand-surface-glow">
      <div className="max-w-3xl space-y-6">
        <div className="flex flex-wrap gap-2">
          {kit.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {kit.name}
          </h1>
          <p className="text-lg text-muted-foreground">{kit.tagline}</p>
          <p className="leading-7 text-muted-foreground">{kit.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-2xl font-semibold">{kit.priceDisplay}</span>
          <span className="text-sm text-muted-foreground">
            {kit.promptCount} prompts · {kit.stack.join(' · ')}
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {isOwned ? (
            <Button asChild size="lg" variant="brand">
              <Link href={`/kit/${kit.slug}/prompts`}>Open prompts</Link>
            </Button>
          ) : (
            <KitCheckoutButton
              kitSlug={kit.slug}
              label={`Get the kit (${kit.priceDisplay})`}
            />
          )}
          <Button asChild size="lg" variant="outline">
            <Link href={demoHref}>Preview live</Link>
          </Button>
        </div>
      </div>

      <Separator className="my-12" />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <KitIncludesCard kit={kit} />

        <KitHeroPreview href={demoHref} kitName={kit.name} />

        <Card className="border-border/70 shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle>Template pages</CardTitle>
            <CardDescription>
              Click a section to open its build prompt. Scaffolds include
              matching agent prompts to finish in your repo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KitTemplatePages kit={kit} isOwned={isOwned} />
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>Premium prompts that ship.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              You can check out without an account. We create one from your
              Stripe email and sign you in after payment. Copy prompts into your
              agent, run the dev server, and use the ship prompts when you deploy.
            </p>
            <p>
              Already signed in? Purchases attach to your current account.
              Preview the{' '}
              <Link href={demoHref} className="text-foreground underline">
                live demo
              </Link>{' '}
              or browse{' '}
              <Link href="/kits" className="text-foreground underline">
                all kits
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
