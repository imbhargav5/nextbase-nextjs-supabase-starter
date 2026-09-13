'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

import { smithDisplayClass } from '@/components/templates/smith/smith-theme-provider';

interface SmithSectionHeaderProps {
  eyebrow: string;
  heading: string;
  headingItalic: string;
  subtext: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function SmithSectionHeader({
  eyebrow,
  heading,
  headingItalic,
  subtext,
  viewAllHref = '#',
  viewAllLabel = 'View all',
}: SmithSectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[hsl(var(--smith-stroke))]" aria-hidden />
          <span className="text-xs tracking-[0.3em] text-[hsl(var(--smith-muted))] uppercase">
            {eyebrow}
          </span>
        </div>
        <h2 className="text-3xl tracking-tight text-[hsl(var(--smith-text))] md:text-4xl">
          {heading}{' '}
          <span className={smithDisplayClass()}>{headingItalic}</span>
        </h2>
        <p className="mt-3 max-w-lg text-sm text-[hsl(var(--smith-muted))] md:text-base">
          {subtext}
        </p>
      </div>
      {viewAllLabel ? (
        <Link
          href={viewAllHref}
          className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[hsl(var(--smith-stroke))] px-5 py-2.5 text-sm text-[hsl(var(--smith-text))] transition-colors hover:border-transparent hover:ring-2 hover:ring-[#89aacc] md:inline-flex"
        >
          <span>{viewAllLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      ) : null}
    </motion.header>
  );
}
