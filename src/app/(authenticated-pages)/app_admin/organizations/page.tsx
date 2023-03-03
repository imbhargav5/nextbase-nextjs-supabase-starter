import { getOrganizationsPaginated } from '@/utils/supabase-admin';
import { RenderOrganizations } from './RenderOrganizations';

export default async function AdminPanel() {
  const data = await getOrganizationsPaginated(0, undefined);
  return (
    <div>
      <RenderOrganizations organizationsData={data} />
    </div>
  );
}
