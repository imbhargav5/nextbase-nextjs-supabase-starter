import { getPrivateItem } from '@/data/anon/privateItems';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PrivateItemCard } from './private-item-card';
import { PrivateItemSkeleton } from './private-item-skeleton';

export default async function PrivateItemPage({ params }: {
  params: Promise<{
    privateItemId: string;
  }>;
}) {
  try {
    const { privateItemId } = await params;
    const itemPromise = getPrivateItem(privateItemId);
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-2xl mx-auto w-full">
        <Suspense fallback={<PrivateItemSkeleton />}>
          <PrivateItemCard privateItemId={privateItemId} itemPromise={itemPromise} />
        </Suspense>
      </div>
    );
  } catch {
    return notFound();
  }
}
