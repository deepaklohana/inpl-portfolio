'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { triggerRevalidation } from '@/lib/actions/revalidate';
import { FULL_PUBLIC_REVALIDATION_PATHS } from '@/lib/revalidationPaths';

export interface ServiceFormData {
  title: string;
  slug: string;
  excerpt?: string;
  icon?: string;
  // Category
  categoryId?: string;
  // Features & tech
  features?: string; // JSON string -> array of { title, items }
  // Pricing
  startingPrice?: string;
  // Process steps  (JSON string → array of {step, title, description})
  processSteps?: string;
  // Tools used     (JSON string → array of {name, icon, category})
  toolsUsed?: string;
  // Stats bar       (JSON string → array of {value, label})
  stats?: string;
  // CTA
  ctaTitle?: string;
  ctaSubtitle?: string;
  // Meta
  sort_order?: number;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJson(val?: string): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (!val) return Prisma.JsonNull;
  try { return JSON.parse(val) as Prisma.InputJsonValue; } catch { return Prisma.JsonNull; }
}

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getServiceCategories() {
  try {
    return await prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
}

export async function getServices(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    return await prisma.service.findMany({
      where: options?.status ? { status: options.status } : undefined,
      take: options?.limit,
      skip: options?.offset,
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
      include: { seo_metadata: true, category: true },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getServiceById(id: string) {
  try {
    return await prisma.service.findUnique({
      where: { id },
      include: { seo_metadata: true, category: true },
    });
  } catch (error) {
    console.error('Error fetching service by id:', error);
    return null;
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await prisma.service.findFirst({
      where: { slug, status: 'published' },
      include: { seo_metadata: true, category: true },
    });
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return null;
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createService(formData: ServiceFormData) {
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

    const serviceData = await prisma.service.create({
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        icon: formData.icon || null,
        categoryId: formData.categoryId || null,
        features: parseJson(formData.features),
        startingPrice: formData.startingPrice || null,
        processSteps: parseJson(formData.processSteps),
        toolsUsed: parseJson(formData.toolsUsed),
        stats: parseJson(formData.stats),
        ctaTitle: formData.ctaTitle || null,
        ctaSubtitle: formData.ctaSubtitle || null,
        sort_order: formData.sort_order || 0,
        status: formData.status,
        featured: formData.featured,
        seo_id,
        published_at: formData.status === 'published' ? new Date() : null,
      }
    });

    revalidatePath('/services');
    revalidatePath('/admin/services');
    revalidatePath(`/services/${formData.slug}`);

    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/services', `/services/${formData.slug}`]);
    }
    return { success: true, id: serviceData.id };
  } catch (e: unknown) {
    console.error('createService failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create service' };
  }
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateService(id: string, formData: ServiceFormData) {
  try {
    const existing = await prisma.service.findUnique({
      where: { id },
      select: { seo_id: true },
    });

    if (!existing) return { success: false, error: 'Service not found' };

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

    await prisma.service.update({
      where: { id },
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        icon: formData.icon || null,
        categoryId: formData.categoryId || null,
        features: parseJson(formData.features),
        startingPrice: formData.startingPrice || null,
        processSteps: parseJson(formData.processSteps),
        toolsUsed: parseJson(formData.toolsUsed),
        stats: parseJson(formData.stats),
        ctaTitle: formData.ctaTitle || null,
        ctaSubtitle: formData.ctaSubtitle || null,
        sort_order: formData.sort_order || 0,
        status: formData.status,
        featured: formData.featured,
        seo_id,
        published_at: formData.status === 'published' ? new Date() : (formData.status === 'draft' ? null : undefined),
      }
    });

    revalidatePath('/services');
    revalidatePath(`/services/${formData.slug}`);
    revalidatePath('/admin/services');

    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/services', `/services/${formData.slug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('updateService failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update service' };
  }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteService(id: string) {
  try {
    const data = await prisma.service.findUnique({
      where: { id },
      select: { seo_id: true },
    });

    await prisma.service.delete({ where: { id } });

    if (data?.seo_id) {
      await prisma.seoMetadata.delete({ where: { id: data.seo_id } });
    }

    revalidatePath('/services');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteService failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete service' };
  }
}

// ─── Toggle Status ────────────────────────────────────────────────────────────

export async function toggleServiceStatus(
  id: string,
  status: 'published' | 'draft' | 'archived',
  slug?: string
) {
  try {
    let resolvedSlug = slug;
    if (!resolvedSlug) {
      const data = await prisma.service.findUnique({ where: { id }, select: { slug: true } });
      resolvedSlug = data?.slug || undefined;
    }

    await prisma.service.update({
      where: { id },
      data: { status, published_at: status === 'published' ? new Date() : null }
    });

    revalidatePath('/services');
    revalidatePath('/admin/services');
    if (resolvedSlug) revalidatePath(`/services/${resolvedSlug}`);

    if (status === 'published' && resolvedSlug) {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/services', `/services/${resolvedSlug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('toggleServiceStatus failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update service status' };
  }
}
