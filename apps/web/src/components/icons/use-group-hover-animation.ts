'use client';

import { useAnimation } from 'motion/react';
import { useEffect, useRef } from 'react';

type AnimationControls = ReturnType<typeof useAnimation>;

export function useGroupHoverAnimation(
  controls: AnimationControls,
  enabled: boolean,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const element = wrapperRef.current;
    if (!element) return;

    const group = element.closest('.group');
    if (!group) return;

    const startAnimation = () => {
      void controls.start('animate');
    };

    const stopAnimation = () => {
      void controls.start('normal');
    };

    group.addEventListener('mouseenter', startAnimation);
    group.addEventListener('mouseleave', stopAnimation);
    group.addEventListener('focusin', startAnimation);
    group.addEventListener('focusout', stopAnimation);

    return () => {
      group.removeEventListener('mouseenter', startAnimation);
      group.removeEventListener('mouseleave', stopAnimation);
      group.removeEventListener('focusin', startAnimation);
      group.removeEventListener('focusout', stopAnimation);
    };
  }, [controls, enabled]);

  return wrapperRef;
}
