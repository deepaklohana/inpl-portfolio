'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CategoryFormData {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  shortDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  sortOrder?: number;
  status: 'draft' | 'published' | 'archived';
}

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

export async function getServiceCategories() {
  try {
    return await prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { services: true } } },
    });
  } catch (e) {
    console.error('getServiceCategories failed:', e);
    return [];
  }
}

export async function getServiceCategoryById(id: string) {
  try {
    return await prisma.serviceCategory.findUnique({ where: { id } });
  } catch (e) {
    console.error('getServiceCategoryById failed:', e);
    return null;
  }
}

export async function createServiceCategory(data: CategoryFormData) {
  try {
    const cat = await prisma.serviceCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon || null,
        description: data.description || null,
        shortDescription: data.shortDescription || null,
        sortOrder: data.sortOrder || 0,
        status: data.status,
      },
    });
    revalidatePath('/admin/services/categories');
    return { success: true, id: cat.id };
  } catch (e: unknown) {
    console.error('createServiceCategory failed:', e);
    return { success: false, error: getErrorMessage(e) };
  }
}

export async function updateServiceCategory(id: string, data: CategoryFormData) {
  try {
    await prisma.serviceCategory.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon || null,
        description: data.description || null,
        shortDescription: data.shortDescription || null,
        sortOrder: data.sortOrder || 0,
        status: data.status,
      },
    });
    revalidatePath('/admin/services/categories');
    return { success: true };
  } catch (e: unknown) {
    console.error('updateServiceCategory failed:', e);
    return { success: false, error: getErrorMessage(e) };
  }
}

export async function deleteServiceCategory(id: string) {
  try {
    await prisma.serviceCategory.delete({ where: { id } });
    revalidatePath('/admin/services/categories');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteServiceCategory failed:', e);
    return { success: false, error: getErrorMessage(e) };
  }
}

export async function toggleCategoryStatus(id: string, status: 'published' | 'draft' | 'archived') {
  try {
    await prisma.serviceCategory.update({ where: { id }, data: { status } });
    revalidatePath('/admin/services/categories');
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: getErrorMessage(e) };
  }
}
