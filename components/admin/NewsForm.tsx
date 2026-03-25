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
import { createNews, updateNews } from '@/lib/actions/news';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().max(300).optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  cover_image: z.string().optional().or(z.literal('')),
  source_url: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
  author_name: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  meta_title: z.string().optional().or(z.literal('')),
  meta_description: z.string().optional().or(z.literal('')),
  og_image: z.string().optional().or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
  no_index: z.boolean().default(false),
});
type FormValues = z.infer<typeof schema>;

export default function NewsForm({ initialData, mode }: { initialData?: any; mode: 'create' | 'edit' }) {
  const router = useRouter();
  
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: initialData?.title || '', slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '', content: initialData?.content || '',
      cover_image: initialData?.cover_image || '', source_url: initialData?.source_url || '',
      category: initialData?.category || '', tags: initialData?.tags || '',
      author_name: initialData?.author_name || '',
      status: initialData?.status || 'draft', featured: initialData?.featured || false,
      meta_title: initialData?.seo_metadata?.meta_title || '', meta_description: initialData?.seo_metadata?.meta_description || '',
      og_image: initialData?.seo_metadata?.og_image || '', keywords: initialData?.seo_metadata?.keywords || '',
      no_index: initialData?.seo_metadata?.no_index || false,
    },
  });

  const watchTitle = watch('title');
  useEffect(() => {
    if (mode === 'create' && watchTitle) setValue('slug', slugify(watchTitle, { lower: true, strict: true }));
  }, [watchTitle, mode, setValue]);

  const onSubmit = async (data: FormValues, status: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      const result = mode === 'create' ? await createNews({ ...data, status }) : await updateNews(initialData.id, { ...data, status });
      if (result.success) {
        toast.success(`Article ${status === 'published' ? 'published' : 'saved as draft'}!`);
        setTimeout(() => { router.push('/admin/news'); router.refresh(); }, 1500);
      } else { throw new Error((result as any).error); }
    } catch (e: any) { toast.error(e.message || 'Error saving news'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <form className="space-y-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">{mode === 'create' ? 'New Article' : 'Edit Article'}</h1>
          <div className="flex gap-3">
            <button type="button" onClick={() => router.push('/admin/news')} disabled={isSubmitting} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                  <input type="text" {...register('author_name')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" {...register('category')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input type="text" {...register('tags')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                {watch('tags') && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {watch('tags')?.split(',').map((t: string, i: number) => t.trim() ? <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{t.trim()}</span> : null)}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
                <input type="url" {...register('source_url')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="https://original-article.com" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">Content</label>
              <Controller name="content" control={control} render={({ field }: { field: any }) => (
                <RichTextEditor value={field.value || ''} onChange={field.onChange} />
              )} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <button type="button" onClick={() => setIsSeoOpen(!isSeoOpen)} className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-100 hover:bg-gray-100">
                <h3 className="text-lg font-medium text-gray-800">SEO Settings</h3>
                {isSeoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {isSeoOpen && <div className="p-6"><SeoPanel register={register} watch={watch} slug={`news/${watch('slug')}`} title={watch('title')} /></div>}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-800 border-b pb-2 mb-4">Cover Image</h3>
              <Controller name="cover_image" control={control} render={({ field }: { field: any }) => (
                <ImageUploader value={field.value} onUpload={field.onChange} folder="news_covers" />
              )} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-3">
              <h3 className="font-medium text-gray-800 border-b pb-2">Settings</h3>
              <div className="flex items-center">
                <input type="checkbox" id="featured" {...register('featured')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Featured article</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
