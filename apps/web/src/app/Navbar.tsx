'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { cn } from '@/lib/utils';
import { MobileNavigation } from './MobileNavigation';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/#features' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="flex h-12 w-full max-w-2xl items-center justify-between rounded-full border border-border/40 bg-muted/70 px-2 shadow-md ring-1 ring-border/10 backdrop-blur-2xl dark:bg-muted/60"
        aria-label="Global"
      >
        <Link href="/" className="flex items-center gap-2 px-2">
          <Image
            src="/logos/nextbase.png"
            alt="Nextbase"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-contain"
          />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Nextbase
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              pathname === href ||
              (href !== '/' && pathname?.startsWith(href.split('#')[0]));
            return (
              <Button
                key={href}
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  'rounded-full text-sm font-medium',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Link href={href}>{label}</Link>
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <ModeToggle className="rounded-full" />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden rounded-full text-sm md:inline-flex"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden rounded-full text-sm md:inline-flex"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <MobileNavigation items={NAV_LINKS} />
        </div>
      </nav>
    </header>
  );
}
