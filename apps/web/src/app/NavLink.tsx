'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, ReactNode } from 'react';

type NavLinkProps = {
  href: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, 'href' | 'children'>;

export function NavLink({
  href,
  className,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-foreground',
        isActive ? 'text-foreground' : 'text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
