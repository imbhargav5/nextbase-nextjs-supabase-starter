'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import { useGroupHoverAnimation } from '@/components/icons/use-group-hover-animation';
import { cn } from '@/lib/utils';

export interface CheckCheckIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CheckCheckIconProps extends HTMLAttributes<HTMLDivElement> {
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
  animate: (custom: number) => ({
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.5, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
      delay: 0.1 * custom,
    },
  }),
};

const CheckCheckIcon = forwardRef<CheckCheckIconHandle, CheckCheckIconProps>(
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
            custom={0}
            d="M2 12 7 17L18 6"
            initial="normal"
            variants={PATH_VARIANTS}
          />
          <motion.path
            animate={controls}
            custom={1}
            d="M13 16L14.5 17.5L22 10"
            initial="normal"
            variants={PATH_VARIANTS}
          />
        </svg>
      </div>
    );
  },
);

CheckCheckIcon.displayName = 'CheckCheckIcon';

export { CheckCheckIcon };
