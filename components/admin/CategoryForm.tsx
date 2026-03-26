'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { Loader2 } from 'lucide-react';
import { createServiceCategory, updateServiceCategory } from '@/lib/actions/serviceCategories';
import { toast } from 'sonner';
import ScrollReveal from '@/components/animations/ScrollReveal';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional().or(z.literal('')),
  shortDescription: z.string().max(200).optional().or(z.literal('')),
  heroTitle: z.string().optional().or(z.literal('')),
  heroSubtitle: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  sortOrder: z.coerce.number().optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

type FormValues = z.infer<typeof schema>;

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}
function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${className}`} {...props} />
  );
}
function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y ${className}`} {...props} />
  );
}

const LUCIDE_SUGGESTIONS = ['Code2', 'Palette', 'Megaphone', 'Server', 'Lightbulb', 'Briefcase', 'Globe', 'ShoppingCart', 'BarChart', 'Shield'];

export default function CategoryForm({ initialData, mode }: { initialData?: any; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      icon: initialData?.icon || '',
      shortDescription: initialData?.shortDescription || '',
      heroTitle: initialData?.heroTitle || '',
      heroSubtitle: initialData?.heroSubtitle || '',
      description: initialData?.description || '',
      sortOrder: initialData?.sortOrder || 0,
      status: initialData?.status || 'draft',
    },
  });

  const watchName = watch('name');
  useEffect(() => {
    if (mode === 'create' && watchName) {
      setValue('slug', slugify(watchName, { lower: true, strict: true }));
    }
  }, [watchName, mode, setValue]);

  const onSubmit = async (data: FormValues, status: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      const result = mode === 'create'
        ? await createServiceCategory({ ...data, status })
        : await updateServiceCategory(initialData.id, { ...data, status });

      if (result.success) {
        toast.success(`Category ${status === 'published' ? 'published' : 'saved'}!`);
        setTimeout(() => { router.push('/admin/services/categories'); router.refresh(); }, 1200);
      } else {
        throw new Error((result as any).error);
      }
    } catch (e: any) {
      toast.error(e.message || 'Error saving category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconVal = watch('icon');

  return (
    <ScrollReveal variant="fadeUp" className="max-w-2xl mx-auto pb-16">
      <form className="space-y-6">
        {/* Sticky Topbar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.03)] border border-[#F3F4F6] mb-6 sticky top-0 z-10 transition-shadow hover:shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-bold text-gray-800">
            {mode === 'create' ? 'New Category' : 'Edit Category'}
          </h1>
          <div className="flex gap-2">
            <button type="button" onClick={() => router.push('/admin/services/categories')}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit(d => onSubmit(d, 'draft'))}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Draft
            </button>
            <button type="button" onClick={handleSubmit(d => onSubmit(d, 'published'))}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 shadow-sm">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Publish
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-5">
          <div>
            <Label>Name *</Label>
            <Input {...register('name')} placeholder="Development" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Slug *</Label>
            <Input {...register('slug')} className="bg-gray-50" />
          </div>

          <div>
            <Label>Icon <span className="text-gray-400 font-normal">(Lucide icon name or emoji)</span></Label>
            <Input {...register('icon')} placeholder="Code2" />
            {/* Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1">
              {LUCIDE_SUGGESTIONS.map(s => (
                <button key={s} type="button"
                  onClick={() => setValue('icon', s)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${iconVal === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-blue-400'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Short Description <span className="text-gray-400 font-normal">(max 200 chars)</span></Label>
            <Textarea {...register('shortDescription')} rows={2} placeholder="One-liner shown on category cards" />
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 text-sm">Hero Section</h3>
            <div>
              <Label>Hero Title</Label>
              <Input {...register('heroTitle')} placeholder="Big heading for category page" />
            </div>
            <div>
              <Label>Hero Subtitle</Label>
              <Textarea {...register('heroSubtitle')} rows={2} placeholder="Supporting text below the hero title" />
            </div>
          </div>

          <div>
            <Label>Full Description</Label>
            <Textarea {...register('description')} rows={4} placeholder="Detailed description for the category page" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Sort Order</Label>
              <Input type="number" {...register('sortOrder')} />
            </div>
            <div>
              <Label>Status</Label>
              <select {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </ScrollReveal>
  );
}
