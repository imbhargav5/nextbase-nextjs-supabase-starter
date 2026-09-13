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

    let canStartControls = false;
    let listenersAttached = false;

    const startAnimation = () => {
      if (!canStartControls) return;
      void controls.start('animate');
    };

    const stopAnimation = () => {
      if (!canStartControls) return;
      void controls.start('normal');
    };

    const attachListeners = () => {
      if (listenersAttached) return;
      listenersAttached = true;
      canStartControls = true;
      group.addEventListener('mouseenter', startAnimation);
      group.addEventListener('mouseleave', stopAnimation);
      group.addEventListener('focusin', startAnimation);
      group.addEventListener('focusout', stopAnimation);
    };

    const readyFrame = requestAnimationFrame(attachListeners);

    return () => {
      cancelAnimationFrame(readyFrame);
      canStartControls = false;
      if (!listenersAttached) return;
      group.removeEventListener('mouseenter', startAnimation);
      group.removeEventListener('mouseleave', stopAnimation);
      group.removeEventListener('focusin', startAnimation);
      group.removeEventListener('focusout', stopAnimation);
      listenersAttached = false;
    };
  }, [controls, enabled]);

  return wrapperRef;
}
