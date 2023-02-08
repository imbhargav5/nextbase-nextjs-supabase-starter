import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItem } from '../../utils/supabase-queries';
import createClient from '../../utils/supabase-server';

export default async function Item({
  params,
}: {
  params: {
    itemId: string;
  };
}) {
  const supabase = createClient();
  const { itemId } = params;
  try {
    const item = await getItem(supabase, itemId);
    return (
      <div className="space-y-4">
        <Link href="/" className="text-sm">
          {' '}
          Back to dashboard
        </Link>
        <h1 className="text-lg text-black">Item</h1>
        <p>Name: {item.name}</p>
        <p>Description: {item.description}</p>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
