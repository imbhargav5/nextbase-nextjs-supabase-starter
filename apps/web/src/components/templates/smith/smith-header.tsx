'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  SMITH_TEMPLATE_BASE,
  smithNavLinks,
} from '@/components/templates/smith/constants';
import { smithDisplayClass } from '@/components/templates/smith/smith-theme-provider';
import {
  SlidingHighlightProvider,
  slidingHighlightTransition,
  useSlidingHighlight,
} from '@/components/ui/sliding-highlight';
import { cn } from '@/lib/utils';

function resolveNavActiveId(pathname: string): string {
  if (pathname.startsWith(`${SMITH_TEMPLATE_BASE}/about`)) {
    return 'about';
  }
  if (pathname.startsWith(`${SMITH_TEMPLATE_BASE}/work/`)) {
    return 'work';
  }
  return 'home';
}

function SmithNavLink({
  id,
  href,
  label,
  active,
  onNavigate,
}: {
  id: string;
  href: string;
  label: string;
  active: boolean;
  onNavigate: (id: string) => void;
}) {
  const { hoveredId, setHoveredId, layoutId } = useSlidingHighlight();
  const isHighlighted = hoveredId ? hoveredId === id : active;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setHoveredId(id)}
      onFocusCapture={() => setHoveredId(id)}
    >
      {isHighlighted ? (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-full bg-[hsl(var(--smith-stroke)/0.5)]"
          transition={slidingHighlightTransition}
        />
      ) : null}
      <Link
        href={href}
        onClick={() => onNavigate(id)}
        className={cn(
          'relative z-10 rounded-full px-3 py-1.5 text-xs transition-colors sm:px-4 sm:py-2 sm:text-sm',
          isHighlighted
            ? 'text-[hsl(var(--smith-text))]'
            : 'text-[hsl(var(--smith-muted))] hover:text-[hsl(var(--smith-text))]',
        )}
      >
        {label}
      </Link>
    </div>
  );
}

export function SmithHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(() => resolveNavActiveId(pathname));

  useEffect(() => {
    setActive(resolveNavActiveId(pathname));
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleNavClick(id: string) {
    setActive(id);
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <nav
        className={cn(
          'inline-flex items-center rounded-full border border-white/10 bg-[hsl(var(--smith-surface))] px-2 py-2 backdrop-blur-md',
          scrolled && 'shadow-md shadow-black/10',
        )}
        aria-label="Primary"
      >
        <Link
          href={`${SMITH_TEMPLATE_BASE}#home`}
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--smith-bg))] p-[2px] transition-transform hover:scale-110"
          aria-label="Home"
        >
          <span
            className="flex h-full w-full items-center justify-center rounded-full bg-[hsl(var(--smith-bg))] text-[13px] text-[hsl(var(--smith-text))] smith-accent-gradient bg-clip-padding"
            style={{
              background:
                'linear-gradient(90deg, #89aacc 0%, #4e85bf 100%) padding-box, hsl(var(--smith-bg)) border-box',
              border: '2px solid transparent',
            }}
          >
            <span className={smithDisplayClass()}>JA</span>
          </span>
        </Link>

        <span
          className="mx-1 hidden h-5 w-px bg-[hsl(var(--smith-stroke))] sm:block"
          aria-hidden
        />

        <SlidingHighlightProvider layoutId="smith-nav-highlight">
          <ul className="flex items-center gap-0.5">
            {smithNavLinks.map((link) => (
              <li key={link.id}>
                <SmithNavLink
                  id={link.id}
                  href={link.href}
                  label={link.label}
                  active={active === link.id}
                  onNavigate={handleNavClick}
                />
              </li>
            ))}
          </ul>
        </SlidingHighlightProvider>

        <span
          className="mx-1 hidden h-5 w-px bg-[hsl(var(--smith-stroke))] sm:block"
          aria-hidden
        />

        <Link
          href={`${SMITH_TEMPLATE_BASE}#contact`}
          className="smith-nav-cta inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs text-[hsl(var(--smith-text))] sm:gap-1 sm:px-4 sm:py-2 sm:text-sm"
        >
          Say&nbsp;hi <span aria-hidden>↗</span>
        </Link>
      </nav>
    </header>
  );
}
