import { getUserPrivateItems } from '@/data/anon/privateItems';
import { Suspense } from 'react';
import { DashboardHeading } from './dashboard-heading';
import { DashboardListSkeleton } from './dashboard-list-skeleton';
import { DashboardPrivateItemsSection } from './dashboard-private-items-section';

export default function DashboardPage() {
  const privateItemsPromise = getUserPrivateItems();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <DashboardHeading />
      <Suspense fallback={<DashboardListSkeleton />}>
        <DashboardPrivateItemsSection privateItemsPromise={privateItemsPromise} />
      </Suspense>
    </div>
  );
}
