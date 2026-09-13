'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  smithProjectSlug,
  smithProjects,
} from '@/components/templates/smith/constants';
import { SmithSectionHeader } from '@/components/templates/smith/smith-section-header';
import { smithDisplayClass } from '@/components/templates/smith/smith-theme-provider';

export function SmithWorks() {
  return (
    <section
      id="work"
      className="bg-[hsl(var(--smith-bg))] py-12 md:py-16"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SmithSectionHeader
          eyebrow="Selected Work"
          heading="Featured"
          headingItalic="projects"
          subtext="A selection of projects I've worked on, from concept to launch."
          viewAllLabel="View all work"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {smithProjects.map((project) => (
            <Link
              key={project.title}
              href={`/templates/smith/work/${smithProjectSlug(project.title)}`}
              className={`group relative block overflow-hidden rounded-3xl border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface))] ${project.span} ${project.aspect}`}
            >
              <Image
                src={project.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
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
              <div
                className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--smith-bg)/0.7)] opacity-0 backdrop-blur-lg transition-opacity duration-300 group-hover:opacity-100"
              >
                <span
                  className="rounded-full border border-[hsl(var(--smith-stroke))] bg-white px-5 py-2 text-sm text-[hsl(var(--smith-bg))]"
                >
                  View:{' '}
                  <span className={smithDisplayClass()}>{project.title}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
