import { getProjectById } from '@/lib/actions/projects';
import ProjectForm from '@/components/admin/ProjectForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage(props: PageProps<'/admin/projects/[id]/edit'>) {
  const { id } = await props.params;
  const project = await getProjectById(id);
  if (!project) notFound();
  return <ProjectForm mode="edit" initialData={project} />;
}
