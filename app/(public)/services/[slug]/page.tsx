import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 86400;

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!service || service.status !== 'published') return {};

  const seo = service.seo_metadata;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return buildMetadata({
    title: seo?.meta_title ?? service.title,
    description: seo?.meta_description ?? service.excerpt ?? undefined,
    image: seo?.og_image ?? service.cover_image ?? undefined,
    url: `${baseUrl}/services/${service.slug}`,
    type: 'website',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    noIndex: seo?.no_index || false,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!service || service.status !== 'published') notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.excerpt || service.description,
    image: service.cover_image,
    url: `${baseUrl}/services/${service.slug}`,
    provider: { '@type': 'Organization', name: 'Company Name' },
    ...(service.price_range && {
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: service.price_range,
        },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {service.cover_image && (
          <img
            src={service.cover_image}
            alt={service.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
        {service.excerpt && (
          <p className="text-gray-600 text-lg mb-6">{service.excerpt}</p>
        )}
        {service.description && (
          <div
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        )}
      </article>
    </>
  );
}
