import { AppSupabaseClient } from '@/types';

import { getRuns } from '@/utils/supabase-queries';
import createClient from '@/utils/supabase-server';
import { HistoryList } from './HistoryList';
import { FileUpload } from './FileUpload';

async function fetchRuns(supabase: AppSupabaseClient, organizationId: string) {
  const data = await getRuns(supabase, organizationId);
  return data;
}

export default async function OrganizationPage({
  params: { organizationId },
}: {
  params: {
    organizationId: string;
  };
}) {
  const supabase = createClient();

  const runs = await fetchRuns(supabase, organizationId);
  return (
    <div className="space-y-4">
      <FileUpload />
      <HistoryList initialRuns={runs} />
    </div>
  );
}
