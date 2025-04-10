import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { T } from '@/components/ui/Typography';
import { getAllItems } from '@/data/anon/items';
import { Suspense } from 'react';
import { ItemsList } from '../ItemsList';

export const dynamic = 'force-dynamic';

function ItemsListSkeleton() {
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

async function ItemsListWrapper() {
    const items = await getAllItems();
    return <ItemsList items={items} />;
}

export default function ItemsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <T.H1>Public Items</T.H1>
                <T.Subtle>Browse all publicly available items</T.Subtle>
            </div>

            <Suspense fallback={<ItemsListSkeleton />}>
                <ItemsListWrapper />
            </Suspense>
        </div>
    );
}
