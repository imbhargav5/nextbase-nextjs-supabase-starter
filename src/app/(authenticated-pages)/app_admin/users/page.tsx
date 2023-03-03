import { getUsersPaginated } from '@/utils/supabase-admin';
import { RenderUsers } from './RenderUsers';

export default async function AdminPanel() {
  const data = await getUsersPaginated(0, undefined);
  return (
    <div>
      <RenderUsers userData={data} />
    </div>
  );
}
