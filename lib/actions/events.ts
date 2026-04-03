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

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

export async function getEvents(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    const data = await prisma.article.findMany({
      where: {
        type: 'event',
        ...(options?.status ? { status: options.status } : {})
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { eventDate: 'desc' },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    const data = await prisma.article.findUnique({
      where: { id },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching event by id:', error);
    return null;
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const data = await prisma.article.findFirst({
      where: { type: 'event', slug, status: 'published' },
      include: { seo: true }
    });
    return data;
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return null;
  }
}

export async function createEvent(formData: EventFormData) {
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

    const eventData = await prisma.article.create({
      data: {
        type: 'event',
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.description || null,
        coverImage: formData.cover_image || null,
        eventDate: formData.event_date ? new Date(formData.event_date) : null,
        eventEndDate: formData.end_date ? new Date(formData.end_date) : null,
        location: formData.location || null,
        locationUrl: formData.location_url || null,
        isOnline: formData.is_online,
        eventUrl: formData.event_url || null,
        registrationUrl: formData.registration_url || null,
        status: formData.status,
        featured: formData.featured,
        seoId: seoId,
        publishedAt: formData.status === 'published' ? new Date() : null,
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
    const existing = await prisma.article.findUnique({
      where: { id },
      select: { seoId: true }
    });

    if (!existing) return { success: false, error: 'Event not found' };

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
        content: formData.description || null,
        coverImage: formData.cover_image || null,
        eventDate: formData.event_date ? new Date(formData.event_date) : null,
        eventEndDate: formData.end_date ? new Date(formData.end_date) : null,
        location: formData.location || null,
        locationUrl: formData.location_url || null,
        isOnline: formData.is_online,
        eventUrl: formData.event_url || null,
        registrationUrl: formData.registration_url || null,
        status: formData.status,
        featured: formData.featured,
        seoId: seoId,
        publishedAt: formData.status === 'published' ? new Date() : (formData.status === 'draft' ? null : undefined),
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
