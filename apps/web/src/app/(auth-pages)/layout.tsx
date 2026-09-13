import { CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Brand } from '@/components/brand';
import { PRODUCT_NAME } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/ui/mode-toggle';
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

const benefits = [
  'Sign in to open purchased kit prompts',
  'Save kits and account details in one place',
  'Same Supabase auth the templates use',
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex min-h-svh flex-col">
        <header className="flex h-16 items-center justify-between border-b border-brand/15 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label={`${PRODUCT_NAME} home`}>
            <Brand />
          </Link>
          <ModeToggle />
        </header>
        <main className="flex flex-1 items-start justify-center px-4 pb-10 pt-16 sm:px-6 sm:pt-20">
          <div className="w-full max-w-md">{children}</div>
        </main>
        <footer className="px-6 py-5 text-center text-xs text-muted-foreground">
          {PRODUCT_NAME} accounts unlock kit prompts after purchase.
        </footer>
      </div>

      <aside className="relative hidden overflow-hidden border-l bg-muted/30 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-muted),transparent_48%)]" />
        <Badge variant="outline" className="relative w-fit bg-background">
          Kits + templates
        </Badge>
        <div className="relative max-w-lg space-y-8">
          <div className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm">
              <LockKeyhole className="size-6" aria-hidden="true" />
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight">
              Sign in to open your kits.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Purchases attach to this account. You can also use the workspace
              demo to try auth and private data in the starter repo.
            </p>
          </div>
          <ItemGroup className="gap-2">
            {benefits.map((benefit) => (
              <Item key={benefit} variant="outline" className="bg-background/70">
                <ItemMedia variant="icon">
                  <CheckCircle2 aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{benefit}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
        <div className="relative flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Protected by row-level security
        </div>
      </aside>
    </div>
  );
}
