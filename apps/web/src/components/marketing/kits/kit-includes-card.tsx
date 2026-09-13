import { KitDesignThemeStrip } from '@/components/marketing/kits/kit-design-theme';
import type { KitProduct } from '@/lib/kits/catalog';
import { cn } from '@/lib/utils';

interface KitIncludesCardProps {
  kit: KitProduct;
  className?: string;
}

function splitIncludeLine(item: string): { lead: string; detail?: string } {
  const colon = item.indexOf(': ');
  if (colon === -1) {
    return { lead: item };
  }
  return {
    lead: item.slice(0, colon),
    detail: item.slice(colon + 2),
  };
}

export function KitIncludesCard({ kit, className }: KitIncludesCardProps) {
  const accentA = kit.designTheme.swatches.at(-2)?.color ?? 'var(--primary)';
  const accentB = kit.designTheme.swatches.at(-1)?.color ?? 'var(--primary)';
  const livePages = kit.templatePages.filter((p) => p.status === 'live').length;
  const scaffoldPages = kit.templatePages.filter(
    (p) => p.status === 'scaffold',
  ).length;

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card px-4 py-4 shadow-sm sm:px-5 sm:py-5 lg:aspect-[6/5]',
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(160deg, color-mix(in oklab, ${accentA} 8%, transparent) 0%, transparent 55%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentA}, transparent)`,
        }}
        aria-hidden
      />

      <p className="text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        Included in this kit
      </p>
      <p className="mt-1.5 text-sm font-medium text-foreground">What you ship</p>

      <ul className="mt-3 space-y-2.5">
        {kit.includes.map((item) => {
          const { lead, detail } = splitIncludeLine(item);
          return (
            <li key={item} className="flex gap-2.5">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${accentA}, ${accentB})`,
                }}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-xs font-medium leading-snug text-foreground">
                  {lead}
                </p>
                {detail ? (
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    {detail}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <dl className="mt-4 flex flex-wrap gap-2">
        <div className="rounded-md border border-border/50 bg-muted/30 px-2.5 py-1">
          <dt className="sr-only">Prompts</dt>
          <dd className="text-[11px] text-foreground">
            <span className="font-semibold tabular-nums">{kit.promptCount}</span>
            <span className="text-muted-foreground"> prompts</span>
          </dd>
        </div>
        <div className="rounded-md border border-border/50 bg-muted/30 px-2.5 py-1">
          <dt className="sr-only">Pages</dt>
          <dd className="text-[11px] text-foreground">
            <span className="font-semibold tabular-nums">{livePages}</span>
            <span className="text-muted-foreground"> live</span>
            {scaffoldPages > 0 ? (
              <span className="text-muted-foreground">
                {' '}
                · {scaffoldPages} scaffold
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      <div className="mt-3">
        <KitDesignThemeStrip theme={kit.designTheme} />
      </div>
    </div>
  );
}
