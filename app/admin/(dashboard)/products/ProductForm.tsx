'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowRight, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import IconPicker from '@/components/admin/IconPicker';
import { createProduct, updateProduct } from '@/lib/actions/products';
import AdminListClient from '@/components/admin/AdminListClient';

const statSchema = z.object({ value: z.string().min(1, 'Required'), label: z.string().min(1, 'Required') });
const logoSchema = z.object({ name: z.string().min(1, 'Required'), logoUrl: z.string().min(1, 'Required') });
const whyChooseSchema = z.object({ icon: z.string().min(1, 'Required'), name: z.string().min(1, 'Required'), description: z.string().min(1, 'Required') });

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional().nullable(),
  userCount: z.string().optional().nullable(),
  fullName: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  
  stats: z.array(statSchema).max(4).optional().nullable(),
  trustedLogos: z.array(logoSchema).optional().nullable(),
  
  whyChooseTitle: z.string().optional().nullable(),
  whyChooseDesc: z.string().optional().nullable(),
  whyChoosePoints: z.array(whyChooseSchema).max(8).optional().nullable(),
  
  seo: z.object({
    meta_title: z.string().max(60).optional().nullable(),
    meta_description: z.string().max(160).optional().nullable(),
    og_image: z.string().optional().nullable()
  }).optional().nullable()
});

type ProductFormData = z.infer<typeof productSchema>;

// These must be defined OUTSIDE the component to avoid re-mount on every render
const Card = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden">
    <div className="px-6 py-4 bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);

const Input = (props: any) => (
  <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white placeholder-gray-400" {...props} />
);

function getUserFriendlyErrorMessage(err: unknown) {
  const rawMessage = err instanceof Error ? err.message : typeof err === 'string' ? err : '';
  const lower = rawMessage.toLowerCase();

  if (lower.includes('connection pool') || lower.includes('timed out fetching')) {
    return 'Server is busy right now. Please try again in a few seconds.';
  }

  if (lower.includes('unknown argument') || lower.includes('invalid `prisma')) {
    return 'Database mismatch detected. Please restart your dev server (npm run dev) and try again.';
  }

  if (lower.includes('prisma') || lower.includes('invocation') || rawMessage.length > 200) {
    return 'An unexpected database error occurred. Please try again or check server logs.';
  }

  return rawMessage || 'Operation failed. Please try again in a few moments.';
}

export default function ProductForm({
  defaultValues,
  productId,
  testimonials,
  hideStats = false,
  hideTestimonials = false,
}: {
  defaultValues?: any;
  productId?: number;
  testimonials?: any[];
  hideStats?: boolean;
  hideTestimonials?: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      slug: defaultValues?.slug || '',
      icon: defaultValues?.icon || '',
      userCount: defaultValues?.userCount || '',
      fullName: defaultValues?.fullName || '',
      shortDescription: defaultValues?.shortDescription || '',
      tagline: defaultValues?.tagline || '',
      description: defaultValues?.description || '',
      status: defaultValues?.status || 'draft',
      featured: defaultValues?.featured || false,
      sortOrder: defaultValues?.sortOrder || 0,
      stats: defaultValues?.stats || [],
      trustedLogos: defaultValues?.trustedLogos || [],
      whyChooseTitle: defaultValues?.whyChooseTitle || '',
      whyChooseDesc: defaultValues?.whyChooseDesc || '',
      whyChoosePoints: defaultValues?.whyChoosePoints || [],
      seo: {
        meta_title: defaultValues?.seo?.meta_title || '',
        meta_description: defaultValues?.seo?.meta_description || '',
        og_image: defaultValues?.seo?.og_image || ''
      }
    }
  });

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const statsArray = useFieldArray({ control, name: 'stats' as const });
  const logosArray = useFieldArray({ control, name: 'trustedLogos' as const });
  const whyChooseArray = useFieldArray({ control, name: 'whyChoosePoints' as const });

  const watchName = watch('name');
  const watchSlug = watch('slug');
  const [isSlugEdited, setIsSlugEdited] = useState(!!defaultValues?.slug);

  useEffect(() => {
    if (watchName && !isSlugEdited) {
      const generatedSlug = watchName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (generatedSlug !== watchSlug) {
        setValue('slug', generatedSlug, { shouldValidate: true });
      }
    }
  }, [watchName, isSlugEdited, watchSlug, setValue]);

  const onSubmit = async (data: any, actionTarget: 'draft' | 'continue') => {
    try {
      setIsSubmitting(true);
      setLastSavedAt(null);
      
      // "Save Draft" sirf NEW product page par status ko draft force kare.
      // Edit page ("Save Changes") par user ne jo status select kiya hai usko preserve rakhna hai.
      if (actionTarget === 'draft' && !productId) {
        data.status = 'draft';
      }

      let result;
      if (productId) {
        result = await updateProduct(productId, data);
        toast.success('Product updated successfully');
      } else {
        result = await createProduct(data);
        toast.success('Product created successfully');
      }

      setLastSavedAt(Date.now());

      if (actionTarget === 'continue' || !productId) {
        router.push(`/admin/products/${result.id}`);
      } else {
        router.refresh();
      }
      
    } catch (error) {
      console.error(error);
      toast.error(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form className="space-y-6 pb-24" onSubmit={(e) => e.preventDefault()}>
      
      {/* SECTION 1: Basic Info */}
      <Card title="Basic Information" subtitle="The core details of your product system.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Name *</Label>
            <Input {...register('name')} placeholder="e.g. Acme ERP" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
          </div>
          
          <div>
            <Label>Slug *</Label>
            <Input 
              {...register('slug')} 
              onChange={(e: any) => {
                setIsSlugEdited(true);
                setValue('slug', e.target.value);
              }}
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message as string}</p>}
          </div>

          <div>
            <Label>Full Name (For Card)</Label>
            <Input {...register('fullName')} placeholder="e.g. Enterprise Resource Planning" />
          </div>

          <div>
            <Label>Active Users count (For Card)</Label>
            <Input {...register('userCount')} placeholder="e.g. 50K+" />
          </div>

          <div className="md:col-span-2">
            <Label>Display Icon</Label>
            <IconPicker 
              value={watch('icon') || ''} 
              onChange={(val) => setValue('icon', val)} 
            />
          </div>

          <div className="md:col-span-2">
            <Label>Short Description (For Card)</Label>
            <textarea
              {...register('shortDescription')}
              rows={2}
              placeholder="A brief 1-2 line description for the product card..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white placeholder-gray-400 resize-y"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Tagline</Label>
            <Input {...register('tagline')} placeholder="Short punchy line..." />
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Describe what this product does..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white placeholder-gray-400 resize-y"
            />
          </div>



          <div>
            <Label>Status</Label>
            <select {...register('status')} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="mt-auto flex items-center h-full">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('featured')} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Show on homepage</span>
            </label>
          </div>
        </div>
      </Card>

      {/* SECTION 3: Trusted By Logos */}
      <Card title="Trusted By Logos" subtitle="Companies that use this product.">
        <div className="space-y-4 mb-4">
          {logosArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start bg-gray-50 border border-gray-200 p-4 rounded-lg relative">
              <button type="button" onClick={() => logosArray.remove(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 bg-white rounded-full shadow-sm border border-gray-200 z-10 transition-colors">
                <Trash2 size={18} />
              </button>
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Name</label>
                <Input {...register(`trustedLogos.${index}.name` as const)} placeholder="Acme Corp" />
                {errors.trustedLogos?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.trustedLogos[index]?.name?.message as string}</p>}
              </div>
              <div className="w-full sm:w-64 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Logo</label>
                <div className="relative">
                  <ImageUploader 
                    value={watch(`trustedLogos.${index}.logoUrl` as any) || ''} 
                    onUpload={(url: string) => setValue(`trustedLogos.${index}.logoUrl` as any, url)}
                    showLibrary={true}
                  />
                </div>
                {errors.trustedLogos?.[index]?.logoUrl && <p className="text-red-500 text-xs mt-1">{errors.trustedLogos[index]?.logoUrl?.message as string}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-4">
          <button type="button" onClick={() => logosArray.append({ name: '', logoUrl: '' })} className="flex items-center justify-center w-full py-3 gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium border border-dashed border-indigo-200 rounded-lg transition-colors">
            <Plus size={16} /> Add Logo
          </button>
        </div>
      </Card>

      {!hideStats && (
        <Card title="Stats Bar" subtitle="Key metrics to show trust and scale (max 4).">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Current stats</h3>
                <button
                  type="button"
                  onClick={() => {
                    if (statsArray.fields.length >= 4) return;
                    statsArray.append({ value: '', label: '' });
                  }}
                  disabled={statsArray.fields.length >= 4}
                  className={[
                    'px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                    statsArray.fields.length < 4
                      ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
                  ].join(' ')}
                >
                  <span className="inline-flex items-center gap-2">
                    <Plus size={16} /> Add Stat
                  </span>
                </button>
              </div>

              <div className="space-y-4 mb-4">
                {statsArray.fields.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3 relative group transition">
                    <button type="button" onClick={() => statsArray.remove(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors bg-white p-1 rounded-full shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100" title="Delete stat">
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Value</label>
                        <Input {...register(`stats.${index}.value` as const)} placeholder="15+" />
                        {errors.stats?.[index]?.value && <p className="text-red-500 text-xs mt-1">{errors.stats[index]?.value?.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Label</label>
                        <Input {...register(`stats.${index}.label` as const)} placeholder="Modules" />
                        {errors.stats?.[index]?.label && <p className="text-red-500 text-xs mt-1">{errors.stats[index]?.label?.message as string}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {statsArray.fields.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl bg-white p-8 text-center">
                  <p className="text-gray-700 font-semibold">No stats configured</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click “Add Stat” to create up to 4 rows.
                  </p>
                </div>
              )}

              {statsArray.fields.length > 0 && statsArray.fields.length < 4 && (
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <button type="button" onClick={() => statsArray.append({ value: '', label: '' })} className="flex items-center justify-center w-full py-3 gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium border border-dashed border-indigo-200 rounded-lg transition-colors">
                    <Plus size={16} /> Add Stat
                  </button>
                </div>
              )}
            </div>

            {/* Preview */}
            <div>
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-linear-to-r from-[#E96429] to-[#2251B5] p-5 h-[calc(100%-24px)] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-bold">Live Preview</p>
                  <p className="text-white/80 text-xs font-semibold">{watch('stats')?.length || 0}/4</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-8 gap-x-4 my-auto">
                  {((watch('stats') || []) as any[]).slice(0, 4).map((stat: any, idx: number) => (
                    <div key={`preview-${idx}`} className="text-center flex flex-col items-center gap-1">
                      <div className="font-['Inter'] font-bold text-3xl md:text-[38px] leading-none text-white">
                        {stat.value || '—'}
                      </div>
                      <div className="font-['Inter'] font-normal text-sm md:text-base leading-relaxed text-white/80">
                        {stat.label || ' '}
                      </div>
                    </div>
                  ))}
                  {((watch('stats') || []) as any[]).length < 4 &&
                    Array.from({ length: 4 - ((watch('stats') || []) as any[]).length }).map((_, i) => (
                      <div key={`empty-${i}`} className="text-center flex flex-col items-center gap-1 opacity-60">
                        <div className="font-bold text-3xl text-white">—</div>
                        <div className="text-sm text-white/80"> </div>
                      </div>
                    ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                This preview reflects `product.stats` (up to 4 visible on the main UI).
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 4: Why Choose */}
      <Card title="Why Choose Features" subtitle="Highlight unique selling points (Max 8).">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <Label>Section Title</Label>
            <Input {...register('whyChooseTitle')} placeholder="Why choose our product?" />
          </div>
          <div>
            <Label>Section Description</Label>
            <Input {...register('whyChooseDesc')} placeholder="Brief subtitle..." />
          </div>
        </div>

        <div className="space-y-4 mb-4">
          {whyChooseArray.fields.map((field, index) => (
            <div key={field.id} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm relative group">
              <button type="button" onClick={() => whyChooseArray.remove(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1.5 bg-gray-50 hover:bg-red-50 rounded-full">
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Feature Name</label>
                    <Input {...register(`whyChoosePoints.${index}.name` as const)} placeholder="Advanced Security" />
                    {errors.whyChoosePoints?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.whyChoosePoints[index]?.name?.message as string}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Display Icon</label>
                    <IconPicker 
                      value={watch(`whyChoosePoints.${index}.icon` as any) || ''} 
                      onChange={(val) => setValue(`whyChoosePoints.${index}.icon` as any, val)} 
                    />
                    {errors.whyChoosePoints?.[index]?.icon && <p className="text-red-500 text-xs mt-1">{errors.whyChoosePoints[index]?.icon?.message as string}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                  <textarea {...register(`whyChoosePoints.${index}.description` as const)} rows={8} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none"></textarea>
                  {errors.whyChoosePoints?.[index]?.description && <p className="text-red-500 text-xs mt-1">{errors.whyChoosePoints[index]?.description?.message as string}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {whyChooseArray.fields.length < 8 && (
          <div className="border-t border-gray-100 pt-4">
            <button type="button" onClick={() => whyChooseArray.append({ icon: '', name: '', description: '' })} className="flex items-center justify-center w-full py-3 gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium border border-dashed border-indigo-200 rounded-lg transition-colors">
              <Plus size={16} /> Add Feature Point
            </button>
          </div>
        )}
      </Card>

      {/* SECTION 5: SEO */}
      <Card title="Search Engine Optimization (SEO)">
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <Label>Meta Title</Label>
                <span className={`text-xs ${(watch('seo.meta_title') || '').length > 60 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{(watch('seo.meta_title') || '').length}/60</span>
              </div>
              <Input {...register('seo.meta_title')} maxLength={60} placeholder="SEO optimized title..." />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <Label>Meta Description</Label>
                <span className={`text-xs ${(watch('seo.meta_description') || '').length > 160 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{(watch('seo.meta_description') || '').length}/160</span>
              </div>
              <textarea {...register('seo.meta_description')} rows={5} maxLength={160} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none" placeholder="Description for search engines..."></textarea>
            </div>
          </div>
          <div>
            <Label>Open Graph Image / Share Banner</Label>
            <div className="mt-1">
              <ImageUploader 
                value={watch('seo.og_image') || ''} 
                onUpload={(url: string) => setValue('seo.og_image', url)} 
                folder="seo" 
              />
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 7: Testimonials */}
      {!hideTestimonials && productId && (
        <Card title="Testimonials" subtitle="Manage client testimonials for this product.">
          <AdminListClient
            items={testimonials ?? []}
            section="testimonials"
            columns={[
              { key: 'client_name', label: 'Client', type: 'client_info' },
              { key: 'rating', label: 'Rating', type: 'rating' },
              { key: 'content', label: 'Preview', type: 'text' },
            ]}
          />
        </Card>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-[260px] right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <div className="w-full max-w-[1600px] px-8 py-2.5 flex items-center justify-between gap-4 min-h-[56px]">
          {/* Left: live product name preview */}
          <div className="hidden sm:flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Save size={15} className="text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {watch('name') || (productId ? 'Editing product' : 'New product')}
              </p>
              <p className="text-xs text-gray-400">
                {isSubmitting ? 'Saving...' : lastSavedAt ? 'Saved' : productId ? 'Changes are not saved yet' : 'Not saved yet'}
              </p>
            </div>
            {watch('status') && (
              <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                watch('status') === 'published'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}>
                {watch('status')}
              </span>
            )}
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Save Draft only on new product page */}
            {!productId && (
              <button
                type="button"
                onClick={handleSubmit((data: any) => onSubmit(data, 'draft'))}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={15} />}
                Save Draft
              </button>
            )}

            {/* Primary action */}
            <button
              type="button"
              onClick={handleSubmit((data: any) => onSubmit(data, productId ? 'draft' : 'continue'))}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm shadow-sm"
            >
              {isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : productId ? <Save size={15} /> : <ArrowRight size={15} />
              }
              {productId ? 'Save Changes' : 'Create & Setup Modules'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
