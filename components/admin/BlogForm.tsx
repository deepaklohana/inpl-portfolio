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
import { createBlog, updateBlog } from '@/lib/actions/blogs';
import { toast } from 'sonner';
import ScrollReveal from '@/components/animations/ScrollReveal';

// Form schema
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().max(300, 'Excerpt must be less than 300 characters').optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  cover_image: z.string().optional().or(z.literal('')),
  author_name: z.string().optional().or(z.literal('')),
  author_image: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  // SEO
  meta_title: z.string().optional().or(z.literal('')),
  meta_description: z.string().optional().or(z.literal('')),
  og_image: z.string().optional().or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
  no_index: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogFormProps {
  initialData?: any; // any to accommodate the joined data
  mode: 'create' | 'edit';
}

export default function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter();
  
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // default values
  const defaultValues: BlogFormValues = {
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    cover_image: initialData?.cover_image || '',
    author_name: initialData?.author_name || '',
    author_image: initialData?.author_image || '',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
    meta_title: initialData?.seo_metadata?.meta_title || '',
    meta_description: initialData?.seo_metadata?.meta_description || '',
    og_image: initialData?.seo_metadata?.og_image || '',
    keywords: initialData?.seo_metadata?.keywords || '',
    no_index: initialData?.seo_metadata?.no_index || false,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema) as any,
    defaultValues,
  });

  const watchTitle = watch('title');
  const watchMetaTitle = watch('meta_title');
  const watchMetaDescription = watch('meta_description');
  const watchExcerpt = watch('excerpt');

  // Auto-generate slug on title change
  useEffect(() => {
    if (mode === 'create' && watchTitle) {
      const generatedSlug = slugify(watchTitle, { lower: true, strict: true });
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [watchTitle, mode, setValue]);

  const onSubmit = async (data: BlogFormValues, actionType: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      // Override status based on which button was clicked
      const formDataToSubmit = { ...data, status: actionType };

      let result;
      if (mode === 'create') {
        result = await createBlog(formDataToSubmit);
      } else {
        result = await updateBlog(initialData.id, formDataToSubmit);
      }

      if (result.success) {
        toast.success(`Blog successfully ${actionType === 'published' ? 'published' : 'saved as draft'}!`);
        setTimeout(() => {
          router.push('/admin/blogs');
          router.refresh(); // Ensure list is updated
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to save blog');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollReveal variant="fadeUp" className="max-w-5xl mx-auto pb-20">
      <form className="space-y-8">
        {/* Main Content Actions - Top */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.03)] border border-[#F3F4F6] mb-6 sticky top-0 z-10 transition-shadow hover:shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.06)]">
          <h1 className="text-2xl font-bold text-gray-800">{mode === 'create' ? 'Create New Blog' : 'Edit Blog'}</h1>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/blogs')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data as BlogFormValues, 'draft'))}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-200 disabled:opacity-50 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data as BlogFormValues, 'published'))}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700 disabled:opacity-50 flex items-center shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter blog title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="blog-post-slug"
                />
                {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief summary of the blog post"
                />
                <div className="flex justify-between mt-1">
                  {errors.excerpt ? (
                    <p className="text-sm text-red-600">{errors.excerpt.message}</p>
                  ) : <span />}
                  <p className={`text-xs ${(watchExcerpt?.length || 0) > 300 ? 'text-red-600' : 'text-gray-500'}`}>
                    {(watchExcerpt?.length || 0)} / 300 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6]">
              <label className="block text-sm font-medium text-gray-700 mb-3">Content</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value || ''} onChange={field.onChange} />
                )}
              />
            </div>

            {/* SEO Section */}
            <div className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden">
              <button
                type="button"
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                onClick={() => setIsSeoOpen(!isSeoOpen)}
              >
                <h3 className="text-lg font-medium text-gray-800">SEO Settings</h3>
                {isSeoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              {isSeoOpen && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                    <input
                      type="text"
                      {...register('meta_title')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO optimized title"
                    />
                    <p className={`text-xs mt-1 ${(watchMetaTitle?.length || 0) > 60 ? 'text-red-600' : 'text-gray-500'}`}>
                      {(watchMetaTitle?.length || 0)} / 60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <textarea
                      {...register('meta_description')}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO optimized description"
                    />
                    <p className={`text-xs mt-1 ${(watchMetaDescription?.length || 0) > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                      {(watchMetaDescription?.length || 0)} / 160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                    <input
                      type="text"
                      {...register('keywords')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="react, nextjs, blog (comma separated)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                    <input
                      type="text"
                      {...register('og_image')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="no_index"
                      {...register('no_index')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="no_index" className="ml-2 block text-sm text-gray-700">
                      Prevent search engines from indexing this page
                    </label>
                  </div>

                  {/* Google Preview */}
                  <div className="mt-8 border text-sm p-4 rounded-md bg-white shadow-sm">
                    <p className="font-semibold text-gray-700 mb-2">Search Engine Preview</p>
                    <div className="max-w-[600px]">
                      <span className="text-gray-600 text-[13px] block">https://yoursite.com/blog/{watch('slug') || 'your-slug-here'}</span>
                      <h3 className="text-[#1a0dab] text-xl truncate mb-1 pointer-events-none hover:underline">
                        {watchMetaTitle || watchTitle || 'Your Blog Title Here'}
                      </h3>
                      <p className="text-[#4d5156] line-clamp-2 text-[14px] leading-snug">
                        {watchMetaDescription || watchExcerpt || 'Provide a meta description by editing the field above to see how it will appear in search results.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image */}
             <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6]">
                <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Cover Image</h3>
                <Controller
                  name="cover_image"
                  control={control}
                  render={({ field }: { field: any }) => (
                    <ImageUploader 
                      value={field.value} 
                      onUpload={field.onChange} 
                      folder="blog_covers" 
                    />
                  )}
                />
            </div>

            {/* Organization */}
            <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
               <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Organization</h3>
               
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  {...register('category')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Technology"
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="react, web, design"
                />
                {/* Visual Tags Representation */}
                {watch('tags') && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {watch('tags')?.split(',').map((tag: string, i: number) => tag.trim() ? (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {tag.trim()}
                      </span>
                    ) : null)}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      {...register('featured')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Feature this blog post
                    </label>
                  </div>
              </div>
            </div>

            {/* Author */}
             <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
               <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Author Details</h3>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                <input
                  type="text"
                  {...register('author_name')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Author Image</label>
                  <Controller
                    name="author_image"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <div className="flex gap-4 items-center">
                         {field.value && (
                           <img src={field.value} alt="Author" className="w-12 h-12 rounded-full object-cover" />
                         )}
                         <div className="flex-1">
                           <ImageUploader 
                            value={field.value} 
                            onUpload={field.onChange} 
                            folder="authors" 
                          />
                         </div>
                      </div>
                    )}
                  />
               </div>
            </div>

          </div>
        </div>
      </form>
    </ScrollReveal>
  );
}
