import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export function PrivateItemSkeleton() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32 mb-4" />
        </div>
        <Skeleton className="h-8 w-72 mb-1" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
