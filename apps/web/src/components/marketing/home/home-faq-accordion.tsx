'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface HomeFaqItem {
  question: string;
  answer: string;
}

interface HomeFaqAccordionProps {
  items: HomeFaqItem[];
}

export function HomeFaqAccordion({ items }: HomeFaqAccordionProps) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className="mt-10 w-full divide-y divide-border/80 rounded-xl border border-border/60 bg-card/40"
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item key={item.question} value={`faq-${index}`}>
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                'flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium',
                'text-foreground/90 outline-none transition-colors hover:text-foreground',
                'focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset',
                'data-[state=open]:text-foreground',
                '[&[data-state=open]>svg]:rotate-180',
              )}
            >
              <span className="text-pretty">{item.question}</span>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
                aria-hidden
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content
            className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
          >
            <div className="px-5 pb-4 pt-0 text-sm leading-7 text-muted-foreground">
              {item.answer}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
