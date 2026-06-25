import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { WorkspaceSettingsForm } from './workspace-settings-form';

export default async function SettingsPage() {
  const membership = await requireCurrentWorkspace();
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Workspace settings</h1>
      <WorkspaceSettingsForm name={membership.workspace!.name} slug={membership.workspace!.slug} />
    </div>
  );
}
