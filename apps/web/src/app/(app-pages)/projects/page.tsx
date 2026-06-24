import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { getProjects } from '@/data/user/projects';
import { CreateProjectForm } from './CreateProjectForm';
import { ProjectsList } from './projects-list';

export default async function ProjectsPage() {
  await requireCurrentWorkspace();
  const projects = await getProjects();
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <CreateProjectForm />
      </div>
      <ProjectsList projects={projects} />
    </div>
  );
}
