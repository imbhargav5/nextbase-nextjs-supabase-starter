'use client';

import Link from 'next/link';

import { Brand } from '@/components/brand';
import { PRODUCT_NAME } from '@/constants';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SlidingHighlightProvider,
  SlidingHighlightTarget,
} from '@/components/ui/sliding-highlight';

const footerLinks = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/templates', label: 'Templates' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/login', label: 'Sign in' },
  { href: '/sign-up', label: 'Create account' },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand/15 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="max-w-md space-y-3">
            <Link href="/" aria-label={`${PRODUCT_NAME} home`} className="inline-flex">
              <Brand showTagline />
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              {PRODUCT_NAME} sells prompt packs with Next.js templates. Preview
              demos, copy agent prompts, and ship landing pages from a real
              monorepo.
            </p>
          </div>
          <SlidingHighlightProvider
            layoutId="footer-nav-highlight"
            className="flex flex-wrap items-center gap-1 md:justify-end"
          >
            {footerLinks.map((item) => (
              <SlidingHighlightTarget key={item.href} id={item.href}>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent hover:text-accent-foreground"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              </SlidingHighlightTarget>
            ))}
          </SlidingHighlightProvider>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{PRODUCT_NAME}. Prompts and templates that ship.</p>
          <p>Next.js 16 · Supabase · shadcn/ui</p>
        </div>
      </div>
    </footer>
  );
}
