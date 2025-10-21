import { T } from '@/components/ui/Typography';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getItem } from '@/data/anon/items';
import { Calendar, Home, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ConfirmDeleteItemDialog } from './ConfirmDeleteItemDialog';

async function Item({ itemId }: { itemId: string }) {
  const item = await getItem(itemId);

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/items">Items</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{item.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="shadow-md border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <T.H2 className="mb-1">{item.name}</T.H2>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Info className="h-3 w-3" />
            <span>Public Item</span>
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
        <CardFooter className="border-t pt-4">
          <ButtonGroup className="w-full justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <ConfirmDeleteItemDialog itemId={itemId} />
          </ButtonGroup>
        </CardFooter>
      </Card>
    </div>
  );
}

// Loading skeleton component
function ItemSkeleton() {
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

export default async function ItemPage(props: {
  params: Promise<{
    itemId: string;
  }>;
}) {
  const params = await props.params;
  const { itemId } = params;

  try {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Suspense fallback={<ItemSkeleton />}>
          <Item itemId={itemId} />
        </Suspense>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
