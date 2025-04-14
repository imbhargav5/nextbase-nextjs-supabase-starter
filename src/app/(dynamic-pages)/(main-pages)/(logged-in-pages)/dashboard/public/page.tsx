import { Suspense } from 'react';
import Link from 'next/link';
import { PlusCircle, ArrowLeft } from 'lucide-react';

import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAllItems } from '@/data/anon/items';
import { EnhancedItemsList } from '../../../EnhancedItemsList';

export const dynamic = 'force-dynamic';

async function ItemsListContainer() {
  const items = await getAllItems();
  return <EnhancedItemsList items={items} showActions={true} />;
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

export default function PublicItemsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Public Items</span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <T.H1>Public Items</T.H1>
          <T.Subtle>Manage your public items that are visible to everyone</T.Subtle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <Link href="/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> New Public Item
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<ListSkeleton />}>
        <ItemsListContainer />
      </Suspense>
    </div>
  );
}
