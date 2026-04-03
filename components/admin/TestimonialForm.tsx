'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Home, Loader2, Mail, Package, Settings, Star, Users } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { Controller } from 'react-hook-form';
import { createTestimonial, updateTestimonial } from '@/lib/actions/testimonials';
import { toast } from 'sonner';
import ScrollReveal from '@/components/animations/ScrollReveal';

const PAGE_OPTIONS = [
  { value: 'services', label: 'Services Page', icon: Settings },
  { value: 'products', label: 'Product Pages (all)', icon: Package },
  { value: 'home', label: 'Home Page', icon: Home },
  { value: 'about', label: 'About Page', icon: Users },
  { value: 'contact', label: 'Contact Page', icon: Mail },
] as const;

const schema = z.object({
  client_name: z.string().min(1, 'Client name is required'),
  client_title: z.string().optional().or(z.literal('')),
  client_company: z.string().optional().or(z.literal('')),
  company_type: z.string().optional().or(z.literal('')),
  client_image: z.string().optional().or(z.literal('')),
  content: z.string().min(1, 'Testimonial content is required'),
  rating: z.coerce.number().min(1).max(5).default(5),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  sort_order: z.coerce.number().optional(),
  showOnPages: z.array(z.string()).default([]),
});
type FormValues = z.infer<typeof schema>;

export default function TestimonialForm({
  initialData,
  mode,
  pageCounts = {},
}: {
  initialData?: any;
  mode: 'create' | 'edit';
  pageCounts?: Record<string, number>;
}) {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      client_name: initialData?.client_name || '', client_title: initialData?.client_title || '',
      client_company: initialData?.client_company || '', company_type: initialData?.company_type || '', client_image: initialData?.client_image || '',
      content: initialData?.content || '', rating: initialData?.rating || 5,
      status: initialData?.status || 'draft', featured: initialData?.featured || false,
      sort_order: initialData?.sort_order || 0,
      showOnPages: Array.isArray(initialData?.showOnPages) ? initialData?.showOnPages : [],
    },
  });

  const rating = watch('rating');
  const selectedPages = watch('showOnPages') ?? [];
  const initialPages = Array.isArray(initialData?.showOnPages) ? initialData.showOnPages : [];

  const togglePage = (pageValue: string) => {
    const isSelected = selectedPages.includes(pageValue);
    const baseCount = pageCounts[pageValue] ?? 0;
    const initialSelected = initialPages.includes(pageValue);
    const excludedCount = baseCount - (initialSelected ? 1 : 0);
    const disabled = !isSelected && excludedCount >= 4;

    if (disabled) return;

    const next = isSelected
      ? selectedPages.filter((p) => p !== pageValue)
      : [...selectedPages, pageValue];

    setValue('showOnPages', next, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data: FormValues, status: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      const result = mode === 'create'
        ? await createTestimonial({ ...data, status })
        : await updateTestimonial(initialData.id, { ...data, status });
      if (result.success) {
        toast.success(`Testimonial ${status === 'published' ? 'published' : 'saved as draft'}!`);
        setTimeout(() => { router.push('/admin/testimonials'); router.refresh(); }, 1500);
      } else { throw new Error((result as any).error); }
    } catch (e: any) { toast.error(e.message || 'Error saving testimonial'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <ScrollReveal variant="fadeUp" className="max-w-3xl mx-auto pb-20">
      <form className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.03)] border border-[#F3F4F6] mb-6 sticky top-0 z-10 transition-shadow hover:shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.06)]">
          <h1 className="text-2xl font-bold text-gray-800">{mode === 'create' ? 'New Testimonial' : 'Edit Testimonial'}</h1>
          <div className="flex gap-3">
            <button type="button" onClick={() => router.push('/admin/testimonials')} disabled={isSubmitting} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="button" onClick={handleSubmit((d) => onSubmit(d as FormValues, 'draft'))} disabled={isSubmitting} className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 flex items-center">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Draft
            </button>
            <button type="button" onClick={handleSubmit((d) => onSubmit(d as FormValues, 'published'))} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center shadow-sm">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Publish
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
          <h3 className="font-medium text-gray-800 border-b pb-2">Client Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input type="text" {...register('client_name')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              {errors.client_name && <p className="mt-1 text-sm text-red-600">{errors.client_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title / Role</label>
              <input type="text" {...register('client_title')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="CEO, Designer..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input type="text" {...register('client_company')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Type (Industry)</label>
            <input type="text" {...register('company_type')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Technology, Healthcare" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Photo</label>
            <Controller name="client_image" control={control} render={({ field }: { field: any }) => (
              <ImageUploader value={field.value} onUpload={field.onChange} folder="client_photos" />
            )} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
          <h3 className="font-medium text-gray-800 border-b pb-2">Testimonial</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className="cursor-pointer">
                  <input type="radio" {...register('rating')} value={n} className="sr-only" />
                  <Star size={28} className={n <= Number(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                </label>
              ))}
              <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea {...register('content')} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="What did the client say?" />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

        </div>

        {/* SECTION: Display Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
          <h3 className="font-medium text-gray-800 border-b pb-2">Display Settings</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Show on Pages</label>
            <p className="text-sm text-gray-500">Select which pages this testimonial appears on (max 4 per page)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAGE_OPTIONS.map((opt) => {
              const pageValue = opt.value;
              const Icon = opt.icon;
              const isSelected = selectedPages.includes(pageValue);
              const baseCount = pageCounts[pageValue] ?? 0;
              const initialSelected = initialPages.includes(pageValue);
              const excludedCount = baseCount - (initialSelected ? 1 : 0);
              const disabled = !isSelected && excludedCount >= 4;

              const displayCount = baseCount - (initialSelected ? 1 : 0) + (isSelected ? 1 : 0);
              const tooltip = disabled ? 'Page full (4/4)' : undefined;

              return (
                <button
                  key={pageValue}
                  type="button"
                  onClick={() => togglePage(pageValue)}
                  disabled={disabled}
                  title={tooltip}
                  className={[
                    'text-left relative rounded-2xl border p-4 flex items-start gap-3 transition-colors',
                    disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50',
                    isSelected ? 'border-[#E96429] bg-[#E96429]/10' : 'border-gray-200 bg-white',
                  ].join(' ')}
                >
                  <span className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                    <Icon size={18} className={isSelected ? 'text-[#E96429]' : 'text-gray-600'} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-gray-900">{opt.label}</span>
                    <span className="inline-flex mt-2 text-xs font-semibold px-2 py-0.5 rounded-full border bg-white">
                      {displayCount}/4 selected
                    </span>
                  </span>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={disabled}
                    readOnly
                    className="sr-only"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
          <h3 className="font-medium text-gray-800 border-b pb-2">Settings</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input type="number" {...register('sort_order')} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="featured" {...register('featured')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Feature this testimonial</label>
          </div>
        </div>
      </form>
    </ScrollReveal>
  );
}
