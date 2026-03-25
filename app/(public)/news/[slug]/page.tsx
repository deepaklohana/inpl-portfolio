import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const news = await prisma.news.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await prisma.news.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!news || news.status !== 'published') return {};

  const seo = news.seo_metadata;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return buildMetadata({
    title: seo?.meta_title ?? news.title,
    description: seo?.meta_description ?? news.excerpt ?? undefined,
    image: seo?.og_image ?? news.cover_image ?? undefined,
    url: `${baseUrl}/news/${news.slug}`,
    type: 'article',
    publishedAt: news.published_at?.toISOString(),
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    noIndex: seo?.no_index || false,
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!news || news.status !== 'published') notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    image: news.cover_image,
    author: { '@type': 'Person', name: news.author_name || 'Company Name' },
    datePublished: news.published_at,
    dateModified: news.updated_at,
    url: `${baseUrl}/news/${news.slug}`,
    ...(news.source_url && { isBasedOn: news.source_url }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {news.cover_image && (
          <img
            src={news.cover_image}
            alt={news.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
        {news.author_name && (
          <p className="text-gray-500 mb-2">By {news.author_name}</p>
        )}
        {news.published_at && (
          <time className="text-gray-400 text-sm">
            {new Date(news.published_at).toLocaleDateString()}
          </time>
        )}
        {news.content && (
          <div
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        )}
      </article>
    </>
  );
}
