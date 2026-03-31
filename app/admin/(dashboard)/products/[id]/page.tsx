import { getProductById } from '@/lib/actions/products';
import ProductManagerClient from './ProductManagerClient';
import ProductForm from '../ProductForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getProductTestimonials } from '@/lib/actions/productTestimonials';
import ProductTestimonialsAndStatsSection from '@/components/admin/ProductTestimonialsAndStatsSection';

export const metadata = { title: 'Manage Product | Admin' };

export default async function ProductModulesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();
  let product: Awaited<ReturnType<typeof getProductById>> | null = null;
  try {
    product = await getProductById(numericId);
  } catch (err) {
    const rawMessage = err instanceof Error ? err.message : ''
    const lower = String(rawMessage ?? '').toLowerCase()
    const isPoolTimeout =
      lower.includes('connection pool') ||
      lower.includes('timed out fetching') ||
      lower.includes('server is busy right now') ||
      lower.includes('server is busy') ||
      lower.includes('please try again in a few seconds')

    if (isPoolTimeout) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-700 font-medium">
            Server is busy right now. Please try again in a few seconds.
          </p>
        </div>
      )
    }

    // For other errors, show the default Next error page.
    throw err
  }

  if (!product) notFound();

  const productTestimonialRows = await getProductTestimonials(String(product.id));
  const initialSelectedTestimonials = productTestimonialRows
    .slice()
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((r: any) => ({
      id: String(r.testimonial.id),
      sortOrder: r.sortOrder ?? 0,
      client_image: r.testimonial.client_image,
      client_name: r.testimonial.client_name,
      client_title: r.testimonial.client_title,
      client_company: r.testimonial.client_company,
      rating: r.testimonial.rating ?? 5,
      content: r.testimonial.content,
      showOnPages: Array.isArray(r.testimonial.showOnPages) ? r.testimonial.showOnPages : [],
    }));

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6]">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              {product.name}
              <span className={`text-xs px-2.5 py-1 rounded-full border shadow-sm ${product.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {product.status}
              </span>
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">Edit product info and configure its modules below.</p>
          </div>
        </div>
        
        <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 shadow-sm text-sm font-medium transition-colors border border-blue-100">
          <ExternalLink className="mr-2 h-4 w-4" /> View Live
        </a>
      </div>

      {/* Product Edit Form */}
      <ProductForm
        defaultValues={product}
        productId={product.id}
        testimonials={[]}
        hideTestimonials
      />

      {/* Testimonials */}
      <ProductTestimonialsAndStatsSection
        productId={product.id}
        initialSelectedTestimonials={initialSelectedTestimonials}
        initialTestimonialStats={(product as any).testimonialStats}
      />

      {/* Module Manager */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Modules & Features</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage the modules and sub-features for this product.</p>
        </div>
        <div className="h-[700px] rounded-2xl overflow-hidden">
          <ProductManagerClient product={product} />
        </div>
      </div>
    </div>
  );
}
