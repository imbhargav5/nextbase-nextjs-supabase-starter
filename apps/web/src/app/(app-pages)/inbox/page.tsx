import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { getFeedbackReports } from '@/data/user/feedback';
import { getProjects } from '@/data/user/projects';
import { InboxFilters } from './inbox-filters';
import { InboxList } from './inbox-list';

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireCurrentWorkspace();
  const sp = await searchParams;
  const [reports, projects] = await Promise.all([
    getFeedbackReports({
      status: sp.status,
      type: sp.type,
      projectId: sp.projectId,
      q: sp.q,
    }),
    getProjects(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Inbox</h1>
      <InboxFilters projects={projects} current={sp} />
      <InboxList reports={reports} />
    </div>
  );
}
