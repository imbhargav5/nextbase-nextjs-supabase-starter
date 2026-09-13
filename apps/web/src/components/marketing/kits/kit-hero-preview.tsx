'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { MAC_SCREEN_INSET, Mac } from '@/components/ui/mac';
import {
  KIT_PREVIEW_HEIGHT,
  KIT_PREVIEW_WIDTH,
} from '@/lib/kits/preview-frame';

interface KitHeroPreviewProps {
  href: string;
  kitName: string;
}

export function KitHeroPreview({ href, kitName }: KitHeroPreviewProps) {
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
    <div className="min-w-0">
      <Link
        href={href}
        className="group relative block aspect-[6/5] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Preview ${kitName} hero, open live demo`}
      >
        <Mac className="h-full w-full text-muted" aria-hidden />
        <div
          ref={screenRef}
          className="absolute overflow-hidden bg-background"
          style={{
            left: `${MAC_SCREEN_INSET.left}%`,
            top: `${MAC_SCREEN_INSET.top}%`,
            width: `${MAC_SCREEN_INSET.width}%`,
            height: `${MAC_SCREEN_INSET.height}%`,
          }}
        >
          <iframe
            title={`${kitName} hero preview`}
            src={frameSrc}
            tabIndex={-1}
            scrolling="no"
            className="pointer-events-none absolute top-0 left-0 border-0 bg-background [scrollbar-width:none]"
            style={{
              width: KIT_PREVIEW_WIDTH,
              height: KIT_PREVIEW_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
          <div
            className="absolute inset-0 ring-1 ring-inset ring-black/5 transition-colors group-hover:bg-foreground/[0.02]"
            aria-hidden
          />
        </div>
      </Link>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Hero preview · click to open full demo
      </p>
    </div>
  );
}
