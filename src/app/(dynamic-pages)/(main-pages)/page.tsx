import { AppSupabaseClient } from '@/types';
import { ItemsList } from './ItemsList';
import { getAllItems, getAllPrivateItems } from '@/utils/supabase-queries';
import { createSupabaseServerComponentClient } from '@/supabase-clients/createSupabaseServerComponentClient';
import { PrivateItemsList } from './PrivateItemsList';

async function fetchData(supabaseClient: AppSupabaseClient) {
  const [items, privateItems] = await Promise.all([
    getAllItems(supabaseClient),
    getAllPrivateItems(supabaseClient),
  ]);
  return {
    items: items,
    privateItems: privateItems,
  };
}

export default async function HomePage() {
  const supabase = createSupabaseServerComponentClient();
  const { items: initialItems, privateItems: initialPrivateItems } =
    await fetchData(supabase);
  return (
    <div className="space-y-2">
      <ItemsList items={initialItems} />
      <PrivateItemsList privateItems={initialPrivateItems} />
    </div>
  );
}
