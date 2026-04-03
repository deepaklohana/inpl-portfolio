'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import {
  ChevronDown, ChevronUp, Loader2, Clock, Calculator,
  Newspaper, FileText, Calendar, Globe, MapPin, Plus, Trash2,
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import SeoPanel from './SeoPanel';
import { createArticle, updateArticle } from '@/lib/actions/articles';
import type { ArticleType, ArticleFormData } from '@/lib/actions/articles';
import { toast } from 'sonner';
import ScrollReveal from '@/components/animations/ScrollReveal';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().max(300, 'Max 300 characters').optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  coverImage: z.string().optional().or(z.literal('')),

  // Author
  authorName: z.string().optional().or(z.literal('')),
  authorTitle: z.string().optional().or(z.literal('')),
  authorImage: z.string().optional().or(z.literal('')),
  authorBio: z.string().optional().or(z.literal('')),
  authorSocials: z.array(z.object({
    platform: z.string().min(1, 'Platform is required'),
    url: z.string().min(1, 'URL is required'),
  })).optional(),

  // Meta
  readTime: z.string().optional().or(z.literal('')),

  // Organisation
  category: z.string().optional().or(z.literal('')),
  tagsRaw: z.string().optional().or(z.literal('')), // comma-separated input

  // Publishing
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),

  // Event-specific
  eventDate: z.string().optional().or(z.literal('')),
  eventEndDate: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  locationUrl: z.string().optional().or(z.literal('')),
  isOnline: z.boolean().default(false),
  eventUrl: z.string().optional().or(z.literal('')),
  registrationUrl: z.string().optional().or(z.literal('')),

  // SEO
  meta_title: z.string().optional().or(z.literal('')),
  meta_description: z.string().optional().or(z.literal('')),
  og_image: z.string().optional().or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
  no_index: z.boolean().default(false),
});

type FormValues = z.infer<typeof articleSchema>;

// ---------------------------------------------------------------------------
// Type UI config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<ArticleType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  news: { label: 'News', icon: <Newspaper size={14} />, color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200' },
  blog: { label: 'Blog', icon: <FileText size={14} />, color: 'text-purple-700', bg: 'bg-purple-100 border-purple-200' },
  event: { label: 'Event', icon: <Calendar size={14} />, color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200' },
};

// ---------------------------------------------------------------------------
// Suggested categories per type
// ---------------------------------------------------------------------------
const CATEGORY_SUGGESTIONS: Record<ArticleType, string[]> = {
  news: ['Press Release', 'Product Update', 'Company News', 'Industry Insights', 'Partnerships'],
  blog: ['Technology', 'Design', 'Engineering', 'Case Study', 'Opinion', 'Tutorial'],
  event: ['Webinar', 'Conference', 'Workshop', 'Meetup', 'Product Launch'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toDatetimeLocal(val?: Date | string | null): string {
  if (!val) return '';
  try { return new Date(val).toISOString().slice(0, 16); }
  catch { return ''; }
}

function calcReadTime(content: string): string {
  const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  type: ArticleType;
  mode: 'create' | 'edit';
  initialData?: any;
}

export default function ArticleForm({ type, mode, initialData }: Props) {
  const router = useRouter();
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const typeConfig = TYPE_CONFIG[type];

  const defaultValues: FormValues = {
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    excerpt: initialData?.excerpt ?? '',
    content: initialData?.content ?? '',
    coverImage: initialData?.coverImage ?? '',

    authorName: initialData?.authorName ?? '',
    authorTitle: initialData?.authorTitle ?? '',
    authorImage: initialData?.authorImage ?? '',
    authorBio: initialData?.authorBio ?? '',
    authorSocials: (initialData?.authorSocials as { platform: string; url: string }[]) ?? [],

    readTime: initialData?.readTime ?? '',

    category: initialData?.category ?? '',
    tagsRaw: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : '',

    status: initialData?.status ?? 'draft',
    featured: initialData?.featured ?? false,

    // Event-specific
    eventDate: toDatetimeLocal(initialData?.eventDate),
    eventEndDate: toDatetimeLocal(initialData?.eventEndDate),
    location: initialData?.location ?? '',
    locationUrl: initialData?.locationUrl ?? '',
    isOnline: initialData?.isOnline ?? false,
    eventUrl: initialData?.eventUrl ?? '',
    registrationUrl: initialData?.registrationUrl ?? '',

    // SEO
    meta_title: initialData?.seo?.meta_title ?? '',
    meta_description: initialData?.seo?.meta_description ?? '',
    og_image: initialData?.seo?.og_image ?? '',
    keywords: initialData?.seo?.keywords ?? '',
    no_index: initialData?.seo?.no_index ?? false,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(articleSchema) as any,
    defaultValues,
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: 'authorSocials',
  });

  const watchTitle = watch('title');
  const watchContent = watch('content');
  const watchExcerpt = watch('excerpt');
  const watchMetaTitle = watch('meta_title');
  const watchMetaDescription = watch('meta_description');
  const watchSlug = watch('slug');
  const watchTags = watch('tagsRaw');
  const watchIsOnline = watch('isOnline');

  // Auto-generate slug in create mode
  useEffect(() => {
    if (mode === 'create' && watchTitle) {
      setValue('slug', slugify(watchTitle, { lower: true, strict: true }), { shouldValidate: true });
    }
  }, [watchTitle, mode, setValue]);

  const handleAutoReadTime = useCallback(() => {
    const rt = calcReadTime(watchContent || '');
    setValue('readTime', rt);
    toast.success(`Read time set to "${rt}"`);
  }, [watchContent, setValue]);

  const onSubmit = async (data: FormValues, actionStatus: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      const tags = data.tagsRaw
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean) ?? [];

      const payload: ArticleFormData = {
        type,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || undefined,
        content: data.content || undefined,
        coverImage: data.coverImage || undefined,
        authorName: data.authorName || undefined,
        authorTitle: data.authorTitle || undefined,
        authorImage: data.authorImage || undefined,
        authorBio: data.authorBio || undefined,
        authorSocials: data.authorSocials && data.authorSocials.length > 0
          ? data.authorSocials.filter(s => s.platform && s.url)
          : null,
        readTime: data.readTime || undefined,
        category: data.category || undefined,
        tags,
        status: actionStatus,
        featured: data.featured,
        // Event-specific
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        eventEndDate: data.eventEndDate ? new Date(data.eventEndDate) : null,
        location: data.location || undefined,
        locationUrl: data.locationUrl || undefined,
        isOnline: data.isOnline,
        eventUrl: data.eventUrl || undefined,
        registrationUrl: data.registrationUrl || undefined,
        // SEO
        meta_title: data.meta_title || undefined,
        meta_description: data.meta_description || undefined,
        og_image: data.og_image || undefined,
        keywords: data.keywords || undefined,
        no_index: data.no_index,
      };

      const result = mode === 'create'
        ? await createArticle(payload)
        : await updateArticle(initialData.id, payload);

      if (result.success) {
        toast.success(`Article ${actionStatus === 'published' ? 'published' : 'saved as draft'}!`);
        setTimeout(() => {
          router.push('/admin/articles');
          router.refresh();
        }, 1200);
      } else {
        throw new Error((result as any).error || 'Failed to save article');
      }
    } catch (e: any) {
      toast.error(e.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldCls = 'w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2251B5]/20 focus:border-[#2251B5] transition-colors outline-none';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const cardCls = 'bg-white p-6 rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] space-y-4';
  const cardHeadCls = 'text-base font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-1';
  const errorCls = 'mt-1 text-xs text-red-600';

  return (
    <ScrollReveal variant="fadeUp" className="max-w-5xl mx-auto pb-24">
      <form className="space-y-6">
        {/* Sticky action bar */}
        <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.04)] border border-[#F3F4F6] mb-2 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeConfig.bg} ${typeConfig.color}`}>
              {typeConfig.icon}
              {typeConfig.label}
            </span>
            <h1 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? `New ${typeConfig.label}` : `Edit ${typeConfig.label}`}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push('/admin/articles')}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit((d) => onSubmit(d, 'draft'))}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit((d) => onSubmit(d, 'published'))}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-[#2251B5] text-white rounded-lg hover:bg-[#1a3f99] disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
              Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1 — Basic Info */}
            <div className={cardCls}>
              <h2 className={cardHeadCls}>Basic Info</h2>

              {/* Title */}
              <div>
                <label className={labelCls}>Title <span className="text-red-500">*</span></label>
                <input type="text" {...register('title')} className={fieldCls} placeholder={`Enter ${typeConfig.label.toLowerCase()} title`} />
                <p className="mt-1.5 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-700">Tip:</span> Wrap text in <code className="bg-gray-100 px-1 py-0.5 rounded text-[#2251B5]">*asterisks*</code> to make it blue. Example: <code>*New Tech* Released Today</code>
                </p>
                {errors.title && <p className={errorCls}>{errors.title.message}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className={labelCls}>Slug <span className="text-red-500">*</span></label>
                <input type="text" {...register('slug')} className={`${fieldCls} font-mono text-xs`} placeholder="auto-generated-slug" />
                {errors.slug && <p className={errorCls}>{errors.slug.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category</label>
                <input
                  type="text"
                  {...register('category')}
                  list="category-suggestions"
                  className={fieldCls}
                  placeholder="e.g. Product Update"
                />
                <datalist id="category-suggestions">
                  {CATEGORY_SUGGESTIONS[type].map((s) => <option key={s} value={s} />)}
                </datalist>
              </div>

              {/* Tags */}
              <div>
                <label className={labelCls}>Tags <span className="text-xs text-gray-400">(comma-separated)</span></label>
                <input type="text" {...register('tagsRaw')} className={fieldCls} placeholder="react, nextjs, product" />
                {watchTags && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {watchTags.split(',').map((t, i) => t.trim() && (
                      <span key={i} className="bg-[#2251B5]/10 text-[#2251B5] text-xs px-2 py-0.5 rounded-full border border-[#2251B5]/20">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className={labelCls}>Excerpt <span className="text-xs text-gray-400">(max 300 chars)</span></label>
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  className={fieldCls}
                  placeholder="Brief summary shown in listings"
                />
                <div className="flex justify-between mt-1">
                  {errors.excerpt ? <p className={errorCls}>{errors.excerpt.message}</p> : <span />}
                  <p className={`text-xs ${(watchExcerpt?.length ?? 0) > 300 ? 'text-red-600' : 'text-gray-400'}`}>
                    {watchExcerpt?.length ?? 0} / 300
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 — Content */}
            <div className={`${cardCls} space-y-3!`}>
              <h2 className={cardHeadCls}>Content</h2>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value || ''} onChange={field.onChange} />
                )}
              />
            </div>

            {/* Section 3 — Author */}
            <div className={cardCls}>
              <h2 className={cardHeadCls}>Author</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name</label>
                  <input type="text" {...register('authorName')} className={fieldCls} placeholder="Jane Doe" />
                </div>
                <div>
                  <label className={labelCls}>Title <span className="text-xs text-gray-400">(role)</span></label>
                  <input type="text" {...register('authorTitle')} className={fieldCls} placeholder="Chief Product Officer" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Author Image</label>
                <Controller
                  name="authorImage"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-4">
                      {field.value && (
                        <img src={field.value} alt="Author" className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0" />
                      )}
                      <div className="flex-1">
                        <ImageUploader value={field.value} onUpload={field.onChange} folder="authors" />
                      </div>
                    </div>
                  )}
                />
              </div>
              <div>
                <label className={labelCls}>Author Bio <span className="text-xs text-gray-400">(shown at bottom of article)</span></label>
                <textarea {...register('authorBio')} rows={3} className={fieldCls} placeholder="Short bio about the author…" />
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <label className={labelCls}>Social Media Links</label>
                  <button
                    type="button"
                    onClick={() => appendSocial({ platform: '', url: '' })}
                    className="text-[#2251B5] flex items-center gap-1 text-xs font-semibold hover:bg-[#2251B5]/10 px-2 py-1 rounded transition-colors"
                  >
                    <Plus size={14} /> Add Link
                  </button>
                </div>
                {socialFields.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No social links added.</p>
                )}
                <div className="space-y-3">
                  {socialFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          {...register(`authorSocials.${index}.platform` as const)}
                          placeholder="Ex: Twitter, LinkedIn, Website..."
                          className={`${fieldCls} py-1.5 text-xs col-span-1`}
                        />
                        <input
                          type="text"
                          {...register(`authorSocials.${index}.url` as const)}
                          placeholder="https://..."
                          className={`${fieldCls} py-1.5 text-xs col-span-2`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSocial(index)}
                        className="p-1.5 mt-0.5 text-gray-400 hover:text-red-500 rounded bg-gray-50 hover:bg-red-50 transition-colors"
                        title="Remove link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4 — Meta */}
            <div className={cardCls}>
              <h2 className={cardHeadCls}>Meta</h2>
              <div>
                <label className={labelCls}>Read Time</label>
                <div className="flex gap-2">
                  <input type="text" {...register('readTime')} className={`${fieldCls} flex-1`} placeholder="5 min read" />
                  <button
                    type="button"
                    onClick={handleAutoReadTime}
                    title="Auto-calculate from content"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <Calculator size={13} />
                    Auto
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Auto-calculates word count ÷ 200 WPM from content</p>
              </div>
            </div>

            {/* Section 5 — Event Details (conditional) */}
            {type === 'event' && (
              <div className={cardCls}>
                <h2 className={`${cardHeadCls} flex items-center gap-2`}>
                  <Calendar size={15} className="text-emerald-600" />
                  Event Details
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Start Date & Time</label>
                    <input type="datetime-local" {...register('eventDate')} className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls}>End Date & Time</label>
                    <input type="datetime-local" {...register('eventEndDate')} className={fieldCls} />
                  </div>
                </div>

                {/* Online toggle */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Controller
                    name="isOnline"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${field.value ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${field.value ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
                      </button>
                    )}
                  />
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Globe size={14} className="text-emerald-600" />
                    Online Event
                  </div>
                </div>

                {!watchIsOnline && (
                  <>
                    <div>
                      <label className={labelCls}>
                        <MapPin size={13} className="inline mr-1 text-gray-400" />
                        Location / Venue
                      </label>
                      <input type="text" {...register('location')} className={fieldCls} placeholder="Conference Hall, New Delhi" />
                    </div>
                    <div>
                      <label className={labelCls}>Google Maps URL</label>
                      <input type="url" {...register('locationUrl')} className={fieldCls} placeholder="https://maps.google.com/…" />
                    </div>
                  </>
                )}

                <div>
                  <label className={labelCls}>Event URL</label>
                  <input type="url" {...register('eventUrl')} className={fieldCls} placeholder="https://event-page.com" />
                </div>
                <div>
                  <label className={labelCls}>Registration URL</label>
                  <input type="url" {...register('registrationUrl')} className={fieldCls} placeholder="https://register-here.com" />
                </div>
              </div>
            )}

            {/* Section 6 — SEO (collapsible) */}
            <div className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsSeoOpen((v) => !v)}
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <h2 className="text-base font-semibold text-gray-800">SEO Settings</h2>
                {isSeoOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {isSeoOpen && (
                <div className="p-6">
                  <SeoPanel
                    register={register}
                    watch={watch}
                    slug={`news-events/${watchSlug}`}
                    title={watchTitle}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar column ── */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className={cardCls}>
              <h2 className={cardHeadCls}>Cover Image</h2>
              <Controller
                name="coverImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader value={field.value} onUpload={field.onChange} folder="article_covers" />
                )}
              />
            </div>

            {/* Publishing */}
            <div className={cardCls}>
              <h2 className={cardHeadCls}>Publishing</h2>

              {/* Status select */}
              <div>
                <label className={labelCls}>Status</label>
                <select {...register('status')} className={fieldCls}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Featured toggle */}
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${field.value ? 'bg-[#2251B5]' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${field.value ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </ScrollReveal>
  );
}
