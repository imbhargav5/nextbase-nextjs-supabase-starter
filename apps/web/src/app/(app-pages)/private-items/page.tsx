import { getUserPrivateItems } from '@/data/anon/privateItems';
import { Suspense } from 'react';
import { PrivateItemsHeader } from './private-items-header';
import { PrivateItemsListSection } from './private-items-list-section';
import { PrivateItemsListSkeleton } from './private-items-list-skeleton';

export default function PrivateItemsPage() {
  const privateItemsPromise = getUserPrivateItems();
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <PrivateItemsHeader />
      <Suspense fallback={<PrivateItemsListSkeleton />}>
        <PrivateItemsListSection privateItemsPromise={privateItemsPromise} />
      </Suspense>
    </div>
  );
}
