'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { triggerRevalidation } from '@/lib/actions/revalidate';
import { FULL_PUBLIC_REVALIDATION_PATHS } from '@/lib/revalidationPaths';

export interface EventFormData {
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  cover_image?: string;
  event_date?: string;
  end_date?: string;
  location?: string;
  location_url?: string;
  is_online: boolean;
  event_url?: string;
  registration_url?: string;
  gallery?: string;   // comma-separated URLs
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
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

export async function getEvents(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    const data = await prisma.event.findMany({
      where: options?.status ? { status: options.status } : undefined,
      take: options?.limit,
      skip: options?.offset,
      orderBy: { event_date: 'desc' },
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    const data = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching event by id:', error);
    return null;
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const data = await prisma.event.findFirst({
      where: { slug, status: 'published' },
      include: { seo_metadata: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return null;
  }
}

export async function createEvent(formData: EventFormData) {
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

    const eventData = await prisma.event.create({
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        description: formData.description || null,
        cover_image: formData.cover_image || null,
        event_date: formData.event_date ? new Date(formData.event_date) : null,
        end_date: formData.end_date ? new Date(formData.end_date) : null,
        location: formData.location || null,
        location_url: formData.location_url || null,
        is_online: formData.is_online,
        event_url: formData.event_url || null,
        registration_url: formData.registration_url || null,
        gallery: parseArray(formData.gallery),
        status: formData.status,
        featured: formData.featured,
        seo_id: seo_id,
        published_at: formData.status === 'published' ? new Date() : null,
      }
    });

    revalidatePath('/events');
    revalidatePath('/admin/events');
    revalidatePath(`/events/${formData.slug}`);
    
    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/events', `/events/${formData.slug}`]);
    }
    return { success: true, id: eventData.id };
  } catch (e: unknown) {
    console.error('createEvent failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create event' };
  }
}

export async function updateEvent(id: string, formData: EventFormData) {
  try {
    const existing = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
      select: { seo_id: true }
    });

    if (!existing) return { success: false, error: 'Event not found' };

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

    await prisma.event.update({
      where: { id: parseInt(id, 10) },
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        description: formData.description || null,
        cover_image: formData.cover_image || null,
        event_date: formData.event_date ? new Date(formData.event_date) : null,
        end_date: formData.end_date ? new Date(formData.end_date) : null,
        location: formData.location || null,
        location_url: formData.location_url || null,
        is_online: formData.is_online,
        event_url: formData.event_url || null,
        registration_url: formData.registration_url || null,
        gallery: parseArray(formData.gallery),
        status: formData.status,
        featured: formData.featured,
        seo_id: seo_id,
        published_at: formData.status === 'published' ? new Date() : (formData.status === 'draft' ? null : undefined),
      }
    });

    revalidatePath('/events');
    revalidatePath(`/events/${formData.slug}`);
    revalidatePath('/admin/events');
    
    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/events', `/events/${formData.slug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('updateEvent failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update event' };
  }
}

export async function deleteEvent(id: string) {
  try {
    const data = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
      select: { seo_id: true }
    });

    await prisma.event.delete({
      where: { id: parseInt(id, 10) }
    });

    if (data?.seo_id) {
      await prisma.seoMetadata.delete({
        where: { id: data.seo_id }
      });
    }

    revalidatePath('/events');
    revalidatePath('/admin/events');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteEvent failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete event' };
  }
}

export async function toggleEventStatus(
  id: string,
  status: 'published' | 'draft' | 'archived',
  slug?: string
) {
  try {
    let resolvedSlug = slug;
    if (!resolvedSlug) {
      const data = await prisma.event.findUnique({ where: { id: parseInt(id, 10) }, select: { slug: true } });
      resolvedSlug = data?.slug || undefined;
    }
    
    await prisma.event.update({
      where: { id: parseInt(id, 10) },
      data: {
        status,
        published_at: status === 'published' ? new Date() : null
      }
    });

    revalidatePath('/events');
    revalidatePath('/admin/events');
    if (resolvedSlug) revalidatePath(`/events/${resolvedSlug}`);
    
    if (status === 'published' && resolvedSlug) {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/events', `/events/${resolvedSlug}`]);
    }
    return { success: true };
  } catch (e: unknown) {
    console.error('toggleEventStatus failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update event status' };
  }
}
