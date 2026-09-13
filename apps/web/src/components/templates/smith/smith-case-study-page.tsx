'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

import {
  SMITH_TEMPLATE_BASE,
  getSmithCaseStudy,
  smithProjectSlug,
  smithProjects,
} from '@/components/templates/smith/constants';
import { SmithSectionHeader } from '@/components/templates/smith/smith-section-header';
import { SmithSubpageShell } from '@/components/templates/smith/smith-subpage-shell';
import { smithDisplayClass } from '@/components/templates/smith/smith-theme-provider';
import { cn } from '@/lib/utils';

interface SmithCaseStudyPageProps {
  slug: string;
}

export function SmithCaseStudyPage({ slug }: SmithCaseStudyPageProps) {
  const study = getSmithCaseStudy(slug);

  if (!study) {
    return null;
  }

  const projectIndex = smithProjects.findIndex(
    (p) => smithProjectSlug(p.title) === slug,
  );
  const nextProject =
    smithProjects[(projectIndex + 1) % smithProjects.length] ?? smithProjects[0];
  const nextSlug = smithProjectSlug(nextProject.title);

  const titleParts = study.title.split(' ');
  const heading = titleParts[0] ?? 'Project';
  const headingItalic = titleParts.slice(1).join(' ') || 'story';

  return (
    <SmithSubpageShell>
      <article className="py-12 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
          <SmithSectionHeader
            eyebrow="Case study"
            heading={heading}
            headingItalic={headingItalic}
            subtext="Turn a high-energy brand story into a tactile web experience that still loads fast."
            viewAllHref={`${SMITH_TEMPLATE_BASE}#work`}
            viewAllLabel="All work"
          />

          <div className="mt-6 flex flex-wrap gap-2">
            {study.roleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))] px-3 py-1 text-xs tracking-wide text-[hsl(var(--smith-muted))] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              'group relative mt-8 overflow-hidden rounded-3xl border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))]',
              study.aspect,
            )}
          >
            <Image
              src={study.heroImage}
              alt={`${study.title} hero`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '4px 4px',
              }}
              aria-hidden
            />
          </motion.div>

          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
            <section>
              <h2 className="text-xs tracking-[0.3em] text-[hsl(var(--smith-muted))] uppercase">
                Challenge
              </h2>
              <p className="mt-4 text-base leading-7 text-[hsl(var(--smith-muted))]">
                {study.challenge}
              </p>
            </section>
            <section>
              <h2 className="text-xs tracking-[0.3em] text-[hsl(var(--smith-muted))] uppercase">
                Approach
              </h2>
              <ol className="mt-4 space-y-4">
                {study.approach.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 text-base leading-7 text-[hsl(var(--smith-muted))]"
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--smith-stroke))] text-xs tabular-nums text-[hsl(var(--smith-text))]',
                        smithDisplayClass(),
                      )}
                    >
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="mt-16">
            <h2 className="text-xs tracking-[0.3em] text-[hsl(var(--smith-muted))] uppercase">
              Gallery
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {study.gallery.map((src, index) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className={cn(
                    'relative overflow-hidden rounded-2xl border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))]',
                    index === 0 ? 'aspect-[16/10] sm:col-span-2' : 'aspect-[4/3]',
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 560px"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {study.outcomes.map((outcome) => (
              <div
                key={outcome.label}
                className="rounded-2xl border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))] px-5 py-6 text-center sm:text-left"
              >
                <p
                  className={`text-3xl text-[hsl(var(--smith-text))] md:text-4xl ${smithDisplayClass()}`}
                >
                  {outcome.value}
                </p>
                <p className="mt-2 text-xs tracking-[0.18em] text-[hsl(var(--smith-muted))] uppercase">
                  {outcome.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-6 border-t border-[hsl(var(--smith-stroke))] pt-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] text-[hsl(var(--smith-muted))] uppercase">
                Next project
              </p>
              <Link
                href={`${SMITH_TEMPLATE_BASE}/work/${nextSlug}`}
                className={`mt-2 inline-block text-2xl text-[hsl(var(--smith-text))] transition-colors hover:text-[#89aacc] md:text-3xl ${smithDisplayClass()}`}
              >
                {nextProject.title} →
              </Link>
            </div>
            <Link
              href={`${SMITH_TEMPLATE_BASE}#work`}
              className="text-sm text-[hsl(var(--smith-muted))] underline underline-offset-4 transition-colors hover:text-[hsl(var(--smith-text))]"
            >
              ← All work
            </Link>
          </div>
        </div>
      </article>
    </SmithSubpageShell>
  );
}
