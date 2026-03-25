import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 86400;

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!project || project.status !== 'published') return {};

  const seo = project.seo_metadata;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return buildMetadata({
    title: seo?.meta_title ?? project.title,
    description: seo?.meta_description ?? project.excerpt ?? undefined,
    image: seo?.og_image ?? project.cover_image ?? undefined,
    url: `${baseUrl}/projects/${project.slug}`,
    type: 'article',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    noIndex: seo?.no_index || false,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!project || project.status !== 'published') notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.excerpt || project.description,
    image: project.cover_image,
    url: `${baseUrl}/projects/${project.slug}`,
    datePublished: project.published_at,
    dateModified: project.updated_at,
    ...(project.client_name && {
      creator: { '@type': 'Organization', name: project.client_name },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {project.cover_image && (
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        {project.client_name && (
          <p className="text-gray-500 mb-2">Client: {project.client_name}</p>
        )}
        {project.description && (
          <div
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        )}
      </article>
    </>
  );
}
