'use client';

import { Check, ChevronDown, Copy, Sparkles } from 'lucide-react';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { PromptMarkdown } from '@/components/marketing/prompt-markdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Context7PromptAction = 'copy' | 'agent';

const PROMPT_BODY_COLLAPSED_PX = 240;
const PROMPT_BODY_EXPANDED_MAX = 'min(60vh, 36rem)';

export interface Context7PromptProps {
  description: string;
  actions?: Context7PromptAction[];
  children: string;
  className?: string;
}

export function Context7Prompt({
  description,
  actions = ['copy'],
  children,
  className,
}: Context7PromptProps) {
  const [copied, setCopied] = useState(false);
  const [agentCopied, setAgentCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const bodyId = useId();
  const promptText = children.trim();
  const showCopy = actions.includes('copy');
  const showAgent = actions.includes('agent');

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) {
      return;
    }

    function updateCanExpand() {
      if (!measureRef.current) {
        return;
      }
      setCanExpand(
        measureRef.current.scrollHeight > PROMPT_BODY_COLLAPSED_PX + 4,
      );
    }

    updateCanExpand();

    const observer = new ResizeObserver(updateCanExpand);
    observer.observe(node);

    return () => observer.disconnect();
  }, [promptText]);

  async function copyPromptText(successMessage: string) {
    try {
      await navigator.clipboard.writeText(promptText);
      toast.success(successMessage);
      return true;
    } catch {
      toast.error('Could not copy to clipboard');
      return false;
    }
  }

  async function handleCopy() {
    const ok = await copyPromptText('Prompt copied');
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleUseWithAgent() {
    const ok = await copyPromptText('Copied. Paste into your coding agent.');
    if (ok) {
      setAgentCopied(true);
      window.setTimeout(() => setAgentCopied(false), 2000);
    }
  }

  function handleToggleExpanded() {
    setExpanded((current) => !current);
  }

  const showCollapseHint = canExpand && !expanded;
  const showExpandControls = canExpand && expanded;

  return (
    <div
      className={cn(
        'rounded-xl border border-border/70 bg-card text-card-foreground shadow-none',
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2">
          <Sparkles
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-sm font-medium leading-snug">{description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {showCopy ? (
            <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              Copy
            </Button>
          ) : null}
          {showAgent ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleUseWithAgent}
            >
              {agentCopied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              Use with agent
            </Button>
          ) : null}
        </div>
      </div>

      <div className="relative">
        <div
          ref={measureRef}
          className={cn(
            'chrome-scrollbar overflow-x-auto p-4 transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none sm:p-5',
            expanded ? 'overflow-y-auto' : 'overflow-hidden',
          )}
          style={{
            maxHeight: expanded
              ? PROMPT_BODY_EXPANDED_MAX
              : `${PROMPT_BODY_COLLAPSED_PX}px`,
          }}
          id={bodyId}
        >
          <PromptMarkdown content={promptText} />
        </div>

        {showCollapseHint ? (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-card from-20% via-card/95 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-4 bottom-10 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent opacity-90 sm:inset-x-6"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={handleToggleExpanded}
              aria-expanded={false}
              aria-controls={bodyId}
              className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1.5 pb-3 pt-10 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <span>See more</span>
              <ChevronDown className="size-3.5 opacity-70" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {showExpandControls ? (
        <button
          type="button"
          onClick={handleToggleExpanded}
          aria-expanded={true}
          className="flex w-full items-center justify-center gap-1.5 border-t border-border/60 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <span>Show less</span>
          <ChevronDown
            className="size-3.5 rotate-180 opacity-70"
            aria-hidden="true"
          />
        </button>
      ) : null}
    </div>
  );
}
