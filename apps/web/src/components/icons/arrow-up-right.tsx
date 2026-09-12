'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle } from 'react';

import { useGroupHoverAnimation } from '@/components/icons/use-group-hover-animation';
import { cn } from '@/lib/utils';

export interface ArrowUpRightIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ArrowUpRightIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  animateOnGroupHover?: boolean;
}

const ARROW_VARIANTS: Variants = {
  normal: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },
  animate: {
    scale: [1, 0.85, 1],
    translateX: [0, -4, 0],
    translateY: [0, 4, 0],
    originX: 1,
    originY: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

const ArrowUpRightIcon = forwardRef<
  ArrowUpRightIconHandle,
  ArrowUpRightIconProps
>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 28,
      animateOnGroupHover = true,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation();
    const useGroupHover = animateOnGroupHover && ref == null;
    const groupHoverRef = useGroupHoverAnimation(controls, useGroupHover);

    useImperativeHandle(ref, () => ({
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    }));

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!useGroupHover) {
          controls.start('animate');
        }
        onMouseEnter?.(e);
      },
      [controls, onMouseEnter, useGroupHover],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!useGroupHover) {
          controls.start('normal');
        }
        onMouseLeave?.(e);
      },
      [controls, onMouseLeave, useGroupHover],
    );

    return (
      <div
        ref={groupHoverRef}
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.g animate={controls} variants={ARROW_VARIANTS}>
            <path d="M7 7H17" />
            <path d="M17 7V17" />
            <path d="M7 17L17 7" />
          </motion.g>
        </svg>
      </div>
    );
  },
);

ArrowUpRightIcon.displayName = 'ArrowUpRightIcon';

export { ArrowUpRightIcon };
