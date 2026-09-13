'use client';

import { useMemo } from 'react';

import { Context7Prompt } from '@/components/marketing/context7-prompt';
import {
  KitPromptSectionNav,
  type KitPromptSectionNavItem,
} from '@/components/marketing/kits/kit-prompt-section-nav';
import type { KitPrompt } from '@/lib/kits/prompts';

interface KitPromptLibraryProps {
  kitName: string;
  prompts: KitPrompt[];
  title?: string;
  description?: string;
  showHeader?: boolean;
}

function slugifySection(section: string): string {
  return section
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function groupPromptsBySection(prompts: KitPrompt[]) {
  const groups: {
    section: string;
    id: string;
    prompts: KitPrompt[];
  }[] = [];

  const indexBySection = new Map<string, number>();

  for (const prompt of prompts) {
    const existingIndex = indexBySection.get(prompt.section);

    if (existingIndex === undefined) {
      indexBySection.set(prompt.section, groups.length);
      groups.push({
        section: prompt.section,
        id: `kit-prompt-section-${slugifySection(prompt.section)}`,
        prompts: [prompt],
      });
      continue;
    }

    groups[existingIndex].prompts.push(prompt);
  }

  return groups;
}

export function KitPromptLibrary({
  kitName,
  prompts,
  title,
  description,
  showHeader = true,
}: KitPromptLibraryProps) {
  const sectionGroups = useMemo(() => groupPromptsBySection(prompts), [prompts]);
  const heading = title ?? `${kitName} prompts`;
  const lead =
    description ??
    'Context7-style blocks like the docs library. Copy or run with your agent. Replace [BRAND] and [TAGLINE] first.';

  const navSections: KitPromptSectionNavItem[] = useMemo(
    () =>
      sectionGroups.map((group) => ({
        section: group.section,
        id: group.id,
      })),
    [sectionGroups],
  );

  return (
    <div className="space-y-8">
      {showHeader ? (
        <div>
          <h1 className="border-l-2 border-brand pl-3 text-3xl font-semibold tracking-tight">
            {heading}
          </h1>
          <p className="mt-2 text-muted-foreground">{lead}</p>
        </div>
      ) : null}

      <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-x-10 xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-x-12">
        <KitPromptSectionNav sections={navSections} />

        <div className="min-w-0 space-y-14">
          {sectionGroups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              className="scroll-mt-28 space-y-6"
              aria-labelledby={`${group.id}-heading`}
            >
              <h2
                id={`${group.id}-heading`}
                className="text-sm font-medium tracking-tight text-muted-foreground"
              >
                {group.section}
              </h2>

              <div className="space-y-6">
                {group.prompts.map((prompt) => (
                  <div key={prompt.id} className="space-y-2">
                    <Context7Prompt
                      description={prompt.title}
                      actions={['copy', 'agent']}
                    >
                      {prompt.body}
                    </Context7Prompt>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
