import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import NewsletterCTASection from '@/components/sections/NewsletterCTASection';
import { getEventBySlug, getEvents } from '@/lib/actions/events';


export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const events = await getEvents({ status: 'published' });
    return events.map((e: { slug: string }) => ({ slug: e.slug }));
  } catch (error) {
    console.warn('generateStaticParams(events/[slug]) failed, returning empty params.', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let event: Awaited<ReturnType<typeof getEventBySlug>> = null;
  try {
    event = await getEventBySlug(slug);
  } catch (error) {
    console.warn(`generateMetadata(events/[slug]) failed for slug "${slug}".`, error);
    return {};
  }

  if (!event || event.status !== 'published') return {};

  const seo = event.seo;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return buildMetadata({
    title: seo?.meta_title ?? event.title,
    description: seo?.meta_description ?? event.excerpt ?? undefined,
    image: seo?.og_image ?? event.coverImage ?? undefined,
    url: `${baseUrl}/events/${event.slug}`,
    type: 'article',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined,
    noIndex: seo?.no_index || false,
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let event: Awaited<ReturnType<typeof getEventBySlug>> = null;
  try {
    event = await getEventBySlug(slug);
  } catch (error) {
    console.warn(`EventPage fetch failed for slug "${slug}".`, error);
  }

  if (!event || event.status !== 'published') notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.excerpt || event.content,
    image: event.coverImage,
    url: `${baseUrl}/events/${event.slug}`,
    startDate: event.eventDate,
    endDate: event.eventEndDate,
    ...(event.location && {
      location: {
        '@type': event.isOnline ? 'VirtualLocation' : 'Place',
        name: event.location,
        ...(event.locationUrl && { url: event.locationUrl }),
      },
    }),
    ...(event.registrationUrl && {
      offers: { '@type': 'Offer', url: event.registrationUrl },
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
        {event.coverImage && (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        {event.eventDate && (
          <p className="text-gray-500 mb-2">
            📅 {new Date(event.eventDate).toLocaleDateString()}
            {event.eventEndDate && ` – ${new Date(event.eventEndDate).toLocaleDateString()}`}
          </p>
        )}
        {event.location && (
          <p className="text-gray-500 mb-4">
            📍 {event.isOnline ? '🌐 Online' : ''} {event.location}
          </p>
        )}
        {event.content && (
          <div
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: event.content }}
          />
        )}
      </article>

      <NewsletterCTASection />
    </>
  );
}
