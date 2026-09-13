import type { Table as TableType } from '@/types';
import { PrivateItemsList } from '@/components/app/private-items-list';

interface PrivateItemsListSectionProps {
  privateItemsPromise: Promise<TableType<'private_items'>[]>;
}

export async function PrivateItemsListSection({
  privateItemsPromise,
}: PrivateItemsListSectionProps) {
  const privateItems = await privateItemsPromise;
  return <PrivateItemsList privateItems={privateItems} />;
}
