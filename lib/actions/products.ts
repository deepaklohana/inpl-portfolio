'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

function isConnectionPoolTimeout(err: unknown) {
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: unknown }).message
          : undefined

  const lower = String(msg ?? '').toLowerCase()
  return (
    lower.includes('connection pool') ||
    lower.includes('timed out fetching a new connection') ||
    lower.includes('timed out fetching')
  )
}

function userFriendlyDbBusyMessage() {
  return 'Server is busy right now. Please try again in a few seconds.'
}

async function retryPrismaOperation<T>(operation: () => Promise<T>): Promise<T> {
  const maxAttempts = 3
  let lastErr: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (err) {
      lastErr = err
      if (!isConnectionPoolTimeout(err) || attempt === maxAttempts) break

      const delayMs = attempt * 500
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }

  if (isConnectionPoolTimeout(lastErr)) {
    throw new Error(userFriendlyDbBusyMessage())
  }

  throw lastErr
}

export async function getProducts(options?: { status?: string; featured?: boolean }) {
  const where: any = {};
  if (options?.status) where.status = options.status;
  if (options?.featured !== undefined) where.featured = options.featured;

  return retryPrismaOperation(() =>
    prisma.product.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { modules: true }
        },
        modules: {
          orderBy: { sortOrder: 'asc' },
          select: { name: true }
        }
      }
    })
  )
}

export async function getProductBySlug(slug: string) {
  return retryPrismaOperation(() =>
    prisma.product.findFirst({
      where: { slug, status: 'published' },
      include: {
        modules: {
          where: { status: 'published' },
          orderBy: { sortOrder: 'asc' },
          include: {
            features: {
              where: { status: 'published' },
              orderBy: { sortOrder: 'asc' }
            }
          }
        },
        testimonials: {
          orderBy: { sortOrder: 'asc' },
          include: {
            testimonial: true
          }
        },
        seo: true
      }
    })
  )
}

export async function getProductById(id: number) {
  return retryPrismaOperation(() =>
    prisma.product.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            features: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        },
        testimonials: {
          orderBy: { sortOrder: 'asc' },
          include: {
            testimonial: true
          }
        },
        seo: true
      }
    })
  )
}

export async function createProduct(data: any) {
  const { seo, ...productData } = data;
  
  let seoId = undefined;
  if (seo) {
    const newSeo = await prisma.seoMetadata.create({
      data: seo
    });
    seoId = newSeo.id;
  }

  try {
    const product = await prisma.product.create({
      data: {
        ...productData,
        seoId
      }
    });
    revalidatePath('/products');
    return { success: true, id: product.id, slug: product.slug };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error(`A product with the slug "${productData.slug}" already exists. Please use a different name or slug.`);
    }
    throw error;
  }
}

export async function updateProduct(id: number, data: any) {
  const { seo, ...productData } = data;
  
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: { seoId: true, slug: true }
  });

  let seoId = existingProduct?.seoId;

  if (seo) {
    if (seoId) {
      await prisma.seoMetadata.update({
        where: { id: seoId },
        data: seo
      });
    } else {
      const newSeo = await prisma.seoMetadata.create({
        data: seo
      });
      seoId = newSeo.id;
    }
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        seoId
      }
    });
    revalidatePath('/products');
    if (updatedProduct.slug) {
      revalidatePath(`/products/${updatedProduct.slug}`);
    }
    if (existingProduct?.slug && existingProduct.slug !== updatedProduct.slug) {
      revalidatePath(`/products/${existingProduct.slug}`);
    }
    return { success: true, id: updatedProduct.id, slug: updatedProduct.slug };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error(`A product with the slug "${productData.slug}" already exists. Please use a different slug.`);
    }
    throw error;
  }
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({
    where: { id }
  });
  
  revalidatePath('/products');
  return { success: true };
}

export async function updateProductsOrder(items: { id: number; sortOrder: number }[]) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder }
      })
    )
  );
  
  revalidatePath('/products');
  return { success: true };
}
