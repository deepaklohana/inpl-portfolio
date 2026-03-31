'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { triggerRevalidation } from '@/lib/actions/revalidate';
import { FULL_PUBLIC_REVALIDATION_PATHS } from '@/lib/revalidationPaths';

export interface ProjectFormData {
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  cover_image?: string;
  client_name?: string;
  industry?: string;
  tech_stack?: string;        // comma-separated string
  gallery?: string;           // comma-separated URLs
  project_url?: string;
  start_date?: string;
  end_date?: string;
  sort_order?: number;
  services_used?: string;     // comma-separated
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  // SEO
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  keywords?: string;
  no_index?: boolean;
}

function parseArray(val?: string): string[] {
  if (!val) return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

export async function getProjects(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    const data = await prisma.project.findMany({
      where: options?.status ? { status: options.status } : undefined,
      take: options?.limit,
      skip: options?.offset,
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ],
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const data = await prisma.project.findUnique({
      where: { id: parseInt(id, 10) },
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching project by id:', error);
    return null;
  }
}

// Admin helper: fetch by slug regardless of published status.
export async function getProjectBySlugAny(slug: string) {
  try {
    const data = await prisma.project.findUnique({
      where: { slug },
      include: { seo_metadata: true }
    })
    return data
  } catch (error) {
    console.error('Error fetching project by slug (any):', error)
    return null
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const data = await prisma.project.findFirst({
      where: { slug, status: 'published' },
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
}

export async function createProject(formData: ProjectFormData) {
  try {
    let seo_id = null;
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

    const projectData = await prisma.project.create({
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        description: formData.description || null,
        cover_image: formData.cover_image || null,
        client_name: formData.client_name || null,
        industry: formData.industry || null,
        tech_stack: parseArray(formData.tech_stack),
        gallery: parseArray(formData.gallery),
        project_url: formData.project_url || null,
        start_date: formData.start_date ? new Date(formData.start_date) : null,
        end_date: formData.end_date ? new Date(formData.end_date) : null,
        sort_order: formData.sort_order || 0,
        services_used: parseArray(formData.services_used),
        status: formData.status,
        featured: formData.featured,
        seo_id: seo_id,
        published_at: formData.status === 'published' ? new Date() : null,
      }
    });

    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath(`/projects/${formData.slug}`);
    
    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/projects', `/projects/${formData.slug}`]);
    }
    return { success: true, id: projectData.id };
  } catch (e: unknown) {
    console.error('createProject failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create project' };
  }
}

export async function updateProject(id: string, formData: ProjectFormData) {
  try {
    const existing = await prisma.project.findUnique({
      where: { id: parseInt(id, 10) },
      select: { seo_id: true }
    });
    
    if (!existing) return { success: false, error: 'Project not found' };

    let seo_id = existing.seo_id;
    const hasSeo = formData.meta_title || formData.meta_description || formData.og_image || formData.keywords || formData.no_index;
    
    if (hasSeo) {
      if (seo_id) {
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

    await prisma.project.update({
      where: { id: parseInt(id, 10) },
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        description: formData.description || null,
        cover_image: formData.cover_image || null,
        client_name: formData.client_name || null,
        industry: formData.industry || null,
        tech_stack: parseArray(formData.tech_stack),
        gallery: parseArray(formData.gallery),
        project_url: formData.project_url || null,
        start_date: formData.start_date ? new Date(formData.start_date) : null,
        end_date: formData.end_date ? new Date(formData.end_date) : null,
        sort_order: formData.sort_order || 0,
        services_used: parseArray(formData.services_used),
        status: formData.status,
        featured: formData.featured,
        seo_id: seo_id,
        published_at: formData.status === 'published' ? new Date() : (formData.status === 'draft' ? null : undefined),
      }
    });

    revalidatePath('/projects');
    revalidatePath(`/projects/${formData.slug}`);
    revalidatePath('/admin/projects');
    
    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/projects', `/projects/${formData.slug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('updateProject failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  try {
    const data = await prisma.project.findUnique({
      where: { id: parseInt(id, 10) },
      select: { seo_id: true }
    });

    await prisma.project.delete({
      where: { id: parseInt(id, 10) }
    });

    if (data?.seo_id) {
      await prisma.seoMetadata.delete({
        where: { id: data.seo_id }
      });
    }

    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteProject failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete project' };
  }
}

export async function toggleProjectStatus(
  id: string,
  status: 'published' | 'draft' | 'archived',
  slug?: string
) {
  try {
    let resolvedSlug = slug;
    if (!resolvedSlug) {
      const data = await prisma.project.findUnique({ where: { id: parseInt(id, 10) }, select: { slug: true } });
      resolvedSlug = data?.slug || undefined;
    }
    
    await prisma.project.update({
      where: { id: parseInt(id, 10) },
      data: {
        status,
        published_at: status === 'published' ? new Date() : null
      }
    });

    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    if (resolvedSlug) revalidatePath(`/projects/${resolvedSlug}`);
    
    if (status === 'published' && resolvedSlug) {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/projects', `/projects/${resolvedSlug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('toggleProjectStatus failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update project status' };
  }
}
