'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { KIT_PREVIEW_HEIGHT, KIT_PREVIEW_WIDTH } from '@/lib/kits/preview-frame';
import { cn } from '@/lib/utils';

interface KitTemplateHeroThumbnailProps {
  href: string;
  kitName: string;
  accentA: string;
  accentB: string;
  className?: string;
}

export function KitTemplateHeroThumbnail({
  href,
  kitName,
  accentA,
  accentB,
  className,
}: KitTemplateHeroThumbnailProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const node = screenRef.current;
    if (!node) {
      return;
    }

    function updateScale() {
      const width = node?.clientWidth ?? KIT_PREVIEW_WIDTH;
      setScale(width / KIT_PREVIEW_WIDTH);
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const frameSrc = `${href}${href.includes('?') ? '&' : '?'}frame=1`;

  return (
    <Link
      href={href}
      className={cn(
        'group/thumb relative block aspect-[16/10] w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
        className,
      )}
      aria-label={`Preview ${kitName} hero, open live demo`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover/thumb:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, ${accentA} 28%, transparent) 0%, transparent 55%),
            radial-gradient(80% 60% at 100% 100%, color-mix(in oklab, ${accentB} 18%, transparent) 0%, transparent 50%)`,
        }}
        aria-hidden
      />
      <div
        ref={screenRef}
        className="absolute inset-0 overflow-hidden bg-muted/40"
      >
        <iframe
          title={`${kitName} hero thumbnail`}
          src={frameSrc}
          tabIndex={-1}
          loading="lazy"
          scrolling="no"
          className="pointer-events-none absolute top-0 left-0 border-0 bg-background [scrollbar-width:none]"
          style={{
            width: KIT_PREVIEW_WIDTH,
            height: KIT_PREVIEW_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 transition-colors group-hover/thumb:ring-white/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/90 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100"
      >
        Live preview
      </span>
    </Link>
  );
}
