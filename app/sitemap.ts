import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const fetchRoutes = async (
    model: 'blog' | 'project' | 'service' | 'event' | 'news',
    urlPath: string,
    priority: number
  ) => {
    const items = await (prisma[model] as any).findMany({
      where: { status: 'published' },
      select: { slug: true, updated_at: true, created_at: true },
    });

    return items.map((item: any) => ({
      url: `${baseUrl}${urlPath}/${item.slug}`,
      lastModified: item.updated_at || item.created_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority,
    }));
  };

  const [blogs, projects, services, events, news] = await Promise.all([
    fetchRoutes('blog', '/blog', 0.8),
    fetchRoutes('project', '/projects', 0.7),
    fetchRoutes('service', '/services', 0.7),
    fetchRoutes('event', '/events', 0.7),
    fetchRoutes('news', '/news', 0.7),
  ]);

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

  return [...staticRoutes, ...blogs, ...projects, ...services, ...events, ...news];
}
