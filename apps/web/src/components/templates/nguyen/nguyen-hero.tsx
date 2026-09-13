'use client';

import { Play, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { nguyenHero } from './data';

export function NguyenHero() {
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (!videoOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setVideoOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [videoOpen]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-5 pt-14 pb-2 max-lg:pt-12 sm:gap-10 sm:px-6 md:gap-12 lg:px-8 lg:pt-40 xl:pt-44">
      <div className="flex w-full max-w-3xl flex-col items-center gap-5 sm:gap-6 md:gap-7">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-center font-medium tracking-[-0.03em] text-balance"
        >
          <span
            className={cn(
              'block text-foreground',
              'text-[clamp(1.875rem,5.6vw,4.5rem)] leading-[1.06]',
              'sm:text-[clamp(2.5rem,4.2vw,4.75rem)] sm:leading-[1.05]',
              'lg:text-[clamp(3rem,3.6vw,5rem)] lg:leading-[1.02]',
            )}
          >
            {nguyenHero.title}
          </span>
          <span
            className={cn(
              'mt-2 block text-muted-foreground sm:mt-2.5',
              'text-[clamp(1.875rem,5.6vw,4.5rem)] leading-[1.06]',
              'sm:text-[clamp(2.5rem,4.2vw,4.75rem)] sm:leading-[1.05]',
              'lg:text-[clamp(3rem,3.6vw,5rem)] lg:leading-[1.02]',
            )}
          >
            {nguyenHero.titleMuted}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'max-w-[34ch] text-center text-pretty text-muted-foreground',
            'text-[0.9375rem] leading-[1.65] tracking-[-0.01em]',
            'sm:max-w-[42ch] sm:text-base sm:leading-7',
            'md:max-w-xl md:text-lg md:leading-8',
          )}
        >
          {nguyenHero.description}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
      >
        <Button
          asChild
          size="lg"
          className="h-11 w-full rounded-md px-6 shadow-lg sm:w-auto sm:min-w-[9.5rem]"
        >
          <Link href={nguyenHero.primaryCta.href}>
            {nguyenHero.primaryCta.label}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-11 w-full rounded-md px-6 sm:w-auto sm:min-w-[9.5rem]"
        >
          <Link href={nguyenHero.secondaryCta.href}>
            {nguyenHero.secondaryCta.label}
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-2 w-full max-w-5xl sm:mt-4"
      >
        <button
          type="button"
          aria-label="Play video"
          onClick={() => setVideoOpen(true)}
          className="group relative w-full cursor-pointer border-0 bg-transparent p-0"
        >
          <Image
            src={nguyenHero.video.thumbnailSrc}
            alt={nguyenHero.video.thumbnailAlt}
            width={1920}
            height={1080}
            priority
            className="h-auto w-full rounded-md transition-all duration-200 ease-out group-hover:brightness-[0.8]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent"
          />
          <div
            className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md sm:size-28">
              <div
                className={cn(
                  'relative flex size-12 scale-100 items-center justify-center rounded-full bg-gradient-to-b from-primary/30 to-primary shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2] sm:size-20',
                )}
              >
                <Play
                  className="size-5 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105 sm:size-8"
                  style={{
                    filter:
                      'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </button>
      </motion.div>

      <AnimatePresence>
        {videoOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            >
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setVideoOpen(false)}
                className="focus-visible:ring-ring absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md focus-visible:ring-2 focus-visible:outline-none dark:bg-neutral-100/50 dark:text-black"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
                <video
                  src={nguyenHero.video.videoSrc}
                  poster={nguyenHero.video.thumbnailSrc}
                  title="Hero Video player"
                  className="size-full rounded-2xl bg-black object-contain"
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
