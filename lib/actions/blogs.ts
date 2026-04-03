'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { triggerRevalidation } from '@/lib/actions/revalidate';
import { FULL_PUBLIC_REVALIDATION_PATHS } from '@/lib/revalidationPaths';

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  author_name?: string;
  author_image?: string;
  category?: string;
  tags?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  
  // SEO
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

export async function getBlogs(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    const data = await prisma.article.findMany({
      where: {
        type: 'blog',
        ...(options?.status ? { status: options.status } : {})
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: 'desc' },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getBlogById(id: string) {
  try {
    const data = await prisma.article.findUnique({
      where: { id },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching blog by id:', error);
    return null;
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const data = await prisma.article.findFirst({
      where: { type: 'blog', slug, status: 'published' },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

export async function createBlog(formData: BlogFormData) {
  try {
    let seoId = null;

    // Check if SEO fields present
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

    const blogData = await prisma.article.create({
      data: {
        type: 'blog',
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content || null,
        coverImage: formData.cover_image || null,
        authorName: formData.author_name || null,
        authorImage: formData.author_image || null,
        category: formData.category || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        status: formData.status,
        featured: formData.featured,
        seoId: seoId,
        publishedAt: formData.status === 'published' ? new Date() : null,
      }
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${formData.slug}`);
    revalidatePath('/admin/blogs');

    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/blog', `/blog/${formData.slug}`]);
    }
    return { success: true, id: blogData.id };
  } catch (e: unknown) {
    console.error('createBlog failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create blog' };
  }
}

export async function updateBlog(id: string, formData: BlogFormData) {
  try {
    const existingBlog = await prisma.article.findUnique({
      where: { id },
      select: { seoId: true }
    });

    if (!existingBlog) {
      return { success: false, error: 'Blog not found' };
    }

    let seoId = existingBlog.seoId;
    const hasSeoData = formData.meta_title || formData.meta_description || formData.og_image || formData.keywords || formData.no_index;

    if (hasSeoData) {
      if (seoId) {
        // Update existing SEO metadata
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
        // Create new SEO metadata
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
        authorName: formData.author_name || null,
        authorImage: formData.author_image || null,
        category: formData.category || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        status: formData.status,
        featured: formData.featured,
        seoId: seoId,
        publishedAt: formData.status === 'published' ? new Date() : (formData.status === 'draft' ? null : undefined),
      }
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${formData.slug}`);
    revalidatePath('/admin/blogs');

    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/blog', `/blog/${formData.slug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('updateBlog failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update blog' };
  }
}

export async function deleteBlog(id: string) {
  try {
    const blog = await prisma.article.findUnique({
      where: { id },
      select: { seoId: true }
    });

    await prisma.article.delete({
      where: { id }
    });

    if (blog?.seoId) {
      await prisma.seoMetadata.delete({
        where: { id: blog.seoId }
      });
    }

    revalidatePath('/blog');
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteBlog failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete blog' };
  }
}

export async function toggleBlogStatus(
  id: string,
  status: 'published' | 'draft' | 'archived',
  slug?: string
) {
  try {
    let resolvedSlug = slug;
    if (!resolvedSlug) {
      const blog = await prisma.article.findUnique({ where: { id }, select: { slug: true } });
      resolvedSlug = blog?.slug || undefined;
    }

    await prisma.article.update({
      where: { id },
      data: {
        status,
        publishedAt: status === 'published' ? new Date() : null
      }
    });

    revalidatePath('/blog');
    if (resolvedSlug) revalidatePath(`/blog/${resolvedSlug}`);
    revalidatePath('/admin/blogs');

    if (status === 'published' && resolvedSlug) {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/blog', `/blog/${resolvedSlug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('toggleBlogStatus failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update blog status' };
  }
}
