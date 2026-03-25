import { Metadata } from 'next';

interface SEOParams {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function buildMetadata(params: SEOParams): Metadata {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedAt,
    keywords,
    noIndex = false,
  } = params;

  const siteName = 'Company Name';
  const fullTitle = `${title} | ${siteName}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: fullTitle,
      description,
      siteName,
      type,
      url,
      ...(image && {
        images: [{ url: image }],
      }),
      ...(publishedAt && {
        publishedTime: publishedAt,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(image && {
        images: [image],
      }),
    },
  };

  return metadata;
}
