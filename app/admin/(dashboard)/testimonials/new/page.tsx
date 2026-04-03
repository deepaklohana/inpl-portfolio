import { getPageTestimonialCounts } from '@/lib/actions/testimonials';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default async function NewTestimonialPage() {
  const pageCounts = await getPageTestimonialCounts();
  return <TestimonialForm mode="create" pageCounts={pageCounts} />;
}
