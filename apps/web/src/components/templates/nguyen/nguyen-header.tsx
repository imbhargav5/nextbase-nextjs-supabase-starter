'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  SlidingHighlightProvider,
  SlidingHighlightTarget,
} from '@/components/ui/sliding-highlight';
import { cn } from '@/lib/utils';

import { nguyenAssets, nguyenNavLinks } from './data';
import { useNguyenTheme } from './nguyen-theme-provider';

const SCROLL_COMPACT_START = 0;
const SCROLL_COMPACT_END = 240;

const NAV_SPRING = {
  stiffness: 55,
  damping: 24,
  mass: 0.85,
  restDelta: 0.001,
};

function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useNguyenTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={cn('relative shrink-0 rounded-full', className)}
    >
      <Sun
        className={cn(
          'size-4 transition-all',
          isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0',
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          'absolute size-4 transition-all',
          isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100',
        )}
        aria-hidden="true"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function NavLinks({ className }: { className?: string }) {
  return (
    <SlidingHighlightProvider layoutId="nguyen-nav-highlight" tone="neutral">
      <ul className={cn('flex gap-2 text-sm', className)}>
        {nguyenNavLinks.map((link) => (
          <li key={link.href}>
            <SlidingHighlightTarget id={link.href}>
              <Link
                href={link.href}
                className="block rounded-md px-3 py-1.5 text-foreground/70 duration-150 hover:bg-transparent hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
              >
                {link.label}
              </Link>
            </SlidingHighlightTarget>
          </li>
        ))}
      </ul>
    </SlidingHighlightProvider>
  );
}

function NavbarActions({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 sm:gap-3',
        className,
      )}
    >
      <ThemeToggle
        className="text-foreground/80 hover:bg-foreground/10 hover:text-foreground dark:text-foreground dark:hover:bg-transparent dark:hover:text-accent-foreground"
      />
      <span
        aria-hidden="true"
        className="hidden h-5 w-px shrink-0 bg-border/70 sm:block"
      />
      <Button
        asChild
        variant="outline"
        size="sm"
        className="h-8 rounded-full border-foreground/15 bg-background px-3 text-foreground hover:bg-foreground/5 hover:text-foreground dark:border-border dark:bg-transparent dark:text-foreground dark:hover:bg-accent"
      >
        <Link href="/login">Login</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className="h-8 rounded-full bg-primary px-3 text-primary-foreground shadow-md hover:bg-primary/90 dark:bg-white dark:text-neutral-900 dark:shadow-lg dark:hover:bg-white/90"
      >
        <Link href="/sign-up">Get Started</Link>
      </Button>
    </div>
  );
}

export function NguyenHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBelowLg, setIsBelowLg] = useState(false);
  const { isDark } = useNguyenTheme();
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, NAV_SPRING);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    function updateViewport() {
      setIsBelowLg(mediaQuery.matches);
    }
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  const compactProgress = useTransform(
    smoothScrollY,
    [SCROLL_COMPACT_START, SCROLL_COMPACT_END],
    [0, 1],
  );

  const marginTop = useTransform(compactProgress, [0, 1], [16, 8]);
  const paddingY = useTransform(compactProgress, [0, 1], [14, 8]);
  const paddingX = useTransform(compactProgress, [0, 1], [24, 18]);
  const borderRadius = useTransform(compactProgress, [0, 1], [0, 24]);
  const maxWidth = useTransform(compactProgress, [0, 1], ['72rem', '56rem']);
  const bgPercent = useTransform(
    compactProgress,
    [0, 1],
    isDark ? [0, 92] : [96, 96],
  );
  const borderPercent = useTransform(
    compactProgress,
    [0, 1],
    isDark ? [0, 72] : [40, 72],
  );
  const shadowOpacity = useTransform(compactProgress, [0, 1], [0, 0.06]);
  const blurAmount = useTransform(
    compactProgress,
    [0, 1],
    isDark ? [0, 18] : [12, 18],
  );
  const logoScale = useTransform(compactProgress, [0, 1], [1, 0.94]);

  const backgroundColor = useMotionTemplate`color-mix(in oklch, var(--background) ${bgPercent}%, transparent)`;
  const borderColor = useMotionTemplate`color-mix(in oklch, var(--border) ${borderPercent}%, transparent)`;
  const boxShadow = useMotionTemplate`0 10px 15px -3px rgb(0 0 0 / ${shadowOpacity}), 0 4px 6px -4px rgb(0 0 0 / ${shadowOpacity})`;
  const backdropFilter = useMotionTemplate`blur(${blurAmount}px)`;

  const mobileIdleNav = isBelowLg && !menuOpen;

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="relative z-20">
      <div
        aria-hidden="true"
        className="max-lg:h-[calc(env(safe-area-inset-top)+7.25rem)] lg:hidden"
      />
      <nav
        data-state={menuOpen ? 'active' : 'false'}
        className={cn(
          'fixed left-1/2 top-0 z-20 w-full -translate-x-1/2 px-3 pt-[calc(env(safe-area-inset-top)+0.625rem)] max-lg:pt-[calc(env(safe-area-inset-top)+0.875rem)] lg:px-2 lg:pt-[env(safe-area-inset-top)]',
          !isDark &&
            'max-lg:bg-transparent lg:bg-background/95 lg:backdrop-blur-[12px] lg:supports-[backdrop-filter]:bg-background/90',
        )}
      >
        <motion.div
          key={isDark ? 'dark' : 'light'}
          className={cn(
            'mx-auto w-full border border-transparent transition-[background-color,box-shadow,border-color] duration-300',
            menuOpen && 'max-lg:rounded-2xl',
            mobileIdleNav && 'max-lg:rounded-2xl',
          )}
          style={{
            marginTop: isBelowLg ? 20 : marginTop,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            borderRadius:
              menuOpen && isBelowLg ? 16 : mobileIdleNav ? 20 : borderRadius,
            maxWidth,
            ...(menuOpen
              ? {
                  backgroundColor:
                    'color-mix(in oklch, var(--background) 94%, transparent)',
                  borderColor:
                    'color-mix(in oklch, var(--border) 65%, transparent)',
                  boxShadow:
                    '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                }
              : mobileIdleNav
                ? {
                    backgroundColor: isDark
                      ? 'color-mix(in oklch, var(--background) 52%, transparent)'
                      : 'color-mix(in oklch, var(--background) 78%, transparent)',
                    borderColor: isDark
                      ? 'color-mix(in oklch, var(--border) 28%, transparent)'
                      : 'color-mix(in oklch, var(--border) 40%, transparent)',
                    boxShadow: 'none',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                  }
                : {
                    backgroundColor,
                    borderColor,
                    boxShadow,
                    backdropFilter,
                    WebkitBackdropFilter: backdropFilter,
                  }),
          }}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <Link
              href="/templates/nguyen"
              aria-label="home"
              className="flex shrink-0 items-center justify-self-start"
            >
              <motion.span
                className="inline-flex origin-left"
                style={{ scale: logoScale }}
              >
                <Image
                  src={nguyenAssets.logoLight}
                  alt="Nguyen"
                  width={120}
                  height={36}
                  className={cn(isDark && 'hidden')}
                  priority
                />
                <Image
                  src={nguyenAssets.logoDark}
                  alt="Nguyen"
                  width={120}
                  height={36}
                  className={cn(!isDark && 'hidden')}
                  priority
                />
              </motion.span>
            </Link>

            <div className="hidden min-w-0 justify-self-center lg:col-start-2 lg:row-start-1 lg:block">
              <NavLinks />
            </div>

            <div className="justify-self-end lg:col-start-3 lg:row-start-1">
              <div className="hidden lg:block">
                <NavbarActions />
              </div>

              <button
                type="button"
                aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="relative -m-2.5 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className="size-6 duration-200 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0"
                  aria-hidden="true"
                />
                <X
                  className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <div
            className={cn(
              'mt-4 hidden flex-col gap-6 overflow-hidden in-data-[state=active]:flex lg:hidden',
            )}
          >
            <ul className="space-y-4 text-base">
              {nguyenNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-foreground duration-150 hover:text-foreground/80 dark:text-foreground dark:hover:text-foreground/90"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <NavbarActions className="flex-wrap justify-end" />
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
