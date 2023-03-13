import { AppSupabaseClient } from '@/types';
import { getOrganizationById } from '@/utils/supabase-queries';
import { EditOrganizationForm } from './EditOrganizationForm';
import createClient from '@/utils/supabase-server';

async function fetchData(
  supabaseClient: AppSupabaseClient,
  organizationId: string
) {
  return await getOrganizationById(supabaseClient, organizationId);
}

export default async function EditOrganizationPage({
  params,
}: {
  params: {
    organizationId: string;
  };
}) {
  const { organizationId } = params;
  const supabase = createClient();
  const organization = await fetchData(supabase, organizationId);
  return <EditOrganizationForm initialTitle={organization.title} />;
}
