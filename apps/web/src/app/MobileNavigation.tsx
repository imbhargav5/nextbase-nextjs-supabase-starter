'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NavLink } from './NavLink';

type MobileNavigationProps = {
  items: { label: string; href: string }[];
};

export function MobileNavigation({ items }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
          {items.map(({ label, href }) => (
            <NavLink
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex h-10 items-center rounded-md px-4 text-base font-medium hover:bg-accent"
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="flex flex-col gap-3 px-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ModeToggle />
          </div>
          <Button asChild variant="ghost" onClick={() => setOpen(false)}>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild onClick={() => setOpen(false)}>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
