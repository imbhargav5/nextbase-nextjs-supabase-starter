'use client';

import Link from 'next/link';

import { Context7Prompt } from '@/components/marketing/context7-prompt';
import { KitCheckoutButton } from '@/components/marketing/kits/kit-checkout-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { KitPrompt } from '@/lib/kits/prompts';

interface KitSectionPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kitSlug: string;
  kitName: string;
  priceDisplay: string;
  sectionTitle: string;
  previewPath: string;
  prompt: KitPrompt | null;
  isOwned: boolean;
}

export function KitSectionPromptDialog({
  open,
  onOpenChange,
  kitSlug,
  kitName,
  priceDisplay,
  sectionTitle,
  previewPath,
  prompt,
  isOwned,
}: KitSectionPromptDialogProps) {
  if (!prompt) {
    return null;
  }

  const description = `Build "${sectionTitle}": ${prompt.title}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,800px)] max-w-3xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1 border-b border-border/60 px-6 py-4 text-left">
          <DialogTitle className="text-base">{prompt.title}</DialogTitle>
          <DialogDescription>
            {prompt.section} · {sectionTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="chrome-scrollbar flex-1 overflow-y-auto px-6 py-4">
          {!isOwned ? (
            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border/70 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Copy and agent actions unlock when you own {kitName}.
              </p>
              <KitCheckoutButton
                kitSlug={kitSlug}
                label={`Get kit (${priceDisplay})`}
              />
            </div>
          ) : null}

          <Context7Prompt
            description={description}
            actions={isOwned ? ['copy', 'agent'] : []}
            className="border-0 shadow-none"
          >
            {prompt.body}
          </Context7Prompt>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 px-6 py-3">
          <Button type="button" variant="ghost" size="sm" asChild>
            <Link href={previewPath} target="_blank" rel="noopener noreferrer">
              View in demo
            </Link>
          </Button>
          {isOwned ? (
            <Button type="button" size="sm" variant="brand" asChild>
              <Link href={`/kit/${kitSlug}/prompts`}>All prompts</Link>
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
