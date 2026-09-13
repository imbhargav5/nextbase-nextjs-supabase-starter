import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardListSkeleton() {
  return (
    <section className="space-y-4" aria-label="Loading private items">
      <div className="space-y-2">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Card className="shadow-none">
        <CardHeader className="flex-row gap-6 border-b py-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/5" />
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-11 w-full" />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
