import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const events = await prisma.event.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!event || event.status !== 'published') return {};

  const seo = event.seo_metadata;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return buildMetadata({
    title: seo?.meta_title ?? event.title,
    description: seo?.meta_description ?? event.excerpt ?? undefined,
    image: seo?.og_image ?? event.cover_image ?? undefined,
    url: `${baseUrl}/events/${event.slug}`,
    type: 'article',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    noIndex: seo?.no_index || false,
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { seo_metadata: true },
  });

  if (!event || event.status !== 'published') notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.excerpt || event.description,
    image: event.cover_image,
    url: `${baseUrl}/events/${event.slug}`,
    startDate: event.event_date,
    endDate: event.end_date,
    ...(event.location && {
      location: {
        '@type': event.is_online ? 'VirtualLocation' : 'Place',
        name: event.location,
        ...(event.location_url && { url: event.location_url }),
      },
    }),
    ...(event.registration_url && {
      offers: { '@type': 'Offer', url: event.registration_url },
    }),
    organizer: { '@type': 'Organization', name: 'Company Name' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {event.cover_image && (
          <img
            src={event.cover_image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        {event.event_date && (
          <p className="text-gray-500 mb-2">
            📅 {new Date(event.event_date).toLocaleDateString()}
            {event.end_date && ` – ${new Date(event.end_date).toLocaleDateString()}`}
          </p>
        )}
        {event.location && (
          <p className="text-gray-500 mb-4">
            📍 {event.is_online ? '🌐 Online' : ''} {event.location}
          </p>
        )}
        {event.description && (
          <div
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}
      </article>
    </>
  );
}
