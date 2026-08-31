import { getUserPrivateItems } from '@/data/anon/privateItems';
import { Suspense } from 'react';
import { DashboardHeading } from './dashboard-heading';
import { DashboardListSkeleton } from './dashboard-list-skeleton';
import { DashboardPrivateItemsSection } from './dashboard-private-items-section';

export default function DashboardPage() {
  const privateItemsPromise = getUserPrivateItems();
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <DashboardHeading />
      <Suspense fallback={<DashboardListSkeleton />}>
        <DashboardPrivateItemsSection privateItemsPromise={privateItemsPromise} />
      </Suspense>
    </div>
  );
}
