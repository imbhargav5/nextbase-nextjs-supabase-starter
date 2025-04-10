import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ConfirmDeleteItemDialog } from './ConfirmDeleteItemDialog';
import { T } from '@/components/ui/Typography';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { getItem } from '@/data/anon/items';
import { Suspense } from 'react';

async function Item({ itemId }: { itemId: string }) {
  const item = await getItem(itemId);
  return (
    <div className="space-y-2">
      <div className="space-y-4">
        <Link
          href="/"
          className="text-sm text-blue-600 text-underline flex items-center space-x-2"
        >
          <ArrowLeft /> <span>Back to dashboard</span>
        </Link>
        <T.H1>{item.name}</T.H1>
        <T.Subtle>Description: {item.description}</T.Subtle>
      </div>
      <div className="flex">
        <ConfirmDeleteItemDialog itemId={itemId} />
      </div>
    </div>
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
      <Suspense fallback={<T.Subtle>Loading item...</T.Subtle>}>
        <Item itemId={itemId} />
      </Suspense>
    );
  } catch (error) {
    return notFound();
  }
}
