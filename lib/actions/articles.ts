'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { triggerRevalidation } from '@/lib/actions/revalidate';
import { FULL_PUBLIC_REVALIDATION_PATHS } from '@/lib/revalidationPaths';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ArticleType = 'news' | 'blog' | 'event';

export interface ArticleFormData {
  type: ArticleType;

  // Core
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;

  // Author
  authorName?: string;
  authorTitle?: string;
  authorImage?: string;
  authorBio?: string;
  authorSocials?: { platform: string; url: string }[] | null;

  // Meta display
  readTime?: string;

  // Category + Tags
  category?: string;
  tags?: string[];

  // Event-specific
  eventDate?: Date | string | null;
  eventEndDate?: Date | string | null;
  location?: string;
  locationUrl?: string;
  isOnline?: boolean;
  eventUrl?: string;
  registrationUrl?: string;

  // Publishing
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  publishedAt?: Date | string | null;
  sortOrder?: number;

  // SEO (flat fields, stored separately in SeoMetadata)
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  keywords?: string;
  no_index?: boolean;
}

export type GetArticlesOptions = {
  type?: ArticleType;
  status?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  tag?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) {
    if (e.name === 'PrismaClientValidationError' || e.message.includes('Invalid `prisma')) {
      return 'Database schema is out of sync or invalid data provided. Try restarting the server.';
    }
    return e.message;
  }
  return 'Request failed';
}

/** Returns the public-facing path prefix for a given article type. */
function publicPath(type: ArticleType): string {
  if (type === 'event') return '/events';
  if (type === 'blog') return '/blog';
  return '/news';
}

/** Upserts SeoMetadata and returns the seoId (int). */
async function upsertSeo(
  existingSeoId: number | null | undefined,
  formData: Pick<
    ArticleFormData,
    'meta_title' | 'meta_description' | 'og_image' | 'keywords' | 'no_index'
  >
): Promise<number | null> {
  const hasSeoData =
    formData.meta_title ||
    formData.meta_description ||
    formData.og_image ||
    formData.keywords ||
    formData.no_index;

  if (!hasSeoData) return existingSeoId ?? null;

  const seoPayload = {
    meta_title: formData.meta_title ?? null,
    meta_description: formData.meta_description ?? null,
    og_image: formData.og_image ?? null,
    keywords: formData.keywords ?? null,
    no_index: formData.no_index ?? false,
  };

  if (existingSeoId) {
    await prisma.seoMetadata.update({
      where: { id: existingSeoId },
      data: seoPayload,
    });
    return existingSeoId;
  }

  const created = await prisma.seoMetadata.create({ data: seoPayload });
  return created.id;
}

/** Builds the Prisma data object from ArticleFormData (excluding SEO flat fields). */
function buildArticleData(formData: ArticleFormData, seoId: number | null) {
  return {
    type: formData.type,
    title: formData.title,
    slug: formData.slug,
    excerpt: formData.excerpt ?? null,
    content: formData.content ?? null,
    coverImage: formData.coverImage ?? null,

    authorName: formData.authorName ?? null,
    authorTitle: formData.authorTitle ?? null,
    authorImage: formData.authorImage ?? null,
    authorBio: formData.authorBio ?? null,
    authorSocials: formData.authorSocials ? (formData.authorSocials as any) : undefined,

    readTime: formData.readTime ?? null,

    category: formData.category ?? null,
    tags: formData.tags ?? [],

    // Event-specific
    eventDate: formData.eventDate ? new Date(formData.eventDate) : null,
    eventEndDate: formData.eventEndDate ? new Date(formData.eventEndDate) : null,
    location: formData.location ?? null,
    locationUrl: formData.locationUrl ?? null,
    isOnline: formData.isOnline ?? false,
    eventUrl: formData.eventUrl ?? null,
    registrationUrl: formData.registrationUrl ?? null,

    // Publishing
    status: formData.status,
    featured: formData.featured ?? false,
    sortOrder: formData.sortOrder ?? 0,
    seoId,
  };
}

// ---------------------------------------------------------------------------
// 1. getArticles
// ---------------------------------------------------------------------------

export async function getArticles(options: GetArticlesOptions = {}) {
  try {
    const where = {
      ...(options.type && { type: options.type }),
      ...(options.status && { status: options.status }),
      ...(options.category && { category: options.category }),
      ...(options.featured !== undefined && { featured: options.featured }),
      ...(options.tag && { tags: { has: options.tag } }),
    };

    const data = await prisma.article.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: options.limit,
      skip: options.offset,
      include: { seo: true },
    });

    return data;
  } catch (error) {
    console.error('getArticles failed:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 2. getArticleBySlug  (public page — also increments views)
// ---------------------------------------------------------------------------

export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { seo: true },
    });

    if (!article || article.status !== 'published') return null;

    // Increment views in the background (fire-and-forget)
    prisma.article
      .update({ where: { slug }, data: { views: { increment: 1 } } })
      .catch((e) => console.error('incrementViews (getArticleBySlug) failed:', e));

    return article;
  } catch (error) {
    console.error('getArticleBySlug failed:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 3. getArticleById  (admin — no status filter, no view increment)
// ---------------------------------------------------------------------------

export async function getArticleById(id: string) {
  try {
    const data = await prisma.article.findUnique({
      where: { id },
      include: { seo: true },
    });
    return data;
  } catch (error) {
    console.error('getArticleById failed:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 4. createArticle
// ---------------------------------------------------------------------------

export async function createArticle(formData: ArticleFormData) {
  try {
    const seoId = await upsertSeo(null, formData);

    const data = {
      ...buildArticleData(formData, seoId),
      publishedAt: formData.status === 'published' ? new Date() : null,
    };

    const article = await prisma.article.create({ data });

    const typePath = publicPath(formData.type);
    revalidatePath('/news-events');
    revalidatePath(typePath);
    revalidatePath(`/news-events/${formData.slug}`);
    revalidatePath('/admin/articles');

    if (formData.status === 'published') {
      await triggerRevalidation([
        ...FULL_PUBLIC_REVALIDATION_PATHS,
        '/news-events',
        typePath,
        `/news-events/${formData.slug}`,
      ]);
    }

    return { success: true, id: article.id };
  } catch (e: unknown) {
    console.error('createArticle failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create article' };
  }
}

// ---------------------------------------------------------------------------
// 5. updateArticle
// ---------------------------------------------------------------------------

export async function updateArticle(id: string, formData: ArticleFormData) {
  try {
    const existing = await prisma.article.findUnique({
      where: { id },
      select: { seoId: true, publishedAt: true, slug: true },
    });

    if (!existing) {
      return { success: false, error: 'Article not found' };
    }

    const seoId = await upsertSeo(existing.seoId, formData);

    // Only set publishedAt when first transitioning to 'published'
    const publishedAt =
      formData.status === 'published' && !existing.publishedAt
        ? new Date()
        : formData.status === 'draft'
        ? null
        : existing.publishedAt;

    const data = {
      ...buildArticleData(formData, seoId),
      publishedAt,
    };

    await prisma.article.update({ where: { id }, data });

    const slug = formData.slug || existing.slug;
    const typePath = publicPath(formData.type);
    revalidatePath('/news-events');
    revalidatePath(typePath);
    revalidatePath(`/news-events/${slug}`);
    revalidatePath('/admin/articles');

    if (formData.status === 'published') {
      await triggerRevalidation([
        ...FULL_PUBLIC_REVALIDATION_PATHS,
        '/news-events',
        typePath,
        `/news-events/${slug}`,
      ]);
    }

    return { success: true };
  } catch (e: unknown) {
    console.error('updateArticle failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update article' };
  }
}

// ---------------------------------------------------------------------------
// 6. deleteArticle
// ---------------------------------------------------------------------------

export async function deleteArticle(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select: { seoId: true, slug: true, type: true },
    });

    await prisma.article.delete({ where: { id } });

    // Clean up orphaned SEO record
    if (article?.seoId) {
      await prisma.seoMetadata
        .delete({ where: { id: article.seoId } })
        .catch(() => {}); // ignore if already gone
    }

    revalidatePath('/news-events');
    if (article?.type) revalidatePath(publicPath(article.type as ArticleType));
    revalidatePath('/admin/articles');

    return { success: true };
  } catch (e: unknown) {
    console.error('deleteArticle failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete article' };
  }
}

// ---------------------------------------------------------------------------
// 7. toggleArticleStatus
// ---------------------------------------------------------------------------

export async function toggleArticleStatus(
  id: string,
  status: 'draft' | 'published' | 'archived'
) {
  try {
    let slug: string | undefined;
    let type: ArticleType | undefined;

    const existing = await prisma.article.findUnique({
      where: { id },
      select: { slug: true, type: true, publishedAt: true },
    });
    slug = existing?.slug;
    type = existing?.type as ArticleType | undefined;

    await prisma.article.update({
      where: { id },
      data: {
        status,
        publishedAt:
          status === 'published' && !existing?.publishedAt
            ? new Date()
            : status === 'draft'
            ? null
            : undefined,
      },
    });

    revalidatePath('/news-events');
    if (slug) revalidatePath(`/news-events/${slug}`);
    if (type) revalidatePath(publicPath(type));
    revalidatePath('/admin/articles');

    if (status === 'published' && slug && type) {
      await triggerRevalidation([
        ...FULL_PUBLIC_REVALIDATION_PATHS,
        '/news-events',
        publicPath(type),
        `/news-events/${slug}`,
      ]);
    }

    return { success: true };
  } catch (e: unknown) {
    console.error('toggleArticleStatus failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update article status' };
  }
}

// ---------------------------------------------------------------------------
// 8. incrementViews  (call from public page component / route handler)
// ---------------------------------------------------------------------------

export async function incrementViews(slug: string) {
  try {
    await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
    return { success: true };
  } catch (e: unknown) {
    console.error('incrementViews failed:', e);
    return { success: false, error: getErrorMessage(e) };
  }
}

// ---------------------------------------------------------------------------
// 9. getRelatedArticles
// ---------------------------------------------------------------------------

export async function getRelatedArticles(
  id: string,
  type: ArticleType,
  category?: string,
  limit = 3
) {
  try {
    const data = await prisma.article.findMany({
      where: {
        type,
        status: 'published',
        id: { not: id },
        ...(category ? { category } : {}),
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { seo: true },
    });
    return data;
  } catch (error) {
    console.error('getRelatedArticles failed:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 10. getArticleCategories
// ---------------------------------------------------------------------------

export async function getArticleCategories(type?: ArticleType) {
  try {
    const rows = await prisma.article.findMany({
      where: {
        status: 'published',
        ...(type ? { type } : {}),
      },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    // Filter out null/empty and return a flat string[]
    return rows
      .map((r) => r.category)
      .filter((c): c is string => !!c);
  } catch (error) {
    console.error('getArticleCategories failed:', error);
    return [];
  }
}
