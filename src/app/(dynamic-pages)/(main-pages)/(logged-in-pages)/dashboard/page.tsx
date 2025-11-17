import { PrivateItemsList } from '@/app/(dynamic-pages)/(main-pages)/PrivateItemsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { T } from '@/components/ui/Typography';
import { getUserPrivateItems } from '@/data/anon/privateItems';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';


async function UserPrivateItemsListContainer() {
  const privateItems = await getUserPrivateItems();
  return <PrivateItemsList privateItems={privateItems} showActions={false} />;
}

function ListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function Heading() {
  'use cache';
  return (
    <>
      <T.H1>Dashboard</T.H1>
      <Link href="/dashboard/new">
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> New Private Item
        </Button>
      </Link>
    </>
  );
};

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <Heading />
      <Suspense fallback={<ListSkeleton />}>
        <UserPrivateItemsListContainer />
      </Suspense>
    </div>
  );
}
