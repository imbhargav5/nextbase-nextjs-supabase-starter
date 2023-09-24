'use client';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { MobileNavigation } from './MobileNavigation';
import { NavLink } from './NavLink';
// next dynamic
import dynamic from 'next/dynamic';
import ThemeButton from '@/components/ThemeButton';

const DynamicLoginNavLink = dynamic(
  () => import('./LoginNavLink').then((module) => module.LoginNavLink),
  {
    ssr: false,
  }
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
        isScrolled
          ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
          : 'dark:bg-transparent'
      )}
    >
      <div className="mr-6 flex lg:hidden space-x-2">
        <MobileNavigation />
        <div className={cn('block lg:hidden', 'relative ')}>
          <Link href="/" className="block" aria-label="Home page">
            <img
              src="https://usenextbase.com/logos/nextbase/Logo%2006.png"
              className="h-9 block sm:h-9"
              alt="Nextbase Logo"
            />
          </Link>
        </div>
      </div>

      <div
        className={cn(
          ' mx-auto w-full max-w-8xl flex justify-center items-center '
        )}
      >
        <div
          className={cn(
            'hidden lg:flex items-center gap-8 mx-auto ',
            'relative '
          )}
        >
          <Link href="/" aria-label="Home page">
            <img
              src="https://usenextbase.com/logos/nextbase/Logo%2006.png"
              className="h-9 block sm:h-9"
              alt="Nextbase Logo"
            />
          </Link>
          <NavLink href="/" aria-label="Items">
            Items
          </NavLink>
          <Suspense fallback={<div> Loading ... </div>}>
            <DynamicLoginNavLink />
          </Suspense>
          <div>
            <ThemeButton />
          </div>
        </div>
        <div className="-my-5 mr-6 sm:mr-8 md:mr-0"></div>
        <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow"></div>
      </div>
    </header>
  );
}
