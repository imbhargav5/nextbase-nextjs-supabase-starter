import type { KitDesignTheme } from '@/lib/kits/catalog';

interface KitDesignThemeStripProps {
  theme: KitDesignTheme;
}

export function KitDesignThemeStrip({ theme }: KitDesignThemeStripProps) {
  const swatchSummary = theme.swatches.map((s) => s.label).join(', ');
  const fontLine =
    theme.displayFont && theme.displayFont !== theme.bodyFont
      ? `${theme.bodyFont} · ${theme.displayFont} display`
      : theme.bodyFont;

  return (
    <div className="rounded-md border border-border/50 bg-muted/30 px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Design theme
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] capitalize text-foreground">{theme.mode}</span>
          <span
            className="flex items-center gap-0.5"
            role="img"
            aria-label={swatchSummary}
          >
            {theme.swatches.map((swatch) => (
              <span
                key={swatch.label}
                className="size-2.5 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: swatch.color }}
                title={swatch.label}
              />
            ))}
          </span>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
        <span className="text-foreground">{fontLine}</span>
        {'. '}
        {theme.accentNote}
      </p>
    </div>
  );
}
