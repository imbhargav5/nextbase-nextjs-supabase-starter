import { getAllOrganizationsForUser } from '@/utils/supabase-queries';
import { OrganizationList } from './OrganizationList';
import createClient from '@/utils/supabase-server';
import { AppSupabaseClient } from '@/types';

const fetchData = async (supabaseClient: AppSupabaseClient) => {
  const initialOrganizationsList = await getAllOrganizationsForUser(
    supabaseClient
  );
  return { initialOrganizationsList };
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { initialOrganizationsList } = await fetchData(supabase);
  return (
    <div>
      <OrganizationList initialOrganizationsList={initialOrganizationsList} />
    </div>
  );
}
