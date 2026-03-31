import { getTestimonialById } from '@/lib/actions/testimonials';
import { getPageTestimonialCounts } from '@/lib/actions/testimonials';
import { getProjects } from '@/lib/actions/projects';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { notFound } from 'next/navigation';

export default async function EditTestimonialPage(props: PageProps<'/admin/testimonials/[id]/edit'>) {
  const { id } = await props.params;
  const [testimonial, projects] = await Promise.all([
    getTestimonialById(id),
    getProjects({ status: 'published' }),
  ]);
  if (!testimonial) notFound();
  const projectList = projects.map((pr: any) => ({ id: pr.id, title: pr.title }));
  const pageCounts = await getPageTestimonialCounts();
  return <TestimonialForm mode="edit" initialData={testimonial} projects={projectList} pageCounts={pageCounts} />;
}
