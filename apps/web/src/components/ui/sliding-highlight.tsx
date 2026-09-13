'use client';

import { motion } from 'motion/react';
import {
  createContext,
  useContext,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

export const slidingHighlightTransition = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 35,
};

export type SlidingHighlightTone = 'brand' | 'neutral';

const slidingHighlightToneClassName: Record<SlidingHighlightTone, string> = {
  brand: 'bg-brand-muted/80 dark:bg-brand-muted',
  neutral: 'bg-foreground/[0.06] dark:bg-white/10',
};

type SlidingHighlightContextValue = {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  layoutId: string;
  tone: SlidingHighlightTone;
};

const SlidingHighlightContext =
  createContext<SlidingHighlightContextValue | null>(null);

export function useSlidingHighlight() {
  const context = useContext(SlidingHighlightContext);

  if (!context) {
    throw new Error(
      'Sliding highlight components must be used within SlidingHighlightProvider',
    );
  }

  return context;
}

export function SlidingHighlightProvider({
  layoutId,
  children,
  className,
  tone = 'brand',
}: {
  layoutId: string;
  children: ReactNode;
  className?: string;
  tone?: SlidingHighlightTone;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setHoveredId(null);
    }
  }

  return (
    <SlidingHighlightContext.Provider
      value={{ hoveredId, setHoveredId, layoutId, tone }}
    >
      <div
        className={className}
        onMouseLeave={() => setHoveredId(null)}
        onBlur={handleBlur}
      >
        {children}
      </div>
    </SlidingHighlightContext.Provider>
  );
}

export function SlidingHighlight({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  const { layoutId, tone } = useSlidingHighlight();

  if (!active) {
    return null;
  }

  return (
    <motion.span
      layoutId={layoutId}
      className={cn(
        'absolute inset-0 rounded-md',
        slidingHighlightToneClassName[tone],
        className,
      )}
      transition={slidingHighlightTransition}
    />
  );
}

export function SlidingHighlightTarget({
  id,
  className,
  highlightClassName,
  children,
}: {
  id: string;
  className?: string;
  highlightClassName?: string;
  children: ReactNode;
}) {
  const { hoveredId, setHoveredId } = useSlidingHighlight();
  const isHovered = hoveredId === id;

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setHoveredId(id)}
      onFocusCapture={() => setHoveredId(id)}
    >
      <SlidingHighlight active={isHovered} className={highlightClassName} />
      <div className="relative z-10 inline-flex">{children}</div>
    </div>
  );
}
