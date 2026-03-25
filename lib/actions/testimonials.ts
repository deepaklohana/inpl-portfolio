'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface TestimonialFormData {
  client_name: string;
  client_title?: string;
  client_company?: string;
  company_type?: string;
  client_image?: string;
  content: string;
  rating: number;
  project_id?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sort_order?: number;
}

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

export async function getTestimonials(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    const data = await prisma.testimonial.findMany({
      where: options?.status ? { status: options.status } : undefined,
      take: options?.limit,
      skip: options?.offset,
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ],
      include: {
        projects: {
          select: { id: true, title: true }
        }
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getTestimonialById(id: string) {
  try {
    const data = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        projects: {
          select: { id: true, title: true }
        }
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching testimonial by id:', error);
    return null;
  }
}

export async function createTestimonial(formData: TestimonialFormData) {
  try {
    const data = await prisma.testimonial.create({
      data: {
        client_name: formData.client_name,
        client_title: formData.client_title || null,
        client_company: formData.client_company || null,
        company_type: formData.company_type || null,
        client_image: formData.client_image || null,
        content: formData.content,
        rating: formData.rating,
        project_id: formData.project_id || null,
        status: formData.status,
        featured: formData.featured,
        sort_order: formData.sort_order || 0,
      }
    });
    
    revalidatePath('/admin/testimonials');
    revalidatePath('/services');
    return { success: true, id: data.id };
  } catch (e: unknown) {
    console.error('createTestimonial failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create testimonial' };
  }
}

export async function updateTestimonial(id: string, formData: TestimonialFormData) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        client_name: formData.client_name,
        client_title: formData.client_title || null,
        client_company: formData.client_company || null,
        client_image: formData.client_image || null,
        content: formData.content,
        rating: formData.rating,
        project_id: formData.project_id || null,
        status: formData.status,
        featured: formData.featured,
        sort_order: formData.sort_order || 0,
      }
    });

    revalidatePath('/admin/testimonials');
    revalidatePath('/services');
    return { success: true };
  } catch (e: unknown) {
    console.error('updateTestimonial failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id }
    });
    revalidatePath('/admin/testimonials');
    revalidatePath('/services');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteTestimonial failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete testimonial' };
  }
}

export async function toggleTestimonialStatus(id: string, status: 'published' | 'draft' | 'archived') {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/testimonials');
    revalidatePath('/services');
    return { success: true };
  } catch (e: unknown) {
    console.error('toggleTestimonialStatus failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update testimonial status' };
  }
}
