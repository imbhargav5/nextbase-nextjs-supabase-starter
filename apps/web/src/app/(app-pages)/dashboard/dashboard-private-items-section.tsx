import { PrivateItemsList } from '@/app/(app-pages)/PrivateItemsList';
import type { Table as TableType } from '@/types';

interface DashboardPrivateItemsSectionProps {
  privateItemsPromise: Promise<TableType<'private_items'>[]>;
}

export async function DashboardPrivateItemsSection({
  privateItemsPromise,
}: DashboardPrivateItemsSectionProps) {
  const privateItems = await privateItemsPromise;
  return <PrivateItemsList privateItems={privateItems} showActions={false} />;
}
