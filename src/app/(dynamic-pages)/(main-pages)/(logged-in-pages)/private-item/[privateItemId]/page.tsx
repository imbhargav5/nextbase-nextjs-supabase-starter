import Link from 'next/link';
import { notFound } from 'next/navigation';
import { T } from '@/components/ui/Typography';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { getPrivateItem } from '@/data/anon/privateItems';
import { Suspense } from 'react';

async function PrivateItem({ privateItemId }: { privateItemId: string }) {
  const item = await getPrivateItem(privateItemId);
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
    </div>
  );
}

export default async function PrivateItemPage({
  params,
}: {
  params: {
    privateItemId: string;
  };
}) {
  const { privateItemId } = params;
  try {
    return (
      <Suspense fallback={<T.Subtle>Loading private Item...</T.Subtle>}>
        <PrivateItem privateItemId={privateItemId} />
      </Suspense>
    );
  } catch (error) {
    return notFound();
  }
}
