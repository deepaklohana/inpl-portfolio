'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Temporary type cast to avoid IDE/prisma-client type desync while still using
// the real schema at runtime.
const prismaAny = prisma as any;

export interface TestimonialFormData {
  client_name: string;
  client_title?: string;
  client_company?: string;
  company_type?: string;
  client_image?: string;
  content: string;
  rating: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sort_order?: number;
  // Which pages this testimonial should appear on
  // e.g. ["services", "home", "products"]
  showOnPages?: string[];
}

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

export async function getTestimonials(options?: {
  status?: string;
  page?: string; // filter by page e.g. "services"
  productId?: string; // filter by product (via ProductTestimonial join)
  featured?: boolean;
  limit?: number;
}) {
  try {
    // Case 1: page-based display (showOnPages)
    if (options?.page) {
      const take = Math.min(options.limit ?? 4, 4);
      return prismaAny.testimonial.findMany({
        where: {
          status: 'published',
          showOnPages: { has: options.page },
          ...(options.featured !== undefined ? { featured: options.featured } : {}),
        },
        take,
        orderBy: [{ featured: 'desc' }, { sort_order: 'asc' }],
      });
    }

    // Case 2: product-based display (direct Product <-> Testimonial join)
    if (options?.productId) {
      const productId = Number(options.productId);
      const rows = await prismaAny.productTestimonial.findMany({
        where: {
          productId,
          testimonial: { status: 'published' },
        },
        orderBy: { sortOrder: 'asc' },
        take: 4,
        include: {
          testimonial: true,
        },
      });

      return rows.map((r: any) => r.testimonial);
    }

    // Case 3: fallback (admin / internal listing)
    return prisma.testimonial.findMany({
      where: {
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.featured !== undefined ? { featured: options.featured } : {}),
      },
      take: options?.limit,
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getTestimonialsForAdmin() {
  try {
    const testimonials = await prismaAny.testimonial.findMany({
      select: {
        id: true,
        client_name: true,
        client_title: true,
        client_company: true,
        client_image: true,
        content: true,
        rating: true,
        status: true,
        featured: true,
        showOnPages: true,
        products: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    });

    return testimonials.map((t: any) => ({
      id: String(t.id),
      clientName: t.client_name,
      clientTitle: t.client_title,
      clientCompany: t.client_company,
      clientImage: t.client_image,
      content: t.content,
      rating: t.rating,
      status: t.status,
      featured: t.featured,
      showOnPages: t.showOnPages,
      products: t.products,
    }));
  } catch (error) {
    console.error('Error fetching testimonials for admin:', error);
    return [];
  }
}

export async function getPageTestimonialCounts() {
  try {
    const testimonials = await prismaAny.testimonial.findMany({
      where: { status: 'published' },
      select: { showOnPages: true },
    });

    const counts: Record<string, number> = {};
    for (const t of testimonials) {
      const pages: string[] = Array.isArray(t.showOnPages) ? t.showOnPages : [];
      for (const page of pages) {
        if (!page) continue;
        counts[page] = (counts[page] ?? 0) + 1;
      }
    }

    return counts;
  } catch (error) {
    console.error('Error fetching testimonial page counts:', error);
    return {};
  }
}

export async function getPublishedTestimonialsForPicker() {
  try {
    const rows = await prismaAny.testimonial.findMany({
      where: { status: 'published' },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
      select: {
        id: true,
        client_name: true,
        client_title: true,
        client_company: true,
        client_image: true,
        rating: true,
        content: true,
        showOnPages: true,
        products: {
          select: {
            product: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return rows.map((t: any) => ({
      id: String(t.id),
      client_name: t.client_name,
      client_title: t.client_title,
      client_company: t.client_company,
      client_image: t.client_image,
      rating: t.rating,
      content: t.content,
      showOnPages: Array.isArray(t.showOnPages) ? t.showOnPages : [],
      products: (t.products ?? []).map((p: any) => p.product).filter(Boolean),
    }));
  } catch (error) {
    console.error('getPublishedTestimonialsForPicker failed:', error);
    return [];
  }
}

async function validateMaxTestimonialsPerPage(pages: string[], excludeTestimonialId?: number) {
  const uniquePages = Array.from(new Set(pages.map((p) => String(p).trim()).filter(Boolean)));
  for (const page of uniquePages) {
    const count = await prismaAny.testimonial.count({
      where: {
        showOnPages: { has: page },
        status: 'published',
        ...(excludeTestimonialId !== undefined ? { id: { not: excludeTestimonialId } } : {}),
      },
    });

    if (count >= 4) {
      throw new Error(`Max 4 testimonials allowed on ${page} page`);
    }
  }
}

export async function updateTestimonialPages(id: string, pages: string[]) {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return { success: false, error: 'Invalid testimonial id' };
  }

  const uniquePages = Array.from(new Set(pages.map((p) => String(p).trim()).filter(Boolean)));
  await validateMaxTestimonialsPerPage(uniquePages, numericId);

  await prismaAny.testimonial.update({
    where: { id: numericId },
    data: { showOnPages: uniquePages },
  });

  revalidatePath('/services');
  revalidatePath('/');

  return { success: true };
}

export async function getServiceTestimonials(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    const status = options?.status ?? 'published';
    const take = Math.min(options?.limit ?? 4, 4);

    return await prisma.testimonial.findMany({
      where: {
        showOnPages: { has: 'services' },
        status,
      } as any,
      take,
      skip: options?.offset,
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' },
      ],
    });
  } catch (error) {
    console.error('Error fetching service testimonials:', error)
    return []
  }
}

export async function getProductTestimonialsForDisplay(
  productId: number,
  options?: { status?: string; limit?: number; offset?: number }
) {
  const status = options?.status ?? 'published';
  const take = Math.min(options?.limit ?? 4, 4);

  try {
    const rows = await prismaAny.productTestimonial.findMany({
      where: {
        productId,
        testimonial: { status },
      },
      take,
      skip: options?.offset,
      orderBy: { sortOrder: 'asc' },
      include: {
        testimonial: true,
      },
    });

    return rows.map((r: any) => r.testimonial);
  } catch (error) {
    console.error('Error fetching product testimonials:', error);
    return [];
  }
}

export async function getTestimonialById(id: string | number) {
  const numericId = typeof id === 'number' ? id : Number(id)
  try {
    const data = await prisma.testimonial.findUnique({
      where: { id: numericId },
    });
    return data;
  } catch (error) {
    console.error('Error fetching testimonial by id:', error);
    return null;
  }
}

export async function createTestimonial(formData: TestimonialFormData) {
  try {
    const showOnPages = formData.showOnPages ?? []
    const uniquePages = Array.from(new Set(showOnPages.map((p) => String(p).trim()).filter(Boolean)))

    await validateMaxTestimonialsPerPage(uniquePages)

    const data = await prismaAny.testimonial.create({
      data: {
        client_name: formData.client_name,
        client_title: formData.client_title || null,
        client_company: formData.client_company || null,
        company_type: formData.company_type || null,
        client_image: formData.client_image || null,
        content: formData.content,
        rating: formData.rating,
        status: formData.status,
        featured: formData.featured,
        sort_order: formData.sort_order || 0,
        showOnPages: uniquePages,
      }
    });
    
    revalidatePath('/admin/testimonials');
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true, id: data.id };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '';
    if (message.startsWith('Max 4 testimonials allowed')) throw e;
    console.error('createTestimonial failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create testimonial' };
  }
}

export async function updateTestimonial(id: string | number, formData: TestimonialFormData) {
  const numericId = typeof id === 'number' ? id : Number(id)
  try {
    const showOnPages = formData.showOnPages ?? []
    const uniquePages = Array.from(new Set(showOnPages.map((p) => String(p).trim()).filter(Boolean)))

    await validateMaxTestimonialsPerPage(uniquePages, numericId)

    await prismaAny.testimonial.update({
      where: { id: numericId },
      data: {
        client_name: formData.client_name,
        client_title: formData.client_title || null,
        client_company: formData.client_company || null,
        client_image: formData.client_image || null,
        content: formData.content,
        rating: formData.rating,
        status: formData.status,
        featured: formData.featured,
        sort_order: formData.sort_order || 0,
        showOnPages: uniquePages,
      }
    });

    revalidatePath('/admin/testimonials');
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '';
    if (message.startsWith('Max 4 testimonials allowed')) throw e;
    console.error('updateTestimonial failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(id: string | number) {
  const numericId = typeof id === 'number' ? id : Number(id)
  try {
    await prisma.testimonial.delete({
      where: { id: numericId }
    });
    revalidatePath('/admin/testimonials');
    revalidatePath('/services');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteTestimonial failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete testimonial' };
  }
}

export async function toggleTestimonialStatus(id: string | number, status: 'published' | 'draft' | 'archived') {
  const numericId = typeof id === 'number' ? id : Number(id)
  try {
    await prisma.testimonial.update({
      where: { id: numericId },
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
