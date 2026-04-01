'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from 'lucide-react';
import SeoPanel from './SeoPanel';
import { createService, updateService } from '@/lib/actions/services';
import { toast } from 'sonner';


// ─── Schema ───────────────────────────────────────────────────────────────────

const statItemSchema = z.object({
  value: z.string().min(1, 'Value required'),
  label: z.string().min(1, 'Label required'),
});

const subServiceSchema = z.object({
  icon: z.string().min(1, 'Icon required'),
  name: z.string().min(1, 'Name required'),
  description: z.string().min(1, 'Description required'),
  shortDescription: z.string().max(150, 'Max 150 characters').optional().or(z.literal('')),
  featuresHeading: z.string().optional().or(z.literal('')),
  features: z.array(z.string()).optional(),
  technologiesHeading: z.string().optional().or(z.literal('')),
  technologies: z.array(z.string()).optional(),
});

const processStepSchema = z.object({
  number: z.coerce.number().min(1).max(4),
  heading: z.string().min(1, 'Heading required'),
  description: z.string().min(1, 'Description required'),
});

const techCategorySchema = z.object({
  name: z.string().min(1, 'Category name required'),
  items: z.array(z.string()).optional(),
});

const techSectionSchema = z.object({
  heading: z.string().optional().or(z.literal('')),
  categories: z.array(techCategorySchema).optional(),
});

const toolItemSchema = z.object({
  name: z.string().min(1, 'Name required'),
  icon: z.string().min(1, 'Icon required'),
});

const toolCategorySchema = z.object({
  name: z.string().min(1, 'Category name required'),
  tools: z.array(toolItemSchema).optional(),
});

const toolsSectionSchema = z.object({
  heading: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  categories: z.array(toolCategorySchema).optional(),
});

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().or(z.literal('')),
  blackHeading: z.string().optional().or(z.literal('')),
  blueHeading: z.string().optional().or(z.literal('')),
  icon: z.string().optional().or(z.literal('')),
  pillText: z.string().optional().or(z.literal('')),
  stats: z.array(statItemSchema).max(4, 'Maximum 4 stats allowed').optional(),
  subServicesHeading: z.string().optional().or(z.literal('')),
  subServicesDescription: z.string().optional().or(z.literal('')),
  subServices: z.array(subServiceSchema).optional(),
  processStepsHeading: z.string().optional().or(z.literal('')),
  processStepsDescription: z.string().optional().or(z.literal('')),
  processSteps: z.array(processStepSchema).max(4, 'Maximum 4 process steps').optional(),
  sectionType: z.enum(['technologies', 'tools']),
  techSection: techSectionSchema.optional(),
  toolsSection: toolsSectionSchema.optional(),
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
  if (typeof val === 'object' && val !== null) return val as T;
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


// ─── Section Editors ──────────────────────────────────────────────────────────

function StatsEditor({ control, register, errors }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: 'stats' });

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 mb-3">Display up to 4 statistics in the service header (e.g., "200+ Projects Delivered")</p>
      {fields.map((field, i) => (
        <div key={field.id} className="grid grid-cols-12 gap-2 items-start border border-gray-200 rounded-md p-3 bg-gray-50">
          <div className="col-span-4">
            <Label>Value</Label>
            <Input {...register(`stats.${i}.value`)} placeholder="200+" />
            {errors?.stats?.[i]?.value && <p className="text-xs text-red-600 mt-1">{errors.stats[i].value.message}</p>}
          </div>
          <div className="col-span-7">
            <Label>Label</Label>
            <Input {...register(`stats.${i}.label`)} placeholder="Projects Delivered" />
            {errors?.stats?.[i]?.label && <p className="text-xs text-red-600 mt-1">{errors.stats[i].label.message}</p>}
          </div>
          <div className="col-span-1 flex justify-end pt-6">
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      {fields.length < 4 && (
        <button type="button" onClick={() => append({ value: '', label: '' })}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
          <Plus size={16} /> Add Stat
        </button>
      )}
      {fields.length >= 4 && <p className="text-xs text-amber-600">Maximum 4 stats reached</p>}
      {errors?.stats?.root && <p className="text-xs text-red-600">{errors.stats.root.message}</p>}
    </div>
  );
}

function SubServicesEditor({ control, register, errors }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: 'subServices' });

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
          <button type="button" onClick={() => remove(i)} title="Remove Sub-Service"
            className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors bg-white p-1.5 rounded-full shadow-sm">
            <Trash2 size={16} />
          </button>
          <div className="space-y-3 pr-10">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Icon</Label>
                <Input {...register(`subServices.${i}.icon`)} placeholder="Code2" />
                {errors?.subServices?.[i]?.icon && <p className="text-xs text-red-600 mt-1">{errors.subServices[i].icon.message}</p>}
              </div>
              <div>
                <Label>Name</Label>
                <Input {...register(`subServices.${i}.name`)} placeholder="Web Development" />
                {errors?.subServices?.[i]?.name && <p className="text-xs text-red-600 mt-1">{errors.subServices[i].name.message}</p>}
              </div>
            </div>
            <div>
              <Label>Short Description <span className="text-gray-400 font-normal">(for services listing page, max 150 chars)</span></Label>
              <Textarea {...register(`subServices.${i}.shortDescription`)} rows={2} placeholder="Brief description for services page..." />
              {errors?.subServices?.[i]?.shortDescription && <p className="text-xs text-red-600 mt-1">{errors.subServices[i].shortDescription.message}</p>}
            </div>
            <div>
              <Label>Description <span className="text-gray-400 font-normal">(full description for sub-service card)</span></Label>
              <Textarea {...register(`subServices.${i}.description`)} rows={2} placeholder="Detailed description..." />
              {errors?.subServices?.[i]?.description && <p className="text-xs text-red-600 mt-1">{errors.subServices[i].description.message}</p>}
            </div>
            <div>
              <Label>Features Heading <span className="text-gray-400 font-normal">(e.g., "Key Features", "What We Do")</span></Label>
              <Input {...register(`subServices.${i}.featuresHeading`)} placeholder="Key Features" />
            </div>
            <SubServiceArrayField control={control} register={register} parentIndex={i} fieldName="features" label="Features" />
            <div>
              <Label>Technologies Heading <span className="text-gray-400 font-normal">(e.g., "Technologies", "Deliverables", "Platforms & Tools")</span></Label>
              <Input {...register(`subServices.${i}.technologiesHeading`)} placeholder="Technologies" />
            </div>
            <SubServiceArrayField control={control} register={register} parentIndex={i} fieldName="technologies" label="Technologies" />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => append({ icon: '', name: '', description: '', shortDescription: '', featuresHeading: '', features: [''], technologiesHeading: '', technologies: [''] })}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
        <Plus size={16} /> Add Sub-Service
      </button>
    </div>
  );
}

function SubServiceArrayField({ control, register, parentIndex, fieldName, label }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: `subServices.${parentIndex}.${fieldName}` });

  return (
    <div>
      <Label className="text-xs text-gray-600 uppercase tracking-wider">{label}</Label>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <Input {...register(`subServices.${parentIndex}.${fieldName}.${i}`)} placeholder={`${label} item...`} className="bg-white" />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append('')}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
          <Plus size={14} /> Add {label.slice(0, -1)}
        </button>
      </div>
    </div>
  );
}


function ProcessStepsEditor({ control, register, errors }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: 'processSteps' });

  return (
    <div className="space-y-4">
      <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-lg space-y-3">
        <h4 className="font-semibold text-gray-800 text-sm">Section Header</h4>
        <div>
          <Label>Heading</Label>
          <Input {...register('processStepsHeading')} placeholder="Our Development Process" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea {...register('processStepsDescription')} rows={2} placeholder="How we bring your ideas to life..." />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs text-gray-500 mb-3">Define exactly 4 process steps for the service workflow</p>
      {fields.map((field, i) => (
        <div key={field.id} className="grid grid-cols-12 gap-3 items-start border border-gray-200 rounded-md p-3 bg-gray-50">
          <div className="col-span-2">
            <Label>Step</Label>
            <Input type="number" {...register(`processSteps.${i}.number`)} className="text-center" min={1} max={4} />
            {errors?.processSteps?.[i]?.number && <p className="text-xs text-red-600 mt-1">{errors.processSteps[i].number.message}</p>}
          </div>
          <div className="col-span-4">
            <Label>Heading</Label>
            <Input {...register(`processSteps.${i}.heading`)} placeholder="Discovery" />
            {errors?.processSteps?.[i]?.heading && <p className="text-xs text-red-600 mt-1">{errors.processSteps[i].heading.message}</p>}
          </div>
          <div className="col-span-5">
            <Label>Description</Label>
            <Textarea {...register(`processSteps.${i}.description`)} rows={2} placeholder="What happens in this step" />
            {errors?.processSteps?.[i]?.description && <p className="text-xs text-red-600 mt-1">{errors.processSteps[i].description.message}</p>}
          </div>
          <div className="col-span-1 flex justify-end pt-6">
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      {fields.length < 4 && (
        <button type="button" onClick={() => append({ number: fields.length + 1, heading: '', description: '' })}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
          <Plus size={16} /> Add Step
        </button>
      )}
      {errors?.processSteps?.root && <p className="text-xs text-red-600">{errors.processSteps.root.message}</p>}
      </div>
    </div>
  );
}

function SectionTypeToggle({ register, watch }: any) {
  const sectionType = watch('sectionType');

  return (
    <div className="space-y-2">
      <Label>Conditional Section Type</Label>
      <p className="text-xs text-gray-500 mb-3">Choose which section to display on the service page</p>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" {...register('sectionType')} value="technologies"
            className="h-4 w-4 text-blue-600 border-gray-300" />
          <span className="text-sm text-gray-700">Technologies We Master</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" {...register('sectionType')} value="tools"
            className="h-4 w-4 text-blue-600 border-gray-300" />
          <span className="text-sm text-gray-700">Tools We Use</span>
        </label>
      </div>
      <p className="text-xs text-blue-600 mt-2">
        Currently selected: <strong>{sectionType === 'technologies' ? 'Technologies' : 'Tools'}</strong>
      </p>
    </div>
  );
}

function TechSectionEditor({ control, register, errors }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: 'techSection.categories' });

  return (
    <div className="space-y-4">
      <div>
        <Label>Section Heading</Label>
        <Input {...register('techSection.heading')} placeholder="Technology We Master" />
        {errors?.techSection?.heading && <p className="text-xs text-red-600 mt-1">{errors.techSection.heading.message}</p>}
      </div>
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Categories</Label>
        {fields.map((field, i) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
            <button type="button" onClick={() => remove(i)} title="Remove Category"
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors bg-white p-1.5 rounded-full shadow-sm">
              <Trash2 size={16} />
            </button>
            <div className="space-y-3 pr-10">
              <div>
                <Label>Category Name</Label>
                <Input {...register(`techSection.categories.${i}.name`)} placeholder="Frontend Development" />
                {errors?.techSection?.categories?.[i]?.name && <p className="text-xs text-red-600 mt-1">{errors.techSection.categories[i].name.message}</p>}
              </div>
              <TechItemsField control={control} register={register} categoryIndex={i} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: '', items: [''] })}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
          <Plus size={16} /> Add Category
        </button>
      </div>
    </div>
  );
}

function TechItemsField({ control, register, categoryIndex }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: `techSection.categories.${categoryIndex}.items` });

  return (
    <div>
      <Label className="text-xs text-gray-600 uppercase tracking-wider">Technologies</Label>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <Input {...register(`techSection.categories.${categoryIndex}.items.${i}`)} placeholder="React" className="bg-white" />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append('')}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
          <Plus size={14} /> Add Technology
        </button>
      </div>
    </div>
  );
}


function ToolsSectionEditor({ control, register, errors }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: 'toolsSection.categories' });

  return (
    <div className="space-y-4">
      <div>
        <Label>Section Heading</Label>
        <Input {...register('toolsSection.heading')} placeholder="Tools We Use" />
        {errors?.toolsSection?.heading && <p className="text-xs text-red-600 mt-1">{errors.toolsSection.heading.message}</p>}
      </div>
      <div>
        <Label>Section Description</Label>
        <Textarea {...register('toolsSection.description')} rows={2} placeholder="Tools and platforms we use..." />
        {errors?.toolsSection?.description && <p className="text-xs text-red-600 mt-1">{errors.toolsSection.description.message}</p>}
      </div>
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Tool Categories</Label>
        {fields.map((field, i) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
            <button type="button" onClick={() => remove(i)} title="Remove Category"
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors bg-white p-1.5 rounded-full shadow-sm">
              <Trash2 size={16} />
            </button>
            <div className="space-y-3 pr-10">
              <div>
                <Label>Category Name</Label>
                <Input {...register(`toolsSection.categories.${i}.name`)} placeholder="Design" />
                {errors?.toolsSection?.categories?.[i]?.name && <p className="text-xs text-red-600 mt-1">{errors.toolsSection.categories[i].name.message}</p>}
              </div>
              <ToolItemsField control={control} register={register} errors={errors} categoryIndex={i} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: '', tools: [{ name: '', icon: '' }] })}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
          <Plus size={16} /> Add Category
        </button>
      </div>
    </div>
  );
}

function ToolItemsField({ control, register, errors, categoryIndex }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: `toolsSection.categories.${categoryIndex}.tools` });

  return (
    <div>
      <Label className="text-xs text-gray-600 uppercase tracking-wider">Tools</Label>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-12 gap-2">
            <div className="col-span-5">
              <Input {...register(`toolsSection.categories.${categoryIndex}.tools.${i}.name`)} placeholder="Figma" className="bg-white" />
              {errors?.toolsSection?.categories?.[categoryIndex]?.tools?.[i]?.name && 
                <p className="text-xs text-red-600 mt-1">{errors.toolsSection.categories[categoryIndex].tools[i].name.message}</p>}
            </div>
            <div className="col-span-6">
              <Input {...register(`toolsSection.categories.${categoryIndex}.tools.${i}.icon`)} placeholder="icon name or URL" className="bg-white" />
              {errors?.toolsSection?.categories?.[categoryIndex]?.tools?.[i]?.icon && 
                <p className="text-xs text-red-600 mt-1">{errors.toolsSection.categories[categoryIndex].tools[i].icon.message}</p>}
            </div>
            <div className="col-span-1 flex justify-end">
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: '', icon: '' })}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
          <Plus size={14} /> Add Tool
        </button>
      </div>
    </div>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServiceForm({ initialData, mode }: { initialData?: any; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema) as any,
      defaultValues: {
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        blackHeading: initialData?.blackHeading || '',
        blueHeading: initialData?.blueHeading || '',
        icon: initialData?.icon || '',
        pillText: initialData?.pillText || '',
        stats: safeParseJson<FormValues['stats']>(initialData?.stats, []),
        subServicesHeading: initialData?.subServicesHeading || '',
        subServicesDescription: initialData?.subServicesDescription || '',
        subServices: safeParseJson<FormValues['subServices']>(initialData?.subServices, []),
        processStepsHeading: initialData?.processStepsHeading || '',
        processStepsDescription: initialData?.processStepsDescription || '',
        processSteps: safeParseJson<FormValues['processSteps']>(initialData?.processSteps, []),
        sectionType: initialData?.sectionType || 'technologies',
        techSection: safeParseJson<FormValues['techSection']>(initialData?.techSection, { heading: '', categories: [] }),
        toolsSection: safeParseJson<FormValues['toolsSection']>(initialData?.toolsSection, { heading: '', description: '', categories: [] }),
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

  // Auto-slug on create
  const watchTitle = watch('title');
  useEffect(() => {
    if (mode === 'create' && watchTitle) {
      setValue('slug', slugify(watchTitle, { lower: true, strict: true }));
    }
  }, [watchTitle, mode, setValue]);

  const onSubmit = async (data: FormValues, status: 'draft' | 'published') => {
    setIsSubmitting(true);
    setServerError(null);
    
    // Show loading toast
    const loadingToast = toast.loading(`${status === 'published' ? 'Publishing' : 'Saving'} service...`);
    
    try {
      console.log('Submitting service data:', { title: data.title, slug: data.slug, status });
      
      const payload = {
        ...data,
        stats: JSON.stringify(data.stats || []),
        subServices: JSON.stringify(data.subServices || []),
        processSteps: JSON.stringify(data.processSteps || []),
        techSection: JSON.stringify(data.techSection || null),
        toolsSection: JSON.stringify(data.toolsSection || null),
        status,
      };
      
      console.log('Payload prepared, calling server action...');
      
      const result = mode === 'create'
        ? await createService(payload as any)
        : await updateService(initialData.id, payload as any);

      console.log('Server response:', result);
      
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(`Service ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
        setTimeout(() => { router.push('/admin/services'); router.refresh(); }, 1500);
      } else {
        const errorMsg = (result as any).error || 'Error saving service';
        console.error('Server returned error:', errorMsg);
        setServerError(errorMsg);
        toast.error(`Failed to save: ${errorMsg}`);
      }
    } catch (e: any) {
      console.error('Exception during save:', e);
      toast.dismiss(loadingToast);
      const errorMsg = e.message || 'Error saving service';
      setServerError(errorMsg);
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
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

        {/* Server Error Display */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-1">Validation Error</h4>
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div>
        )}

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
                  {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea {...register('description')} rows={3} placeholder="Service description..." />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 text-sm">Service Page Headings</h4>
                  <div>
                    <Label>Black Heading <span className="text-gray-400 font-normal">(main heading on service page)</span></Label>
                    <Input {...register('blackHeading')} placeholder="Transform Your Digital Presence" />
                    {errors.blackHeading && <p className="mt-1 text-xs text-red-600">{errors.blackHeading.message}</p>}
                  </div>
                  <div>
                    <Label>Blue Heading <span className="text-gray-400 font-normal">(subheading on service page)</span></Label>
                    <Input {...register('blueHeading')} placeholder="with Expert Development Services" />
                    {errors.blueHeading && <p className="mt-1 text-xs text-red-600">{errors.blueHeading.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Icon <span className="text-gray-400 font-normal">(emoji / Lucide name)</span></Label>
                    <Input {...register('icon')} placeholder="Code2" />
                  </div>
                  <div>
                    <Label>Pill Text <span className="text-gray-400 font-normal">(text shown in pill badge)</span></Label>
                    <Input {...register('pillText')} placeholder="Development" />
                  </div>
                </div>
              </div>
            </Card>


            {/* Stats Bar */}
            <Card title="Stats Bar">
              <StatsEditor control={control} register={register} errors={errors} />
            </Card>

            {/* Sub-Services */}
            <Card title="Sub-Services">
              <div className="space-y-4">
                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-lg space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm">Section Header</h4>
                  <div>
                    <Label>Heading <span className="text-gray-400 font-normal">(for sub-services section)</span></Label>
                    <Input {...register('subServicesHeading')} placeholder="Our Development Services" />
                  </div>
                  <div>
                    <Label>Description <span className="text-gray-400 font-normal">(brief intro text)</span></Label>
                    <Textarea {...register('subServicesDescription')} rows={2} placeholder="Explore our comprehensive range of development services..." />
                  </div>
                </div>
                <SubServicesEditor control={control} register={register} errors={errors} />
              </div>
            </Card>

            {/* Process Steps */}
            <Card title="Process Steps (Exactly 4)">
              <ProcessStepsEditor control={control} register={register} errors={errors} />
            </Card>

            {/* Section Type Toggle */}
            <Card title="Conditional Section">
              <SectionTypeToggle register={register} watch={watch} />
            </Card>

            {/* Tech Section */}
            {watch('sectionType') === 'technologies' && (
              <Card title="Technology We Master Section">
                <TechSectionEditor control={control} register={register} errors={errors} />
              </Card>
            )}

            {/* Tools Section */}
            {watch('sectionType') === 'tools' && (
              <Card title="Tools We Use Section">
                <ToolsSectionEditor control={control} register={register} errors={errors} />
              </Card>
            )}

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
    </div>
  );
}
