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
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<PrivateItemSkeleton />}>
          <PrivateItemCard privateItemId={privateItemId} itemPromise={itemPromise} />
        </Suspense>
      </div>
    );
  } catch {
    return notFound();
  }
}
