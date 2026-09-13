import { PrivateItemsList } from '@/app/(app-pages)/PrivateItemsList';
import type { Table as TableType } from '@/types';

interface DashboardPrivateItemsSectionProps {
  privateItemsPromise: Promise<TableType<'private_items'>[]>;
}

export async function DashboardPrivateItemsSection({
  privateItemsPromise,
}: DashboardPrivateItemsSectionProps) {
  const privateItems = await privateItemsPromise;
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Recent private items</h2>
        <p className="text-sm text-muted-foreground">
          The latest records in your authenticated workspace.
        </p>
      </div>
      <PrivateItemsList privateItems={privateItems} />
    </section>
  );
}
