import Link from 'next/link';

import { ArrowRightIcon } from '@/components/icons/arrow-right';
import { KitTemplateHeroThumbnail } from '@/components/marketing/kits/kit-template-hero-thumbnail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { KitProduct, KitProductStatus } from '@/lib/kits/catalog';
import { getPrimaryTemplateDemoPath } from '@/lib/kits/catalog';
import { cn } from '@/lib/utils';

interface KitCatalogCardProps {
  kit: KitProduct;
}

function statusLabel(status: KitProductStatus) {
  return status === 'available' ? 'Available' : 'Coming soon';
}

export function KitCatalogCard({ kit }: KitCatalogCardProps) {
  const demoHref = getPrimaryTemplateDemoPath(kit);
  const accentA =
    kit.designTheme.swatches.find((s) => s.label === 'Primary')?.color ??
    kit.designTheme.swatches[1]?.color ??
    'var(--primary)';
  const accentB =
    kit.designTheme.swatches.find((s) => s.label === 'Beam')?.color ??
    kit.designTheme.swatches.find((s) => s.label === 'Accent A')?.color ??
    kit.designTheme.swatches[2]?.color ??
    accentA;
  const livePages = kit.templatePages.filter((p) => p.status === 'live').length;
  const templateLabel = kit.demoSlug.charAt(0).toUpperCase() + kit.demoSlug.slice(1);

  return (
    <article
      className={cn(
        'group/card relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm',
        'transition-[border-color,box-shadow,transform] duration-300 hover:border-border hover:shadow-xl hover:shadow-black/10',
        kit.status === 'coming-soon' && 'opacity-90',
      )}
      style={{
        backgroundImage: `linear-gradient(165deg, color-mix(in oklab, ${accentA} 6%, transparent) 0%, transparent 42%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentA}, ${accentB}, transparent)`,
        }}
        aria-hidden
      />

      <KitTemplateHeroThumbnail
        href={demoHref}
        kitName={kit.name}
        accentA={accentA}
        accentB={accentB}
      />

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <p className="text-[9px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {templateLabel} template
            </p>
            <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              <Link
                href={`/kit/${kit.slug}`}
                className="rounded-sm outline-none transition-colors hover:text-foreground/90 focus-visible:ring-2 focus-visible:ring-ring"
              >
                {kit.name}
              </Link>
            </h2>
          </div>
          <Badge
            variant={kit.status === 'available' ? 'default' : 'outline'}
            className="h-5 shrink-0 px-1.5 text-[10px]"
          >
            {statusLabel(kit.status)}
          </Badge>
        </div>

        <p className="text-pretty text-xs leading-snug text-muted-foreground sm:text-[13px]">
          {kit.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="text-lg font-semibold tabular-nums tracking-tight">
            {kit.priceDisplay}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {kit.promptCount} prompts · {livePages} live{' '}
            {livePages === 1 ? 'page' : 'pages'}
          </span>
          <span className="hidden h-3 w-px bg-border sm:inline" aria-hidden />
          <div className="flex flex-wrap gap-1">
            {kit.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="h-5 border-border/50 bg-muted/20 px-1.5 text-[10px] font-normal text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-0.5 flex flex-col gap-1.5 sm:flex-row">
          <Button asChild size="sm" variant="brand" className="h-8 sm:flex-1">
            <Link href={`/kit/${kit.slug}`} className="group">
              View kit
              <ArrowRightIcon aria-hidden size={14} />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="h-8 sm:flex-1">
            <Link href={demoHref}>Preview template</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
