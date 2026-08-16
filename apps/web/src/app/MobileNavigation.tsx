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
          className="h-9 w-9 rounded-full md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] rounded-l-2xl bg-background/95 backdrop-blur-xl sm:w-[320px]"
      >
        <SheetHeader>
          <SheetTitle className="text-left text-base">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
          {items.map(({ label, href }) => (
            <NavLink
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex h-10 items-center rounded-lg px-3 text-base font-medium transition-colors hover:bg-muted"
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ModeToggle className="h-8 w-8" />
          </div>
          <Button
            asChild
            variant="ghost"
            onClick={() => setOpen(false)}
            className="justify-start rounded-lg px-3 font-medium"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            onClick={() => setOpen(false)}
            className="rounded-full font-medium"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
