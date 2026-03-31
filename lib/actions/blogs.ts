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
    const data = await prisma.blog.findMany({
      where: options?.status ? { status: options.status } : undefined,
      take: options?.limit,
      skip: options?.offset,
      orderBy: { created_at: 'desc' },
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getBlogById(id: string) {
  try {
    const data = await prisma.blog.findUnique({
      where: { id: parseInt(id, 10) },
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching blog by id:', error);
    return null;
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const data = await prisma.blog.findFirst({
      where: { slug, status: 'published' },
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

export async function createBlog(formData: BlogFormData) {
  try {
    let seo_id = null;

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
      seo_id = seoData.id;
    }

    const blogData = await prisma.blog.create({
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content || null,
        cover_image: formData.cover_image || null,
        author_name: formData.author_name || null,
        author_image: formData.author_image || null,
        category: formData.category || null,
        tags: formData.tags || null,
        status: formData.status,
        featured: formData.featured,
        seo_id: seo_id,
        published_at: formData.status === 'published' ? new Date() : null,
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
    const existingBlog = await prisma.blog.findUnique({
      where: { id: parseInt(id, 10) },
      select: { seo_id: true }
    });

    if (!existingBlog) {
      return { success: false, error: 'Blog not found' };
    }

    let seo_id = existingBlog.seo_id;
    const hasSeoData = formData.meta_title || formData.meta_description || formData.og_image || formData.keywords || formData.no_index;

    if (hasSeoData) {
      if (seo_id) {
        // Update existing SEO metadata
        await prisma.seoMetadata.update({
          where: { id: seo_id },
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
        seo_id = newSeo.id;
      }
    }

    await prisma.blog.update({
      where: { id: parseInt(id, 10) },
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content || null,
        cover_image: formData.cover_image || null,
        author_name: formData.author_name || null,
        author_image: formData.author_image || null,
        category: formData.category || null,
        tags: formData.tags || null,
        status: formData.status,
        featured: formData.featured,
        seo_id: seo_id,
        published_at: formData.status === 'published' ? new Date() : (formData.status === 'draft' ? null : undefined),
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
    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id, 10) },
      select: { seo_id: true }
    });

    await prisma.blog.delete({
      where: { id: parseInt(id, 10) }
    });

    if (blog?.seo_id) {
      await prisma.seoMetadata.delete({
        where: { id: blog.seo_id }
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
      const blog = await prisma.blog.findUnique({ where: { id: parseInt(id, 10) }, select: { slug: true } });
      resolvedSlug = blog?.slug || undefined;
    }

    await prisma.blog.update({
      where: { id: parseInt(id, 10) },
      data: {
        status,
        published_at: status === 'published' ? new Date() : null
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
