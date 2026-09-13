'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';

import { NguyenSubpageShell } from '@/components/templates/nguyen/nguyen-subpage-shell';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ChangelogTag = 'Feature' | 'Improvement' | 'Fix';

const tagStyles: Record<ChangelogTag, string> = {
  Feature:
    'border-primary/25 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15',
  Improvement:
    'border-border bg-secondary text-secondary-foreground',
  Fix: 'border-border bg-muted text-muted-foreground',
};

const entries: {
  date: string;
  tag: ChangelogTag;
  title: string;
  body: string;
}[] = [
  {
    date: '2026-03-01',
    tag: 'Feature',
    title: 'Workspace routing for multi-model tasks',
    body: 'Route work to the right model with team-level policies and audit logs.',
  },
  {
    date: '2026-02-18',
    tag: 'Feature',
    title: 'SOC 2 report download in settings',
    body: 'Admins can export the latest attestation package without contacting support.',
  },
  {
    date: '2026-02-12',
    tag: 'Improvement',
    title: 'Faster agent handoffs',
    body: 'Reduced latency when agents pass context between steps.',
  },
  {
    date: '2026-01-28',
    tag: 'Improvement',
    title: 'Changelog RSS feed',
    body: 'Subscribe in your reader of choice. Entries mirror the public feed.',
  },
  {
    date: '2026-01-20',
    tag: 'Fix',
    title: 'Billing portal timezone display',
    body: 'Invoices now respect the workspace default timezone.',
  },
  {
    date: '2025-12-05',
    tag: 'Fix',
    title: 'SSO session refresh on Safari',
    body: 'Enterprise customers stay signed in across tab restores.',
  },
];

const filterOptions: { label: string; value: ChangelogTag | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Features', value: 'Feature' },
  { label: 'Improvements', value: 'Improvement' },
  { label: 'Fixes', value: 'Fix' },
];

function formatChangelogDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${iso}T12:00:00`));
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.06,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function NguyenChangelogPage() {
  const [activeFilter, setActiveFilter] = useState<ChangelogTag | 'all'>('all');

  const filteredEntries = useMemo(() => {
    if (activeFilter === 'all') {
      return entries;
    }
    return entries.filter((entry) => entry.tag === activeFilter);
  }, [activeFilter]);

  return (
    <NguyenSubpageShell>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-sm font-medium tracking-tight text-primary">
            Product updates
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
            Changelog
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">
            What shipped in [BRAND]: features, improvements, and fixes your
            team can count on.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <label className="sr-only" htmlFor="changelog-email">
            Email for product updates
          </label>
          <input
            id="changelog-email"
            type="email"
            placeholder="you@company.com"
            className="h-10 w-full max-w-xs rounded-full border border-border bg-card px-4 text-sm text-foreground shadow-sm outline-none ring-ring transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 sm:w-64"
          />
          <button
            type="button"
            className="h-10 shrink-0 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            Subscribe
          </button>
        </div>

        <div
          className="mt-10 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filter changelog by type"
        >
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(option.value)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <ul className="mt-10 space-y-5">
          {filteredEntries.map((entry, index) => (
            <motion.li
              key={`${entry.date}-${entry.title}`}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
            >
              <article className="rounded-md border bg-card px-5 py-5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
                <div className="flex flex-wrap items-center gap-2">
                  <time
                    dateTime={entry.date}
                    className="text-sm tabular-nums text-muted-foreground"
                  >
                    {formatChangelogDate(entry.date)}
                  </time>
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      tagStyles[entry.tag],
                    )}
                  >
                    {entry.tag}
                  </Badge>
                </div>
                <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground">
                  {entry.title}
                </h2>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  {entry.body}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>

        {filteredEntries.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            No entries in this category yet.
          </p>
        ) : null}

        <p className="mt-12 text-center text-sm text-muted-foreground">
          <Link
            href="/templates/nguyen"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            ← Back to marketing site
          </Link>
        </p>
      </div>
    </NguyenSubpageShell>
  );
}
