import { getUserPrivateItems } from '@/data/anon/privateItems';
import { Suspense } from 'react';
import { PrivateItemsHeader } from './private-items-header';
import { PrivateItemsListSection } from './private-items-list-section';
import { PrivateItemsListSkeleton } from './private-items-list-skeleton';

export default function PrivateItemsPage() {
  const privateItemsPromise = getUserPrivateItems();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <PrivateItemsHeader />

      <Suspense fallback={<PrivateItemsListSkeleton />}>
        <PrivateItemsListSection privateItemsPromise={privateItemsPromise} />
      </Suspense>
    </div>
  );
}
