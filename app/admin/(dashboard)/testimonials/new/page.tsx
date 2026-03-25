import { getProjects } from '@/lib/actions/projects';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default async function NewTestimonialPage() {
  const projects = await getProjects({ status: 'published' });
  const projectList = projects.map((p: any) => ({ id: p.id, title: p.title }));
  return <TestimonialForm mode="create" projects={projectList} />;
}
