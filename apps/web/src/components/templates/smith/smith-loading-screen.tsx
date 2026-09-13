'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { smithLoadingWords } from '@/components/templates/smith/constants';
import { smithDisplayClass } from '@/components/templates/smith/smith-theme-provider';

interface SmithLoadingScreenProps {
  onComplete: () => void;
}

const DURATION_MS = 2700;

export function SmithLoadingScreen({ onComplete }: SmithLoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(onComplete, 400);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % smithLoadingWords.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  const display = String(count).padStart(3, '0');

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-[hsl(var(--smith-bg))]"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${display} percent`}
    >
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 text-xs tracking-[0.3em] text-[hsl(var(--smith-muted))] uppercase"
      >
        Portfolio
      </motion.p>

      <div className="flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className={`text-4xl text-[hsl(var(--smith-text)/0.8)] md:text-6xl lg:text-7xl ${smithDisplayClass()}`}
          >
            {smithLoadingWords[wordIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <p
        className={`absolute right-8 bottom-24 text-6xl tabular-nums text-[hsl(var(--smith-text))] md:text-8xl lg:text-9xl ${smithDisplayClass()}`}
      >
        {display}
      </p>

      <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-[hsl(var(--smith-stroke)/0.5)]">
        <div
          className="smith-accent-gradient h-full origin-left transition-transform duration-75"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
          }}
        />
      </div>
    </div>
  );
}
