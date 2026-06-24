import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { getProject } from '@/data/user/projects';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { InstallSnippet } from './InstallSnippet';
import { ProjectSettingsForm } from './ProjectSettingsForm';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  await requireCurrentWorkspace();
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const headerList = await headers();
  const host = headerList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const origin = `${protocol}://${host}`;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">{project.name}</h1>
      <InstallSnippet origin={origin} publicKey={project.public_key} />
      <ProjectSettingsForm project={project} />
    </div>
  );
}
