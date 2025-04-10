import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { T } from '@/components/ui/Typography';
import { getPrivateItem } from '@/data/anon/privateItems';
import { ArrowLeft, Calendar, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ConfirmDeleteItemDialog } from './ConfirmDeleteItemDialog';

async function PrivateItem({ privateItemId }: { privateItemId: string }) {
  const item = await getPrivateItem(privateItemId);

  return (
    <Card className="shadow-md border-t-4 border-t-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> <span>Back to dashboard</span>
          </Link>
        </div>
        <T.H2 className="mb-1">{item.name}</T.H2>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Info className="h-3 w-3" />
          <span>Private Item</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <div className="space-y-4">
          <div>
            <T.Small className="text-muted-foreground">Description</T.Small>
            <T.P className="mt-1">{item.description}</T.P>
          </div>

          {item.created_at && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-3 w-3" />
              <span>
                Created on {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        <ConfirmDeleteItemDialog itemId={privateItemId} />
      </CardFooter>
    </Card>
  );
}

// Loading skeleton component
function PrivateItemSkeleton() {
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

export default async function PrivateItemPage(props: {
  params: Promise<{
    privateItemId: string;
  }>;
}) {
  const params = await props.params;
  const { privateItemId } = params;

  try {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Suspense fallback={<PrivateItemSkeleton />}>
          <PrivateItem privateItemId={privateItemId} />
        </Suspense>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
