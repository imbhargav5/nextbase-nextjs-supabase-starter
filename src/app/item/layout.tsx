'use client';
import { notFound } from 'next/navigation';

import { useSelectedLayoutSegment } from 'next/navigation';
import { ItemIdLayoutContextProvider } from './ItemIdLayoutContext';

export default function ItemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const itemId = useSelectedLayoutSegment();
  if (itemId) {
    return (
      <ItemIdLayoutContextProvider itemId={itemId}>
        {children}
      </ItemIdLayoutContextProvider>
    );
  } else {
    return notFound();
  }
}
