'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const prismaAny = prisma as any;

export interface FAQFormData {
  question: string;
  answer: string;
  sortOrder?: number;
  status: 'published' | 'draft';
}

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

export async function getFAQs(options?: { status?: string }) {
  try {
    return await prismaAny.fAQ.findMany({
      where: options?.status ? { status: options.status } : {},
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export async function getFAQById(id: string | number) {
  const numericId = typeof id === 'number' ? id : Number(id);
  try {
    return await prismaAny.fAQ.findUnique({ where: { id: numericId } });
  } catch (error) {
    console.error('Error fetching FAQ by id:', error);
    return null;
  }
}

export async function createFAQ(formData: FAQFormData) {
  try {
    const data = await prismaAny.fAQ.create({
      data: {
        question: formData.question,
        answer: formData.answer,
        sortOrder: formData.sortOrder ?? 0,
        status: formData.status,
      },
    });
    revalidatePath('/admin/faqs');
    revalidatePath('/contact-us');
    return { success: true, id: data.id };
  } catch (e) {
    console.error('createFAQ failed:', e);
    return { success: false, error: getErrorMessage(e) };
  }
}

export async function updateFAQ(id: string | number, formData: FAQFormData) {
  const numericId = typeof id === 'number' ? id : Number(id);
  try {
    await prismaAny.fAQ.update({
      where: { id: numericId },
      data: {
        question: formData.question,
        answer: formData.answer,
        sortOrder: formData.sortOrder ?? 0,
        status: formData.status,
      },
    });
    revalidatePath('/admin/faqs');
    revalidatePath('/contact-us');
    return { success: true };
  } catch (e) {
    console.error('updateFAQ failed:', e);
    return { success: false, error: getErrorMessage(e) };
  }
}

export async function deleteFAQ(id: string | number) {
  const numericId = typeof id === 'number' ? id : Number(id);
  try {
    await prismaAny.fAQ.delete({ where: { id: numericId } });
    revalidatePath('/admin/faqs');
    revalidatePath('/contact-us');
    return { success: true };
  } catch (e) {
    console.error('deleteFAQ failed:', e);
    return { success: false, error: getErrorMessage(e) };
  }
}

export async function toggleFAQStatus(id: string | number, status: 'published' | 'draft') {
  const numericId = typeof id === 'number' ? id : Number(id);
  try {
    await prismaAny.fAQ.update({ where: { id: numericId }, data: { status } });
    revalidatePath('/admin/faqs');
    revalidatePath('/contact-us');
    return { success: true };
  } catch (e) {
    console.error('toggleFAQStatus failed:', e);
    return { success: false, error: getErrorMessage(e) };
  }
}
