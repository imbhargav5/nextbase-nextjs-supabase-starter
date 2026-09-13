'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

import {
  SMITH_TEMPLATE_BASE,
  smithStats,
} from '@/components/templates/smith/constants';
import { SmithSectionHeader } from '@/components/templates/smith/smith-section-header';
import { SmithSubpageShell } from '@/components/templates/smith/smith-subpage-shell';
import { smithDisplayClass } from '@/components/templates/smith/smith-theme-provider';

const capabilities: { title: string; detail: string }[] = [
  {
    title: 'Brand systems',
    detail: 'Identity, type, and motion rules that scale across teams.',
  },
  {
    title: 'Product design',
    detail: 'Flows, prototypes, and critique-ready specs for ship dates.',
  },
  {
    title: 'Design engineering',
    detail: 'React, Tailwind, and performance budgets in the same sprint.',
  },
  {
    title: 'Motion direction',
    detail: 'Hero moments, scroll choreography, and reduced-motion fallbacks.',
  },
  {
    title: 'Frontend architecture',
    detail: 'Design tokens, component libraries, and CI-friendly previews.',
  },
  {
    title: 'Design ops',
    detail: 'Handoff rituals, documentation, and partner onboarding.',
  },
];

const collaborators = [
  'Northwind Labs',
  'Studio Meridian',
  'Helix Mobility',
  'Archive Co.',
  'Signal Works',
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export function SmithAboutPage() {
  return (
    <SmithSubpageShell>
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-start lg:gap-14">
            <SmithSectionHeader
              eyebrow="About"
              heading="Michael"
              headingItalic="Smith"
              subtext="Designer and engineer building cinematic interfaces for teams who care about craft. Based in Chicago; available for select product and brand partnerships."
              viewAllHref={`${SMITH_TEMPLATE_BASE}#work`}
              viewAllLabel="See selected work"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))] lg:mt-8"
            >
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                alt="Portrait of Michael Smith"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 340px"
                priority
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
                aria-hidden
              />
            </motion.div>
          </div>

          <div className="mt-10 max-w-3xl space-y-4 text-base leading-7 text-[hsl(var(--smith-muted))]">
            <p>
              I partner with founders and creative directors when the story has
              to land on the web with the same conviction as a film title
              sequence: fast loads, accessible motion, and a system your team
              can extend after launch.
            </p>
            <p>
              Recent work spans automotive campaigns, architecture studios, and
              hardware launches. Every engagement ships with documented tokens,
              component specs, and a critique recording your stakeholders can
              share internally.
            </p>
          </div>

          <div className="mb-14 mt-12 grid grid-cols-1 gap-6 border-y border-[hsl(var(--smith-stroke))] py-10 sm:grid-cols-3">
            {smithStats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p
                  className={`text-3xl text-[hsl(var(--smith-text))] md:text-4xl ${smithDisplayClass()}`}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-xs tracking-[0.2em] text-[hsl(var(--smith-muted))] uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-3">
            <span
              className="h-px w-8 bg-[hsl(var(--smith-stroke))]"
              aria-hidden
            />
            <span className="text-xs tracking-[0.3em] text-[hsl(var(--smith-muted))] uppercase">
              Collaborators
            </span>
          </div>
          <ul className="mb-12 flex flex-wrap gap-2">
            {collaborators.map((name) => (
              <li key={name}>
                <span className="inline-block rounded-full border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))] px-4 py-2 text-xs text-[hsl(var(--smith-muted))]">
                  {name}
                </span>
              </li>
            ))}
          </ul>

          <div className="mb-4 flex items-center gap-3">
            <span
              className="h-px w-8 bg-[hsl(var(--smith-stroke))]"
              aria-hidden
            />
            <span className="text-xs tracking-[0.3em] text-[hsl(var(--smith-muted))] uppercase">
              Capabilities
            </span>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item, index) => (
              <motion.li
                key={item.title}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
              >
                <div className="group h-full rounded-3xl border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))] px-5 py-5 transition-colors hover:border-transparent hover:ring-2 hover:ring-[#89aacc]">
                  <p className="text-sm font-medium text-[hsl(var(--smith-text))]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-[hsl(var(--smith-muted))]">
                    {item.detail}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`${SMITH_TEMPLATE_BASE}#contact`}
              className="smith-gradient-border relative rounded-full"
            >
              <span className="relative z-10 inline-flex rounded-full bg-[hsl(var(--smith-text))] px-7 py-3.5 text-sm text-[hsl(var(--smith-bg))] transition-transform hover:scale-[1.02]">
                Work together
              </span>
            </Link>
            <Link
              href={SMITH_TEMPLATE_BASE}
              className="text-sm text-[hsl(var(--smith-muted))] underline underline-offset-4 transition-colors hover:text-[hsl(var(--smith-text))]"
            >
              ← Portfolio home
            </Link>
          </div>
        </div>
      </section>
    </SmithSubpageShell>
  );
}
