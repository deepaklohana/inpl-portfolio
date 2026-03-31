import { getProjects } from '@/lib/actions/projects';
import { getPageTestimonialCounts } from '@/lib/actions/testimonials';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default async function NewTestimonialPage() {
  const projects = await getProjects({ status: 'published' });
  const projectList = projects.map((p: any) => ({ id: p.id, title: p.title }));
  const pageCounts = await getPageTestimonialCounts();
  return <TestimonialForm mode="create" projects={projectList} pageCounts={pageCounts} />;
}
