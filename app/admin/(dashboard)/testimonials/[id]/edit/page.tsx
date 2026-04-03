import { getTestimonialById } from '@/lib/actions/testimonials';
import { getPageTestimonialCounts } from '@/lib/actions/testimonials';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { notFound } from 'next/navigation';

export default async function EditTestimonialPage(props: PageProps<'/admin/testimonials/[id]/edit'>) {
  const { id } = await props.params;
  const [testimonial] = await Promise.all([
    getTestimonialById(id)
  ]);
  if (!testimonial) notFound();
  const pageCounts = await getPageTestimonialCounts();
  return <TestimonialForm mode="edit" initialData={testimonial} pageCounts={pageCounts} />;
}
