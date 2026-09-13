'use client';

import gsap from 'gsap';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { smithRoles } from '@/components/templates/smith/constants';
import { SmithHlsVideo } from '@/components/templates/smith/smith-hls-video';
import { SmithHeader } from '@/components/templates/smith/smith-header';
import { smithDisplayClass } from '@/components/templates/smith/smith-theme-provider';
export function SmithHero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % smithRoles.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.smith-name-reveal',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1, ease: 'power3.out' },
      );
      gsap.fromTo(
        '.smith-blur-in',
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          delay: 0.3,
          stagger: 0.1,
          ease: 'power3.out',
        },
      );
    });
    return () => ctx.revert();
  }, []);

  const role = smithRoles[roleIndex];

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <SmithHlsVideo />
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div
          className="absolute right-0 bottom-0 left-0 h-48 bg-gradient-to-t from-[hsl(var(--smith-bg))] to-transparent"
          aria-hidden
        />
      </div>

      <SmithHeader />

      <div className="relative z-10 flex max-w-4xl flex-col items-center px-6 text-center">
        <p
          className="smith-blur-in mb-8 text-xs tracking-[0.3em] text-[hsl(var(--smith-muted))] uppercase"
        >
          Collection &apos;26
        </p>
        <h1
          className={`smith-name-reveal mb-6 text-6xl leading-[0.9] tracking-tight text-[hsl(var(--smith-text))] md:text-8xl lg:text-9xl ${smithDisplayClass()}`}
        >
          Michael Smith
        </h1>
        <p className="smith-blur-in mb-12 text-sm text-[hsl(var(--smith-muted))] md:text-base">
          A{' '}
          <span
            key={roleIndex}
            className={`inline-block text-[hsl(var(--smith-text))] ${smithDisplayClass()} animate-smith-role-fade-in`}
          >
            {role}
          </span>{' '}
          lives in Chicago.
        </p>
        <p className="smith-blur-in mb-12 max-w-md text-sm text-[hsl(var(--smith-muted))] md:text-base">
          Designing seamless digital interactions by focusing on the unique
          nuances which bring systems to life.
        </p>
        <div className="smith-blur-in inline-flex flex-wrap justify-center gap-4">
          <Link
            href="#work"
            className="rounded-full bg-[hsl(var(--smith-text))] px-7 py-3.5 text-sm text-[hsl(var(--smith-bg))] transition-transform hover:scale-105 hover:bg-[hsl(var(--smith-bg))] hover:text-[hsl(var(--smith-text))] hover:ring-2 hover:ring-[#89aacc]"
          >
            See Works
          </Link>
          <Link
            href="#contact"
            className="rounded-full border-2 border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-bg))] px-7 py-3.5 text-sm text-[hsl(var(--smith-text))] transition-transform hover:scale-105 hover:border-transparent hover:ring-2 hover:ring-[#4e85bf]"
          >
            Reach out...
          </Link>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden
      >
        <span className="text-xs tracking-[0.2em] text-[hsl(var(--smith-muted))] uppercase">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-[hsl(var(--smith-stroke))]">
          <div className="absolute top-0 left-0 h-1/2 w-full smith-accent-gradient animate-smith-scroll-down" />
        </div>
      </div>
    </section>
  );
}
