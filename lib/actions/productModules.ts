'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createModule(productId: number, data: any) {
  const module = await prisma.productModule.create({
    data: {
      productId,
      ...data
    }
  });
  revalidatePath(`/admin/products/${productId}`);
  return { success: true, module };
}

export async function updateModule(id: number, data: any) {
  const module = await prisma.productModule.update({
    where: { id },
    data
  });
  revalidatePath(`/admin/products/${module.productId}`);
  return { success: true, module };
}

export async function deleteModule(id: number) {
  const module = await prisma.productModule.delete({
    where: { id }
  });
  revalidatePath(`/admin/products/${module.productId}`);
  return { success: true };
}

export async function updateModulesOrder(items: { id: number; sortOrder: number }[], productId?: number) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.productModule.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder }
      })
    )
  );
  
  if (productId) {
    revalidatePath(`/admin/products/${productId}`);
  }
  return { success: true };
}
