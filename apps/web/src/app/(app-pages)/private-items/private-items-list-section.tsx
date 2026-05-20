import type { Table as TableType } from '@/types';
import { PrivateItemsList } from '../PrivateItemsList';

interface PrivateItemsListSectionProps {
  privateItemsPromise: Promise<TableType<'private_items'>[]>;
}

export async function PrivateItemsListSection({
  privateItemsPromise,
}: PrivateItemsListSectionProps) {
  // this loads data from supabase and internally
  // uses cookies() which is a Dynamic API
  // Hence must be wrapped in a Suspense
  const privateItems = await privateItemsPromise;
  return <PrivateItemsList privateItems={privateItems} />;
}
