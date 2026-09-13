'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export interface KitPromptSectionNavItem {
  section: string;
  id: string;
}

interface KitPromptSectionNavProps {
  sections: KitPromptSectionNavItem[];
}

export function KitPromptSectionNav({ sections }: KitPromptSectionNavProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    const elements = sections
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );

        const nextId = intersecting[0]?.target.id;
        if (nextId) {
          setActiveId(nextId);
        }
      },
      {
        rootMargin: '-96px 0px -55% 0px',
        threshold: [0, 0.1, 0.5],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);

  const handleScrollToSection = useCallback(
    (id: string) => {
      const element = document.getElementById(id);
      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      setActiveId(id);
    },
    [prefersReducedMotion],
  );

  if (sections.length < 2) {
    return null;
  }

  return (
    <nav aria-label="Prompt sections" className="hidden lg:block">
      <motion.div
        className="sticky top-24"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="brand-page-eyebrow mb-3">Jump to</p>
        <ul className="relative space-y-0.5 border-l border-brand/20 pl-3">
          {sections.map((item) => {
            const isActive = activeId === item.id;

            return (
              <li key={item.id} className="relative">
                {isActive ? (
                  <motion.span
                    layoutId="kit-prompt-section-nav-indicator"
                    className="absolute -left-3 top-1 bottom-1 w-px rounded-full bg-brand"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 36 }
                    }
                  />
                ) : null}
                <button
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => handleScrollToSection(item.id)}
                  className={cn(
                    'block w-full rounded-sm py-1.5 pr-2 text-left text-[13px] leading-snug transition-colors duration-200',
                    isActive
                      ? 'font-medium text-brand'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.section}
                </button>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </nav>
  );
}
