import { AppSupabaseClient } from '@/types';
import { ItemsList } from './ItemsList';
import { getAllItems } from './utils/supabase-queries';
import createClient from './utils/supabase-server';

async function fetchData(supabaseClient: AppSupabaseClient) {
  return await getAllItems(supabaseClient);
}

export default async function HomePage() {
  const supabase = createClient();
  const initialItems = await fetchData(supabase);
  return (
    <div>
      <ItemsList initialItems={initialItems} />
    </div>
  );
}
