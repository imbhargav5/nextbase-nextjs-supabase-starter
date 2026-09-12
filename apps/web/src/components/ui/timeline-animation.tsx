'use client';

import { cn } from '@/lib/utils';
import { motion, type Variants } from 'motion/react';
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type RefObject,
} from 'react';

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const motionComponentCache = new Map<string, ReturnType<typeof motion.create>>();

function getMotionComponent(as: ElementType) {
  const tag = typeof as === 'string' ? as : 'div';

  if (!motionComponentCache.has(tag)) {
    motionComponentCache.set(tag, motion.create(tag));
  }

  return motionComponentCache.get(tag)!;
}

type TimelineContentProps<T extends ElementType> = {
  as?: T;
  animationNum?: number;
  timelineRef?: RefObject<HTMLElement | null>;
  customVariants?: Variants;
  viewport?: {
    amount?: number;
    margin?: string;
    once?: boolean;
  };
  className?: string;
  children?: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function TimelineContent<T extends ElementType = 'div'>({
  as,
  animationNum = 0,
  timelineRef,
  customVariants,
  viewport = { amount: 0.3, margin: '0px 0px -120px 0px', once: true },
  className,
  children,
  ...props
}: TimelineContentProps<T>) {
  const Component = (as ?? 'div') as ElementType;
  const MotionComponent = getMotionComponent(Component);
  const variants = customVariants ?? defaultVariants;

  return (
    <MotionComponent
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{
        ...viewport,
        root: timelineRef,
      }}
      variants={variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
