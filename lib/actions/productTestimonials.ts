'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function toInt(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`Invalid id: ${value}`);
  return n;
}

async function revalidateProductPath(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });

  if (product?.slug) {
    revalidatePath(`/products/${product.slug}`);
  } else {
    revalidatePath('/products');
  }
}

export async function getProductTestimonials(productId: string) {
  const pid = toInt(productId);

  return prisma.productTestimonial.findMany({
    where: {
      productId: pid,
      testimonial: { status: 'published' },
    },
    orderBy: { sortOrder: 'asc' },
    include: { testimonial: true },
  });
}

export async function addTestimonialToProduct(productId: string, testimonialId: string) {
  const pid = toInt(productId);
  const tid = toInt(testimonialId);

  const count = await prisma.productTestimonial.count({
    where: { productId: pid },
  });

  if (count >= 4) throw new Error('Maximum 4 testimonials per product');

  await prisma.productTestimonial.create({
    data: { productId: pid, testimonialId: tid, sortOrder: count },
  });

  await revalidateProductPath(pid);

  return { success: true };
}

export async function removeTestimonialFromProduct(productId: string, testimonialId: string) {
  const pid = toInt(productId);
  const tid = toInt(testimonialId);

  await prisma.productTestimonial.delete({
    where: {
      productId_testimonialId: { productId: pid, testimonialId: tid },
    },
  });

  await revalidateProductPath(pid);

  return { success: true };
}

export async function updateProductTestimonialsOrder(
  productId: string,
  items: { testimonialId: string; sortOrder: number }[]
) {
  const pid = toInt(productId);

  await prisma.$transaction(
    items.map((item) => {
      const tid = toInt(item.testimonialId);
      return prisma.productTestimonial.update({
        where: {
          productId_testimonialId: { productId: pid, testimonialId: tid },
        },
        data: { sortOrder: item.sortOrder },
      });
    })
  );

  await revalidateProductPath(pid);

  return { success: true };
}

