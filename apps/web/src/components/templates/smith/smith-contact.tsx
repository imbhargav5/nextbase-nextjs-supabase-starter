'use client';

import gsap from 'gsap';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { SmithHlsVideo } from '@/components/templates/smith/smith-hls-video';

const MARQUEE_TEXT = 'BUILDING THE FUTURE • ';

export function SmithContact() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[hsl(var(--smith-bg))] pt-16 pb-8 md:pt-20 md:pb-12"
    >
      <div className="absolute inset-0">
        <SmithHlsVideo flipVertical />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
      </div>

      <div className="relative z-10 overflow-hidden py-8">
        <div ref={trackRef} className="flex w-max whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="px-4 text-4xl tracking-tight text-[hsl(var(--smith-text)/0.15)] md:text-6xl"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-16">
        <Link
          href="mailto:hello@michaelsmith.com"
          className="rounded-full border-2 border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))] px-8 py-4 text-lg text-[hsl(var(--smith-text))] transition-transform hover:scale-105 hover:border-transparent hover:ring-2 hover:ring-[#89aacc]"
        >
          hello@michaelsmith.com
        </Link>
      </div>

      <div
        className="relative z-10 flex flex-col items-center justify-between gap-4 border-t border-[hsl(var(--smith-stroke))] px-6 py-6 text-xs text-[hsl(var(--smith-muted))] sm:flex-row"
      >
        <div className="flex flex-wrap justify-center gap-4">
          {['Twitter', 'LinkedIn', 'Dribbble', 'GitHub'].map((label) => (
            <Link
              key={label}
              href="#"
              className="hover:text-[hsl(var(--smith-text))]"
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="flex items-center gap-2">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"
            aria-hidden
          />
          Available for projects
        </p>
      </div>
    </footer>
  );
}
