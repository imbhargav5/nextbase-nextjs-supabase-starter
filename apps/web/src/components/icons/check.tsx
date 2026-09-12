'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

import { useGroupHoverAnimation } from '@/components/icons/use-group-hover-animation';
import { cn } from '@/lib/utils';

export interface CheckIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CheckIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  animateOnGroupHover?: boolean;
  active?: boolean;
  activationKey?: string | number;
}

const PATH_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.5, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
};

const CheckIcon = forwardRef<CheckIconHandle, CheckIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 28,
      animateOnGroupHover = true,
      active = false,
      activationKey,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation();
    const useGroupHover = animateOnGroupHover && ref == null;
    const groupHoverRef = useGroupHoverAnimation(controls, useGroupHover);
    const skipActivationAnimationRef = useRef(true);

    useEffect(() => {
      if (!active || activationKey === undefined) return;

      if (skipActivationAnimationRef.current) {
        skipActivationAnimationRef.current = false;
        return;
      }

      void controls.start('animate');
    }, [activationKey, active, controls]);

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
          aria-hidden="true"
        >
          <motion.path
            animate={controls}
            d="M4 12 9 17L20 6"
            initial="normal"
            variants={PATH_VARIANTS}
          />
        </svg>
      </div>
    );
  },
);

CheckIcon.displayName = 'CheckIcon';

export { CheckIcon };
