import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { getPrivateItem } from '@/data/anon/privateItems';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

async function PrivateItemHeadingContent({ params }: { params: Promise<{ privateItemId: string }> }) {
  try {
    const { privateItemId } = await params;
    const item = await getPrivateItem(privateItemId);
    return <BreadcrumbPage>{item.name}</BreadcrumbPage>;
  } catch (error) {
    notFound();
  }
}

export default async function PrivateItemHeading({
  params,
}: {
  params: Promise<{ privateItemId: string }>;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/private-items">Private Items</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Suspense fallback={<Skeleton className="h-4 w-24" />}>
            <PrivateItemHeadingContent params={params} />
          </Suspense>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
