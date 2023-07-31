import { AppSupabaseClient } from '@/types';
import { ItemsList } from './ItemsList';
import { getAllItems } from '../utils/supabase-queries';
import { createSupabaseServerComponentClient } from '@/supabase-clients/createSupabaseServerComponentClient';

async function fetchData(supabaseClient: AppSupabaseClient) {
  return await getAllItems(supabaseClient);
}

export default async function HomePage() {
  const supabase = createSupabaseServerComponentClient();
  const initialItems = await fetchData(supabase);
  return (
    <div>
      <ItemsList items={initialItems} />
    </div>
  );
}
