'use client';
import { ReactNode } from 'react';

export function OrganizationClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="h-full">{children}</div>;
}
