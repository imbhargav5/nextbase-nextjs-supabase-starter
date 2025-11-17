import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { T } from '@/components/ui/Typography';
import { getUserPrivateItems } from '@/data/anon/privateItems';
import { Lock, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { PrivateItemsList } from '../../PrivateItemsList';


function PrivateItemsListSkeleton() {
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

async function PrivateItemsListWrapper() {
  // this loads data from supabase and internally
  // uses cookies() which is a Dynamic API
  // Hence must be wrapped in a Suspense
  const privateItems = await getUserPrivateItems();
  return <PrivateItemsList privateItems={privateItems} />;
}

export default function PrivateItemsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <T.H1>Private Items</T.H1>
          <Badge variant="outline" className="h-6 flex items-center gap-1">
            <Lock className="h-3 w-3" /> Secure
          </Badge>
        </div>
        <Link href="/dashboard/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> New Private Item
          </Button>
        </Link>
      </div>
      <T.Subtle className="mb-4">
        Browse your private items that only you can access
      </T.Subtle>

      <Suspense fallback={<PrivateItemsListSkeleton />}>
        <PrivateItemsListWrapper />
      </Suspense>
    </div>
  );
}
