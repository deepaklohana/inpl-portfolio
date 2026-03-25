'use client';

import { UseFormRegister, UseFormWatch } from 'react-hook-form';

interface SeoPanelProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  slug?: string;
  title?: string;
}

export default function SeoPanel({ register, watch, slug, title }: SeoPanelProps) {
  const metaTitle = watch('meta_title') as string | undefined;
  const metaDescription = watch('meta_description') as string | undefined;
  const excerpt = watch('excerpt') as string | undefined;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
        <input type="text" {...register('meta_title')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="SEO optimized title" />
        <p className={`text-xs mt-1 ${(metaTitle?.length || 0) > 60 ? 'text-red-600' : 'text-gray-500'}`}>{(metaTitle?.length || 0)} / 60 characters</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
        <textarea {...register('meta_description')} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="SEO optimized description" />
        <p className={`text-xs mt-1 ${(metaDescription?.length || 0) > 160 ? 'text-red-600' : 'text-gray-500'}`}>{(metaDescription?.length || 0)} / 160 characters</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
        <input type="text" {...register('keywords')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="keyword1, keyword2 (comma separated)" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
        <input type="text" {...register('og_image')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="https://example.com/image.jpg" />
      </div>
      <div className="flex items-center">
        <input type="checkbox" id="no_index" {...register('no_index')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="no_index" className="ml-2 block text-sm text-gray-700">Prevent search engines from indexing this page</label>
      </div>
      {/* Google Preview */}
      <div className="border text-sm p-4 rounded-md bg-white shadow-sm">
        <p className="font-semibold text-gray-700 mb-2">Search Engine Preview</p>
        <div className="max-w-[600px]">
          <span className="text-gray-600 text-[13px] block">https://yoursite.com/{slug || 'your-slug-here'}</span>
          <h3 className="text-[#1a0dab] text-xl truncate mb-1 hover:underline">{metaTitle || title || 'Your Page Title Here'}</h3>
          <p className="text-[#4d5156] line-clamp-2 text-[14px] leading-snug">{metaDescription || excerpt || 'Provide a meta description to see how it appears in search results.'}</p>
        </div>
      </div>
    </div>
  );
}
