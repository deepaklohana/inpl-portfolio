/**
 * cached-queries.ts
 *
 * React cache() se wrap ki hui read-only DB queries.
 * Iska faida: ek hi request mein (generateMetadata + page component)
 * same slug ke liye sirf EK DB call hogi — duplicate calls band.
 *
 * NOTE: cache() sirf ek request ke scope mein kaam karta hai,
 * yeh ISR/CDN caching se alag hai.
 */

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

// ─── Products ────────────────────────────────────────────────────────────────

export const getCachedProductBySlug = cache(async (slug: string) => {
  try {
    return await prisma.product.findFirst({
      where: { slug, status: 'published' },
      include: {
        modules: {
          where: { status: 'published' },
          orderBy: { sortOrder: 'asc' },
          include: {
            features: {
              where: { status: 'published' },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        testimonials: {
          orderBy: { sortOrder: 'asc' },
          include: {
            testimonial: true,
          },
        },
        seo: true,
      },
    });
  } catch (error) {
    console.error('getCachedProductBySlug failed:', error);
    return null;
  }
});

export const getCachedProducts = cache(async (status?: string) => {
  try {
    const where: any = {};
    if (status) where.status = status;
    return await prisma.product.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { modules: true } },
        modules: {
          orderBy: { sortOrder: 'asc' },
          select: { name: true },
        },
      },
    });
  } catch (error) {
    console.error('getCachedProducts failed:', error);
    return [];
  }
});

// ─── Services ─────────────────────────────────────────────────────────────────

export const getCachedServiceBySlug = cache(async (slug: string) => {
  try {
    return await prisma.service.findUnique({
      where: { slug },
      include: { seo_metadata: true },
    });
  } catch (error) {
    console.error('getCachedServiceBySlug failed:', error);
    return null;
  }
});

export const getCachedServices = cache(async (status?: string) => {
  try {
    return await prisma.service.findMany({
      where: status ? { status } : undefined,
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
      include: { seo_metadata: true },
    });
  } catch (error) {
    console.error('getCachedServices failed:', error);
    return [];
  }
});

// ─── Articles / News / Blogs ──────────────────────────────────────────────────

export const getCachedArticleBySlug = cache(async (slug: string) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { seo: true },
    });
    if (!article || article.status !== 'published') return null;
    return article;
  } catch (error) {
    console.error('getCachedArticleBySlug failed:', error);
    return null;
  }
});

export const getCachedPublishedArticleSlugs = cache(async () => {
  try {
    return await prisma.article.findMany({
      where: { status: 'published' },
      select: { slug: true },
    });
  } catch (error) {
    console.error('getCachedPublishedArticleSlugs failed:', error);
    return [];
  }
});

export const getCachedPublishedServiceSlugs = cache(async () => {
  try {
    return await prisma.service.findMany({
      where: { status: 'published' },
      select: { slug: true },
    });
  } catch (error) {
    console.error('getCachedPublishedServiceSlugs failed:', error);
    return [];
  }
});

export const getCachedPublishedProductSlugs = cache(async () => {
  try {
    return await prisma.product.findMany({
      where: { status: 'published' },
      select: { slug: true },
    });
  } catch (error) {
    console.error('getCachedPublishedProductSlugs failed:', error);
    return [];
  }
});
