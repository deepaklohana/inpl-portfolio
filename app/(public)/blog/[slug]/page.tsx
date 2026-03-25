import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!blog || blog.status !== 'published') return {};

  const seo = blog.seo_metadata;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return buildMetadata({
    title: seo?.meta_title ?? blog.title,
    description: seo?.meta_description ?? blog.excerpt ?? undefined,
    image: seo?.og_image ?? blog.cover_image ?? undefined,
    url: `${baseUrl}/blog/${blog.slug}`,
    type: 'article',
    publishedAt: blog.published_at?.toISOString(),
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    noIndex: seo?.no_index || false,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!blog || blog.status !== 'published') notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    image: blog.cover_image,
    author: { '@type': 'Person', name: blog.author_name },
    datePublished: blog.published_at,
    dateModified: blog.updated_at,
    url: `${baseUrl}/blog/${blog.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {blog.cover_image && (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        {blog.author_name && (
          <p className="text-gray-500 mb-2">By {blog.author_name}</p>
        )}
        {blog.published_at && (
          <time className="text-gray-400 text-sm">
            {new Date(blog.published_at).toLocaleDateString()}
          </time>
        )}
        {blog.content && (
          <div
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}
      </article>
    </>
  );
}
