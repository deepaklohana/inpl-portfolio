'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import SeoPanel from './SeoPanel';
import { createEvent, updateEvent } from '@/lib/actions/events';
import { toast } from 'sonner';
import ScrollReveal from '@/components/animations/ScrollReveal';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().max(300).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  cover_image: z.string().optional().or(z.literal('')),
  event_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  location_url: z.string().optional().or(z.literal('')),
  is_online: z.boolean().default(false),
  event_url: z.string().optional().or(z.literal('')),
  registration_url: z.string().optional().or(z.literal('')),
  gallery: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  meta_title: z.string().optional().or(z.literal('')),
  meta_description: z.string().optional().or(z.literal('')),
  og_image: z.string().optional().or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
  no_index: z.boolean().default(false),
});
type FormValues = z.infer<typeof schema>;

export default function EventForm({ initialData, mode }: { initialData?: any; mode: 'create' | 'edit' }) {
  const router = useRouter();
  
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: initialData?.title || '', slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '', description: initialData?.description || '',
      cover_image: initialData?.cover_image || '',
      event_date: initialData?.event_date ? initialData.event_date.slice(0, 16) : '',
      end_date: initialData?.end_date ? initialData.end_date.slice(0, 16) : '',
      location: initialData?.location || '', location_url: initialData?.location_url || '',
      is_online: initialData?.is_online || false, event_url: initialData?.event_url || '',
      registration_url: initialData?.registration_url || '',
      gallery: Array.isArray(initialData?.gallery) ? initialData.gallery.join(', ') : (initialData?.gallery || ''),
      status: initialData?.status || 'draft', featured: initialData?.featured || false,
      meta_title: initialData?.seo_metadata?.meta_title || '', meta_description: initialData?.seo_metadata?.meta_description || '',
      og_image: initialData?.seo_metadata?.og_image || '', keywords: initialData?.seo_metadata?.keywords || '',
      no_index: initialData?.seo_metadata?.no_index || false,
    },
  });

  const watchTitle = watch('title');
  const isOnline = watch('is_online');
  useEffect(() => {
    if (mode === 'create' && watchTitle) setValue('slug', slugify(watchTitle, { lower: true, strict: true }));
  }, [watchTitle, mode, setValue]);

  const onSubmit = async (data: FormValues, status: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      const result = mode === 'create' ? await createEvent({ ...data, status }) : await updateEvent(initialData.id, { ...data, status });
      if (result.success) {
        toast.success(`Event ${status === 'published' ? 'published' : 'saved as draft'}!`);
        setTimeout(() => { router.push('/admin/events'); router.refresh(); }, 1500);
      } else { throw new Error((result as any).error); }
    } catch (e: any) { toast.error(e.message || 'Error saving event'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <ScrollReveal variant="fadeUp" className="max-w-5xl mx-auto pb-20">
      <form className="space-y-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.03)] border border-[#F3F4F6] mb-6 sticky top-0 z-10 transition-shadow hover:shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.06)]">
          <h1 className="text-2xl font-bold text-gray-800">{mode === 'create' ? 'New Event' : 'Edit Event'}</h1>
          <div className="flex gap-3">
            <button type="button" onClick={() => router.push('/admin/events')} disabled={isSubmitting} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="button" onClick={handleSubmit((d) => onSubmit(d as FormValues, 'draft'))} disabled={isSubmitting} className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 flex items-center">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Draft
            </button>
            <button type="button" onClick={handleSubmit((d) => onSubmit(d as FormValues, 'published'))} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center shadow-sm">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" {...register('title')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" {...register('slug')} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea {...register('excerpt')} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
              <h3 className="font-medium text-gray-800 border-b pb-2">Event Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                  <input type="datetime-local" {...register('event_date')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                  <input type="datetime-local" {...register('end_date')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                <input type="checkbox" id="is_online" {...register('is_online')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="is_online" className="text-sm font-medium text-gray-700">Online Event</label>
              </div>
              {!isOnline && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" {...register('location')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Venue name or address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location URL (Google Maps)</label>
                    <input type="url" {...register('location_url')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event URL</label>
                <input type="url" {...register('event_url')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration URL</label>
                <input type="url" {...register('registration_url')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gallery URLs (comma separated)</label>
                <textarea {...register('gallery')} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6]">
              <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
              <Controller name="description" control={control} render={({ field }: { field: any }) => (
                <RichTextEditor value={field.value || ''} onChange={field.onChange} />
              )} />
            </div>

            <div className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden">
              <button type="button" onClick={() => setIsSeoOpen(!isSeoOpen)} className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-100 hover:bg-gray-100">
                <h3 className="text-lg font-medium text-gray-800">SEO Settings</h3>
                {isSeoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {isSeoOpen && <div className="p-6"><SeoPanel register={register} watch={watch} slug={`events/${watch('slug')}`} title={watch('title')} /></div>}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6]">
              <h3 className="font-medium text-gray-800 border-b pb-2 mb-4">Cover Image</h3>
              <Controller name="cover_image" control={control} render={({ field }: { field: any }) => (
                <ImageUploader value={field.value} onUpload={field.onChange} folder="event_covers" />
              )} />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-3">
              <h3 className="font-medium text-gray-800 border-b pb-2">Settings</h3>
              <div className="flex items-center">
                <input type="checkbox" id="featured" {...register('featured')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Featured event</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ScrollReveal>
  );
}
