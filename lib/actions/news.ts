'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { triggerRevalidation } from '@/lib/actions/revalidate';
import { FULL_PUBLIC_REVALIDATION_PATHS } from '@/lib/revalidationPaths';

export interface NewsFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  source_url?: string;
  category?: string;
  tags?: string;
  author_name?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  keywords?: string;
  no_index?: boolean;
}

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

export async function getNews(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    const data = await prisma.article.findMany({
      where: {
        type: 'news',
        ...(options?.status ? { status: options.status } : {})
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: 'desc' },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getNewsById(id: string) {
  try {
    const data = await prisma.article.findUnique({
      where: { id },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching news by id:', error);
    return null;
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const data = await prisma.article.findFirst({
      where: { type: 'news', slug, status: 'published' },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return null;
  }
}

export async function createNews(formData: NewsFormData) {
  try {
    let seoId = null;
    const hasSeoData = formData.meta_title || formData.meta_description || formData.og_image || formData.keywords || formData.no_index;
    if (hasSeoData) {
      const seoData = await prisma.seoMetadata.create({
        data: {
          meta_title: formData.meta_title || null,
          meta_description: formData.meta_description || null,
          og_image: formData.og_image || null,
          keywords: formData.keywords || null,
          no_index: formData.no_index || false,
        }
      });
      seoId = seoData.id;
    }

    const newsData = await prisma.article.create({
      data: {
        type: 'news',
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content || null,
        coverImage: formData.cover_image || null,
        category: formData.category || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        authorName: formData.author_name || null,
        status: formData.status,
        featured: formData.featured,
        seoId: seoId,
        publishedAt: formData.status === 'published' ? new Date() : null,
      }
    });

    revalidatePath('/news');
    revalidatePath('/admin/news');
    revalidatePath(`/news/${formData.slug}`);
    
    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/news', `/news/${formData.slug}`]);
    }
    return { success: true, id: newsData.id };
  } catch (e: unknown) {
    console.error('createNews failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create news' };
  }
}

export async function updateNews(id: string, formData: NewsFormData) {
  try {
    const existing = await prisma.article.findUnique({
      where: { id },
      select: { seoId: true }
    });

    if (!existing) return { success: false, error: 'News not found' };

    let seoId = existing.seoId;
    const hasSeo = formData.meta_title || formData.meta_description || formData.og_image || formData.keywords || formData.no_index;
    
    if (hasSeo) {
      if (seoId) {
        await prisma.seoMetadata.update({
          where: { id: seoId },
          data: {
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            og_image: formData.og_image || null,
            keywords: formData.keywords || null,
            no_index: formData.no_index || false,
          }
        });
      } else {
        const newSeo = await prisma.seoMetadata.create({
          data: {
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            og_image: formData.og_image || null,
            keywords: formData.keywords || null,
            no_index: formData.no_index || false,
          }
        });
        seoId = newSeo.id;
      }
    }

    await prisma.article.update({
      where: { id },
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content || null,
        coverImage: formData.cover_image || null,
        category: formData.category || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        authorName: formData.author_name || null,
        status: formData.status,
        featured: formData.featured,
        seoId: seoId,
        publishedAt: formData.status === 'published' ? new Date() : (formData.status === 'draft' ? null : undefined),
      }
    });

    revalidatePath('/news');
    revalidatePath(`/news/${formData.slug}`);
    revalidatePath('/admin/news');
    
    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/news', `/news/${formData.slug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('updateNews failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update news' };
  }
}

export async function deleteNews(id: string) {
  try {
    const data = await prisma.article.findUnique({
      where: { id },
      select: { seoId: true }
    });

    await prisma.article.delete({
      where: { id }
    });

    if (data?.seoId) {
      await prisma.seoMetadata.delete({
        where: { id: data.seoId }
      });
    }

    revalidatePath('/news');
    revalidatePath('/admin/news');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteNews failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete news' };
  }
}

export async function toggleNewsStatus(
  id: string,
  status: 'published' | 'draft' | 'archived',
  slug?: string
) {
  try {
    let resolvedSlug = slug;
    if (!resolvedSlug) {
      const data = await prisma.article.findUnique({ where: { id }, select: { slug: true } });
      resolvedSlug = data?.slug || undefined;
    }
    
    await prisma.article.update({
      where: { id },
      data: {
        status,
        publishedAt: status === 'published' ? new Date() : null
      }
    });

    revalidatePath('/news');
    revalidatePath('/admin/news');
    if (resolvedSlug) revalidatePath(`/news/${resolvedSlug}`);
    
    if (status === 'published' && resolvedSlug) {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/news', `/news/${resolvedSlug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('toggleNewsStatus failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update news status' };
  }
}
