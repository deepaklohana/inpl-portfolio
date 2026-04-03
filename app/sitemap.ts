import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const servicesData = await prisma.service.findMany({
    where: { status: 'published' },
    select: { slug: true, updated_at: true, created_at: true },
  });

  const services = servicesData.map((item: any) => ({
    url: `${baseUrl}/services/${item.slug}`,
    lastModified: item.updated_at || item.created_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const articlesData = await prisma.article.findMany({
    where: { status: 'published' },
    select: { slug: true, type: true, updatedAt: true, createdAt: true },
  });

  const getPrefix = (type: string) => {
    if (type === 'blog') return '/blog';
    if (type === 'news') return '/news';
    return '/events';
  };

  const articles = articlesData.map((item: any) => ({
    url: `${baseUrl}${getPrefix(item.type)}/${item.slug}`,
    lastModified: item.updatedAt || item.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: item.type === 'blog' ? 0.8 : 0.7,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  return [...staticRoutes, ...services, ...articles];
}
