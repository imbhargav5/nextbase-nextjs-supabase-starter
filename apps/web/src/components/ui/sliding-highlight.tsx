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

type SlidingHighlightContextValue = {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  layoutId: string;
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
}: {
  layoutId: string;
  children: ReactNode;
  className?: string;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setHoveredId(null);
    }
  }

  return (
    <SlidingHighlightContext.Provider
      value={{ hoveredId, setHoveredId, layoutId }}
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
  const { layoutId } = useSlidingHighlight();

  if (!active) {
    return null;
  }

  return (
    <motion.span
      layoutId={layoutId}
      className={cn('absolute inset-0 rounded-md bg-accent', className)}
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
