'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KitSectionPromptDialog } from '@/components/marketing/kits/kit-section-prompt-dialog';
import type { KitProduct, KitTemplatePageStatus } from '@/lib/kits/catalog';
import { getPrimaryTemplateDemoPath } from '@/lib/kits/catalog';
import { getKitPromptById } from '@/lib/kits/prompts';

function statusLabel(status: KitTemplatePageStatus) {
  switch (status) {
    case 'live':
      return 'Live';
    case 'scaffold':
      return 'Scaffold';
    case 'coming-soon':
      return 'Coming soon';
  }
}

function statusVariant(
  status: KitTemplatePageStatus,
): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'live':
      return 'default';
    case 'scaffold':
      return 'secondary';
    case 'coming-soon':
      return 'outline';
  }
}

interface KitTemplateExplorerProps {
  kit: KitProduct;
  isOwned?: boolean;
  showActions?: boolean;
}

export function KitTemplateExplorer({
  kit,
  isOwned = false,
  showActions = false,
}: KitTemplateExplorerProps) {
  const defaultOpen = kit.templatePages
    .filter((p) => p.status === 'live')
    .map((p) => p.path);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<{
    title: string;
    promptId: string;
    previewPath: string;
  } | null>(null);

  const activePrompt =
    activeSection &&
    getKitPromptById(kit.slug, activeSection.promptId);

  function handleOpenSection(
    sectionTitle: string,
    promptId: string,
    previewPath: string,
  ) {
    setActiveSection({ title: sectionTitle, promptId, previewPath });
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <Accordion
        type="multiple"
        defaultValue={defaultOpen.length > 0 ? defaultOpen : [kit.templatePages[0]?.path]}
        className="rounded-lg border border-border/60 px-3"
      >
        {kit.templatePages.map((page) => (
          <AccordionItem key={page.path} value={page.path} className="border-border/50">
            <AccordionTrigger className="py-3 text-sm hover:no-underline">
              <div className="flex flex-1 flex-wrap items-center gap-2 pr-2 text-left">
                <span className="font-medium text-foreground">{page.title}</span>
                <Badge variant={statusVariant(page.status)} className="text-[10px] px-1.5 py-0">
                  {statusLabel(page.status)}
                </Badge>
                <span className="w-full text-xs font-normal text-muted-foreground sm:w-auto">
                  {page.path}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-0">
              <p className="mb-3 text-xs text-muted-foreground">{page.description}</p>
              <ul className="grid gap-1 sm:grid-cols-2">
                {page.sections.map((section) => (
                  <li key={`${page.path}-${section.title}`}>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenSection(
                          section.title,
                          section.promptId,
                          page.path,
                        )
                      }
                      className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <FileText
                        className="mr-2 size-3 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
              {page.status !== 'coming-soon' ? (
                <Button asChild size="sm" variant="outline" className="mt-3 h-8 text-xs">
                  <Link href={page.path}>Open page</Link>
                </Button>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {showActions ? (
        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm" variant="brand">
            <Link href={`/kit/${kit.slug}`}>View kit</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={getPrimaryTemplateDemoPath(kit)}>Main demo</Link>
          </Button>
        </div>
      ) : null}

      <KitSectionPromptDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        kitSlug={kit.slug}
        kitName={kit.name}
        priceDisplay={kit.priceDisplay}
        sectionTitle={activeSection?.title ?? ''}
        previewPath={activeSection?.previewPath ?? getPrimaryTemplateDemoPath(kit)}
        prompt={activePrompt ?? null}
        isOwned={isOwned}
      />
    </div>
  );
}
