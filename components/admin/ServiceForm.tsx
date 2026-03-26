'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import SeoPanel from './SeoPanel';
import { createService, updateService, getServiceCategories } from '@/lib/actions/services';
import { toast } from 'sonner';
import ScrollReveal from '@/components/animations/ScrollReveal';

// ─── Schema ───────────────────────────────────────────────────────────────────

const textItemSchema = z.object({
  text: z.string().min(1, 'Cannot be empty'),
});

const featureSectionSchema = z.object({
  title: z.string().min(1, 'Section title required'),
  items: z.array(textItemSchema),
});

const processStepSchema = z.object({
  step: z.coerce.number().min(1),
  title: z.string().min(1, 'Title required'),
  description: z.string().optional().or(z.literal('')),
});

const toolSchema = z.object({
  name: z.string().min(1, 'Name required'),
  icon: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
});

const statSchema = z.object({
  value: z.string().min(1, 'Value required'),
  label: z.string().min(1, 'Label required'),
});

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().max(300).optional().or(z.literal('')),
  icon: z.string().optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  features: z.array(featureSectionSchema).optional(),
  startingPrice: z.string().optional().or(z.literal('')),
  processSteps: z.array(processStepSchema).optional(),
  toolsUsed: z.array(toolSchema).optional(),
  stats: z.array(statSchema).optional(),
  ctaTitle: z.string().optional().or(z.literal('')),
  ctaSubtitle: z.string().optional().or(z.literal('')),
  sort_order: z.coerce.number().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  meta_title: z.string().optional().or(z.literal('')),
  meta_description: z.string().optional().or(z.literal('')),
  og_image: z.string().optional().or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
  no_index: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeParseJson<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === 'string') {
    try { return JSON.parse(val) as T; } catch { return fallback; }
  }
  return fallback;
}

function Card({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex justify-between items-center bg-[#F9FAFB]/80 border-b border-[#F3F4F6] hover:bg-gray-50 transition-colors">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>{children}</label>;
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y ${className}`}
      {...props}
    />
  );
}

function FeatureSectionList({ nestIndex, control, register, removeSection }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `features.${nestIndex}.items` as const,
  });

  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 relative group mb-4">
      <button type="button" onClick={removeSection} title="Remove Section"
        className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
        <Trash2 size={16} />
      </button>
      <div className="mb-4 pr-10">
        <Label>Section Title</Label>
        <Input {...register(`features.${nestIndex}.title`)} placeholder="e.g. Deliverables, Key Metrics, Tools" className="bg-white font-medium" />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">List Items</Label>
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input {...register(`features.${nestIndex}.items.${i}.text`)} placeholder="Item text..." className="bg-white" />
            <button type="button" onClick={() => remove(i)} title="Remove Item"
              className="text-red-400 hover:text-red-600 p-2 border border-transparent hover:border-red-100 hover:bg-red-50 rounded-md transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append({ text: '' })}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium pt-2">
          <Plus size={16} /> Add Item
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Category = { id: string; name: string; icon: string | null };

export default function ServiceForm({ initialData, mode }: { initialData?: any; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getServiceCategories().then(setCategories);
  }, []);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema) as any,
      defaultValues: {
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        icon: initialData?.icon || '',
        categoryId: initialData?.categoryId || '',
        features: safeParseJson<FormValues['features']>(initialData?.features, []),
        startingPrice: initialData?.startingPrice || '',
        processSteps: safeParseJson<FormValues['processSteps']>(initialData?.processSteps, []),
        toolsUsed: safeParseJson<FormValues['toolsUsed']>(initialData?.toolsUsed, []),
        stats: safeParseJson<FormValues['stats']>(initialData?.stats, []),
        ctaTitle: initialData?.ctaTitle || '',
        ctaSubtitle: initialData?.ctaSubtitle || '',
        sort_order: initialData?.sort_order || 0,
        status: initialData?.status || 'draft',
        featured: initialData?.featured || false,
        meta_title: initialData?.seo_metadata?.meta_title || '',
        meta_description: initialData?.seo_metadata?.meta_description || '',
        og_image: initialData?.seo_metadata?.og_image || '',
        keywords: initialData?.seo_metadata?.keywords || '',
        no_index: initialData?.seo_metadata?.no_index || false,
      },
    });

  const { fields: stepFields, append: appendStep, remove: removeStep } =
    useFieldArray({ control, name: 'processSteps' });

  const { fields: toolFields, append: appendTool, remove: removeTool } =
    useFieldArray({ control, name: 'toolsUsed' });

  const { fields: statFields, append: appendStat, remove: removeStat } =
    useFieldArray({ control, name: 'stats' });

  const { fields: featureSections, append: appendFeatureSection, remove: removeFeatureSection } =
    useFieldArray({ control, name: 'features' });

  // Auto-slug on create
  const watchTitle = watch('title');
  useEffect(() => {
    if (mode === 'create' && watchTitle) {
      setValue('slug', slugify(watchTitle, { lower: true, strict: true }));
    }
  }, [watchTitle, mode, setValue]);

  const onSubmit = async (data: FormValues, status: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        features: JSON.stringify(data.features || []),
        status,
        processSteps: JSON.stringify(data.processSteps || []),
        toolsUsed: JSON.stringify(data.toolsUsed || []),
        stats: JSON.stringify(data.stats || []),
      };
      const result = mode === 'create'
        ? await createService(payload as any)
        : await updateService(initialData.id, payload as any);

      if (result.success) {
        toast.success(`Service ${status === 'published' ? 'published' : 'saved as draft'}!`);
        setTimeout(() => { router.push('/admin/services'); router.refresh(); }, 1500);
      } else {
        throw new Error((result as any).error);
      }
    } catch (e: any) {
      toast.error(e.message || 'Error saving service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pill = (text: string) => (
    <span key={text} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full mr-1 mb-1">
      {text}
    </span>
  );

  return (
    <ScrollReveal variant="fadeUp" className="max-w-5xl mx-auto pb-24">
      <form className="space-y-6">

        {/* ── Sticky Topbar ── */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.03)] border border-[#F3F4F6] mb-6 sticky top-0 z-10 transition-shadow hover:shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-bold text-gray-800">
            {mode === 'create' ? 'New Service' : 'Edit Service'}
          </h1>
          <div className="flex gap-2">
            <button type="button" onClick={() => router.push('/admin/services')} disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit(d => onSubmit(d, 'draft'))} disabled={isSubmitting}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Draft
            </button>
            <button type="button" onClick={handleSubmit(d => onSubmit(d, 'published'))} disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 shadow-sm">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Info */}
            <Card title="Basic Information">
              <div className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input {...register('title')} placeholder="Service title" />
                  {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                </div>
                <div>
                  <Label>Slug *</Label>
                  <Input {...register('slug')} className="bg-gray-50" />
                </div>
                <div>
                  <Label>Excerpt <span className="text-gray-400 font-normal">(max 300 chars)</span></Label>
                  <Textarea {...register('excerpt')} rows={2} placeholder="Short one-liner for cards" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Icon <span className="text-gray-400 font-normal">(emoji / Lucide name)</span></Label>
                    <Input {...register('icon')} placeholder="Code2" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select {...register('categoryId')}
                      value={watch('categoryId') || ''}
                      onChange={(e) => setValue('categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                      <option value="">— None —</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Dynamic Features & Lists */}
            <Card title="Dynamic Features & Lists">
              <p className="text-sm text-gray-500 mb-6">
                Create custom lists for this service. For example: "Deliverables", "Key Metrics", "Platforms & Tools", or "Expected Outcomes".
              </p>
              
              <div className="space-y-1">
                {featureSections.map((sectionField, sectionIndex) => (
                  <FeatureSectionList
                    key={sectionField.id}
                    nestIndex={sectionIndex}
                    control={control}
                    register={register}
                    removeSection={() => removeFeatureSection(sectionIndex)}
                  />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => appendFeatureSection({ title: '', items: [{ text: '' }] })}
                  className="flex items-center justify-center w-full py-3 gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium border border-dashed border-indigo-200 rounded-lg transition-colors">
                  <Plus size={16} /> Add New List Section
                </button>
              </div>
            </Card>

            {/* Process Steps */}
            <Card title="Process Steps" defaultOpen={false}>
              <div className="space-y-3">
                {stepFields.map((field, i) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-start border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="col-span-1">
                      <Label>Step</Label>
                      <Input type="number" {...register(`processSteps.${i}.step`)} className="text-center" />
                    </div>
                    <div className="col-span-4">
                      <Label>Title</Label>
                      <Input {...register(`processSteps.${i}.title`)} placeholder="Discovery" />
                    </div>
                    <div className="col-span-6">
                      <Label>Description</Label>
                      <Textarea {...register(`processSteps.${i}.description`)} rows={2} placeholder="What happens in this step" />
                    </div>
                    <div className="col-span-1 flex justify-end pt-6">
                      <button type="button" onClick={() => removeStep(i)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => appendStep({ step: stepFields.length + 1, title: '', description: '' })}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <Plus size={16} /> Add Step
                </button>
              </div>
            </Card>

            {/* Tools Used */}
            <Card title="Tools / Tech Stack" defaultOpen={false}>
              <div className="space-y-3">
                {toolFields.map((field, i) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-start border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="col-span-4">
                      <Label>Name</Label>
                      <Input {...register(`toolsUsed.${i}.name`)} placeholder="Figma" />
                    </div>
                    <div className="col-span-4">
                      <Label>Icon / URL</Label>
                      <Input {...register(`toolsUsed.${i}.icon`)} placeholder="icon name or URL" />
                    </div>
                    <div className="col-span-3">
                      <Label>Category</Label>
                      <Input {...register(`toolsUsed.${i}.category`)} placeholder="Design" />
                    </div>
                    <div className="col-span-1 flex justify-end pt-6">
                      <button type="button" onClick={() => removeTool(i)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => appendTool({ name: '', icon: '', category: '' })}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <Plus size={16} /> Add Tool
                </button>
              </div>
            </Card>

            {/* Stats */}
            <Card title="Stats Bar" defaultOpen={false}>
              <p className="text-xs text-gray-500 mb-3">Numbers shown in the stats strip on the detail page (e.g. "50+ Projects")</p>
              <div className="space-y-3">
                {statFields.map((field, i) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-start border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="col-span-4">
                      <Label>Value</Label>
                      <Input {...register(`stats.${i}.value`)} placeholder="50+" />
                    </div>
                    <div className="col-span-7">
                      <Label>Label</Label>
                      <Input {...register(`stats.${i}.label`)} placeholder="Projects Delivered" />
                    </div>
                    <div className="col-span-1 flex justify-end pt-6">
                      <button type="button" onClick={() => removeStat(i)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => appendStat({ value: '', label: '' })}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <Plus size={16} /> Add Stat
                </button>
              </div>
            </Card>

            {/* CTA */}
            <Card title="Call to Action" defaultOpen={false}>
              <div className="space-y-4">
                <div>
                  <Label>CTA Title</Label>
                  <Input {...register('ctaTitle')} placeholder="Ready to get started?" />
                </div>
                <div>
                  <Label>CTA Subtitle</Label>
                  <Textarea {...register('ctaSubtitle')} rows={2} placeholder="Let's build something great together." />
                </div>
              </div>
            </Card>

            {/* SEO */}
            <Card title="SEO Settings" defaultOpen={false}>
              <SeoPanel register={register} watch={watch} slug={`services/${watch('slug')}`} title={watch('title')} />
            </Card>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Settings */}
            <div className="bg-white p-5 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2 text-sm">Settings</h3>
              <div>
                <Label>Starting Price</Label>
                <Input {...register('startingPrice')} placeholder="Starting at $5,000" />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" {...register('sort_order')} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" {...register('featured')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="featured" className="text-sm text-gray-700">Featured service</label>
              </div>
            </div>

          </div>
        </div>
      </form>
    </ScrollReveal>
  );
}
