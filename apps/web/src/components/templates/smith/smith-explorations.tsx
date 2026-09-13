'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { smithExplorations } from '@/components/templates/smith/constants';
import { SmithSectionHeader } from '@/components/templates/smith/smith-section-header';

gsap.registerPlugin(ScrollTrigger);

const leftColumn = smithExplorations.filter((_, i) => i % 2 === 0);
const rightColumn = smithExplorations.filter((_, i) => i % 2 === 1);

export function SmithExplorations() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const colLeftRef = useRef<HTMLDivElement>(null);
  const colRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const colLeft = colLeftRef.current;
    const colRight = colRightRef.current;
    if (!section || !pin || !colLeft || !colRight) {
      return;
    }

    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: pin,
      pinSpacing: false,
    });

    const leftTween = gsap.to(colLeft, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    const rightTween = gsap.to(colRight, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      pinTrigger.kill();
      leftTween.scrollTrigger?.kill();
      rightTween.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[300vh] bg-[hsl(var(--smith-bg))]"
    >
      <div
        ref={pinRef}
        className="flex h-screen items-center justify-center"
      >
        <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
          <SmithSectionHeader
            eyebrow="Explorations"
            heading="Visual"
            headingItalic="playground"
            subtext="Experiments in color, motion, and form, shared on Dribbble."
            viewAllLabel="Dribbble"
            viewAllHref="https://dribbble.com"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex justify-center px-6">
        <div className="grid w-full max-w-[1400px] grid-cols-2 gap-12 md:gap-40">
          <div ref={colLeftRef} className="flex flex-col gap-10 pt-24">
            {leftColumn.map((src, i) => (
              <ExplorationCard key={src} src={src} rotation={i % 2 === 0 ? -3 : 2} />
            ))}
          </div>
          <div ref={colRightRef} className="flex flex-col gap-10 pt-48">
            {rightColumn.map((src, i) => (
              <ExplorationCard key={src} src={src} rotation={i % 2 === 0 ? 4 : -2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExplorationCard({
  src,
  rotation,
}: {
  src: string;
  rotation: number;
}) {
  return (
    <div
      className="pointer-events-auto relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-[hsl(var(--smith-stroke))]"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <Image src={src} alt="" fill className="object-cover" sizes="320px" />
    </div>
  );
}
