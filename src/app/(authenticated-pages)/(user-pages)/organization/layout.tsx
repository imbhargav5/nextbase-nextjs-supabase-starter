'use client';
import { notFound } from 'next/navigation';

import { useSelectedLayoutSegment } from 'next/navigation';
import { OrganizationIdLayoutContextProvider } from './OrganizationIdLayoutContext';

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationId = useSelectedLayoutSegment();
  if (organizationId) {
    return (
      <OrganizationIdLayoutContextProvider organizationId={organizationId}>
        {children}
      </OrganizationIdLayoutContextProvider>
    );
  } else {
    return notFound();
  }
}
