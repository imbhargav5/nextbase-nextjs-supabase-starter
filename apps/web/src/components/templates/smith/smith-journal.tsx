'use client';

import Image from 'next/image';
import Link from 'next/link';

import { smithJournal } from '@/components/templates/smith/constants';
import { SmithSectionHeader } from '@/components/templates/smith/smith-section-header';

export function SmithJournal() {
  return (
    <section className="bg-[hsl(var(--smith-bg))] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SmithSectionHeader
          eyebrow="Journal"
          heading="Recent"
          headingItalic="thoughts"
          subtext="Notes on craft, systems, and the work in between."
          viewAllLabel="View all"
        />

        <ul className="flex flex-col gap-4">
          {smithJournal.map((entry) => (
            <li key={entry.title}>
              <Link
                href="#"
                className="flex flex-col gap-4 rounded-[40px] border border-[hsl(var(--smith-stroke))] bg-[hsl(var(--smith-surface)/0.3)] p-4 transition-colors hover:bg-[hsl(var(--smith-surface))] sm:flex-row sm:items-center sm:gap-6 sm:rounded-full"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:rounded-full">
                  <Image
                    src={entry.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-[hsl(var(--smith-text))]">
                    {entry.title}
                  </p>
                  <p className="mt-1 text-xs text-[hsl(var(--smith-muted))]">
                    {entry.readTime} · {entry.date}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
