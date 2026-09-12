'use client';

import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { motion, type Variants } from 'motion/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

import {
  nguyenAgentAccordionItems,
  nguyenMentionAgents,
  nguyenSolutionSections,
  nguyenThreadSummary,
} from './data';

const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    filter: 'blur(8px)',
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: index * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const reversedSectionIds = new Set(['ai-work']);

function SolutionCopy({
  eyebrow,
  title,
  description,
  links,
  animationIndex,
}: {
  eyebrow: string;
  title: string;
  description: string;
  links: readonly string[];
  animationIndex: number;
}) {
  return (
    <motion.div
      custom={animationIndex}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35, margin: '0px 0px -100px 0px' }}
      variants={revealVariants}
      className="space-y-5"
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
      {links.length > 0 ? (
        <ul className="space-y-2 pt-1">
          {links.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="group inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                {link}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}

function MentionMockup() {
  return (
    <motion.div
      custom={1}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={revealVariants}
      className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-lg shadow-foreground/5 backdrop-blur sm:p-5"
    >
      <div className="rounded-lg border border-border/60 bg-background/80 p-3">
        <p className="text-sm text-muted-foreground">
          Summarize <span className="text-foreground">#standup</span>, route to{' '}
          <span className="rounded bg-primary/10 px-1 text-primary">@</span>
        </p>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-border/60 bg-background">
        <div className="border-b border-border/60 px-3 py-2 text-xs text-muted-foreground">
          Claude Agent · Route & summarize
        </div>
        <div className="space-y-1 p-2">
          {nguyenMentionAgents.map((agent, index) => (
            <div
              key={agent.id}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-sm',
                index === 0 ? 'bg-muted' : 'hover:bg-muted/50',
              )}
            >
              <div>
                <p className="font-medium">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.provider}</p>
              </div>
              {index === 0 ? (
                <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium">
                  Tab
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border/60 px-3 py-2 text-[10px] text-muted-foreground">
          <span>#standup · 42 msgs Thread</span>
          <span>4 agents available</span>
        </div>
        <div className="border-t border-border/60 px-3 py-2 text-[10px] text-muted-foreground">
          ↑↓ to navigate
        </div>
      </div>
    </motion.div>
  );
}

function AssistantMockup() {
  const completedCount = nguyenThreadSummary.actionItems.filter((item) => item.done).length;
  const totalCount = nguyenThreadSummary.actionItems.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div
      custom={1}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={revealVariants}
      className="space-y-4"
    >
      <div className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-lg shadow-foreground/5 backdrop-blur sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Thread Summary
        </div>
        <p className="text-sm leading-6">{nguyenThreadSummary.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {nguyenThreadSummary.sources.map((source) => (
            <span
              key={source}
              className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-[10px] text-muted-foreground"
            >
              {source}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground">Generated by AI · just now</p>
      </div>

      <div className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-lg shadow-foreground/5 backdrop-blur sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Action Items</p>
            <p className="text-xs text-muted-foreground">AI extracted</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {completedCount} of {totalCount} complete {progress}%
          </p>
        </div>
        <ul className="space-y-2">
          {nguyenThreadSummary.actionItems.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 rounded-md border border-border/60 bg-background/70 px-3 py-2 text-sm"
            >
              <span
                className={cn(
                  'flex size-4 items-center justify-center rounded-full border',
                  item.done
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-transparent',
                )}
              >
                <Check className="size-2.5" aria-hidden="true" />
              </span>
              <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function AgentsAccordion() {
  return (
    <motion.div
      custom={1}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={revealVariants}
      className="rounded-xl border border-border/70 bg-card/80 shadow-lg shadow-foreground/5 backdrop-blur"
    >
      <Accordion type="single" collapsible defaultValue="gemini" className="px-4 sm:px-5">
        {nguyenAgentAccordionItems.map((agent) => (
          <AccordionItem key={agent.id} value={agent.id} className="border-border/60">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="text-left">
                <p className="text-sm font-semibold">{agent.title}</p>
                <p className="text-xs text-muted-foreground">{agent.subtitle}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-sm leading-6 text-muted-foreground">{agent.description}</p>
              <div className="mt-4 space-y-2">
                {agent.tasks.map((task) => (
                  <div
                    key={task.title}
                    className="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-background/70 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{task.counts}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}

function SolutionVisual({ sectionId }: { sectionId: string }) {
  if (sectionId === 'smart-context') {
    return <MentionMockup />;
  }

  if (sectionId === 'ai-work') {
    return <AssistantMockup />;
  }

  return <AgentsAccordion />;
}

export function NguyenSolution() {
  return (
    <section id="solution" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white/[0.03] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
      />

      <div className="relative mx-auto max-w-7xl space-y-24 sm:space-y-32">
        {nguyenSolutionSections.map((section, index) => {
          const reversed = reversedSectionIds.has(section.id);
          const isAgentsRow = section.id === 'autonomous-agents';

          return (
            <div
              key={section.id}
              className={cn(
                'grid items-center gap-10 lg:gap-16',
                isAgentsRow
                  ? 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'
                  : 'lg:grid-cols-2',
              )}
            >
              <div className={cn(reversed ? 'lg:order-2' : 'lg:order-1')}>
                <SolutionCopy
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                  links={section.seeAlso}
                  animationIndex={index * 2}
                />
              </div>

              <div className={cn(reversed ? 'lg:order-1' : 'lg:order-2')}>
                <SolutionVisual sectionId={section.id} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
