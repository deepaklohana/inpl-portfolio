import { getProductById } from '@/lib/actions/products';
import { getTestimonialsByProjectId } from '@/lib/actions/testimonials';
import { getProjectBySlugAny } from '@/lib/actions/projects';
import ProductForm from '../../ProductForm';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Product System | Admin' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();
  const product = await getProductById(numericId);
  
  if (!product) {
    notFound();
  }

  const relatedProject = await getProjectBySlugAny(product.slug);
  const testimonials = relatedProject ? await getTestimonialsByProjectId(relatedProject.id) : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product System</h1>
        <p className="mt-1 text-sm text-gray-500">Update the core configurations of this foundation system.</p>
      </div>
      <ProductForm defaultValues={product} productId={product.id} testimonials={testimonials} />
    </div>
  );
}
