'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Brand } from '@/components/brand';
import { Button, buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  SlidingHighlight,
  SlidingHighlightProvider,
  SlidingHighlightTarget,
  useSlidingHighlight,
} from '@/components/ui/sliding-highlight';
import { PRODUCT_NAME } from '@/constants';
import { cn } from '@/lib/utils';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/kits', label: 'Kits' },
  { href: '/prompts', label: 'Prompts' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

function NavMenuLink({ href, label }: { href: string; label: string }) {
  const { hoveredId, setHoveredId } = useSlidingHighlight();
  const isHovered = hoveredId === href;

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          onMouseEnter={() => setHoveredId(href)}
          onFocus={() => setHoveredId(href)}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'relative w-max bg-transparent text-muted-foreground hover:bg-transparent hover:text-accent-foreground focus-visible:bg-transparent focus-visible:text-accent-foreground',
          )}
        >
          <SlidingHighlight active={isHovered} />
          <span className="relative z-10">{label}</span>
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand/15 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={`${PRODUCT_NAME} home`} className="shrink-0">
          <Brand />
        </Link>

        <SlidingHighlightProvider
          layoutId="header-nav-highlight"
          className="flex min-w-0 flex-1 items-center"
        >
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavMenuLink key={item.href} href={item.href} label={item.label} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex items-center gap-1.5">
            <SlidingHighlightTarget id="theme-toggle">
              <ModeToggle className="hover:bg-transparent hover:text-accent-foreground" />
            </SlidingHighlightTarget>
            <SlidingHighlightTarget id="sign-in" className="hidden sm:inline-flex">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-transparent hover:text-accent-foreground"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </SlidingHighlightTarget>
            <SlidingHighlightTarget id="get-started" className="hidden sm:inline-flex">
              <Button asChild variant="brand" size="sm">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </SlidingHighlightTarget>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu aria-hidden="true" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-[min(22rem,85vw)] flex-col">
                <SheetHeader className="text-left">
                  <SheetTitle>
                    <Brand />
                  </SheetTitle>
                  <SheetDescription>
                    Browse kits, prompts, and pricing for Prompt Market.
                  </SheetDescription>
                </SheetHeader>
                <nav className="mt-6 grid gap-1">
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto grid gap-2 pt-8">
                  <SheetClose asChild>
                    <Button variant="outline" asChild>
                      <Link href="/login">Sign in</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild variant="brand">
                      <Link href="/sign-up">Get started</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </SlidingHighlightProvider>
      </div>
    </header>
  );
}
