import { getTestimonials } from '@/lib/actions/testimonials';
import AdminListClient from '@/components/admin/AdminListClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-500">Manage client testimonials.</p>
        </div>
        <Link href="/admin/testimonials/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-sm font-medium">
          <Plus className="-ml-1 mr-2 h-5 w-5" /> New Testimonial
        </Link>
      </div>

      <AdminListClient
        items={testimonials}
        section="testimonials"
        columns={[
          { key: 'client_name', label: 'Client', type: 'client_info' },
          { key: 'rating', label: 'Rating', type: 'rating' },
          { key: 'content', label: 'Preview', type: 'text' },
        ]}
      />
    </div>
  );
}
