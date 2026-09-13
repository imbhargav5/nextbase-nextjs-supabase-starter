import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PrivateItemSkeleton() {
  return (
    <div className="space-y-8" aria-label="Loading private item">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Card className="shadow-none">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
        <CardFooter className="justify-between border-t py-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-28" />
        </CardFooter>
      </Card>
    </div>
  );
}
