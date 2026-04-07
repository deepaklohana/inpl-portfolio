import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, Share2, ArrowLeft, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { getArticleBySlug, getRelatedArticles, getArticles } from '@/lib/actions/articles';
import { generateTOC, addHeadingIds } from '@/lib/utils/generateTOC';
import { TableOfContents } from '@/components/article/TableOfContents';
import { HTMLContent } from '@/components/article/HTMLContent';
import NewsletterCTASection from '@/components/sections/NewsletterCTASection';

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  news: 'News',
  blog: 'Blog',
  event: 'Event',
};

const TYPE_COLOR: Record<string, string> = {
  news: 'bg-[#2251B5]',
  blog: 'bg-[#7C3AED]',
  event: 'bg-[#059669]',
};

export async function generateStaticParams() {
  const articles = await getArticles({ status: 'published' });
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const seo = article.seo;

  return {
    title: seo?.meta_title ?? article.title.replace(/\*/g, ''),
    description: seo?.meta_description ?? article.excerpt ?? undefined,
    openGraph: {
      title: seo?.meta_title ?? article.title.replace(/\*/g, ''),
      description: seo?.meta_description ?? article.excerpt ?? undefined,
      images: seo?.og_image ?? article.coverImage ? [seo?.og_image ?? article.coverImage!] : [],
      url: `${baseUrl}/articles/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
    },
    robots: seo?.no_index ? { index: false, follow: false } : undefined,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, true);

  if (!article) notFound();

  // Add IDs to headings and generate TOC
  const contentWithIds = addHeadingIds(article.content ?? '');
  const tocItems = generateTOC(contentWithIds);

  const related = await getRelatedArticles(article.id, article.type as 'news' | 'blog' | 'event', article.category ?? undefined, 3);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleUrl = `${baseUrl}/articles/${article.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': article.type === 'news' ? 'NewsArticle' : 'Article',
    headline: article.title,
    image: article.coverImage,
    author: { '@type': 'Person', name: article.authorName || 'Innovative Network' },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url: articleUrl,
  };

  const typeLabel = TYPE_LABEL[article.type] ?? article.type;
  const typeBg = TYPE_COLOR[article.type] ?? 'bg-[#2251B5]';

  const authorInitial = article.authorName ? article.authorName.charAt(0).toUpperCase() : 'A';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="w-full bg-white pt-10 sm:pt-16 pb-0">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section Container */}
          <div className="max-w-[864px] mx-auto mb-16 flex flex-col gap-8">
            
            {/* Back Button */}
            <div>
              <Link
                href="/news"
                className="inline-flex items-center text-[#4A5565] font-medium text-base hover:text-[#101828] transition-colors gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to {typeLabel}
              </Link>
            </div>

            <div className="flex flex-col gap-6 w-full">
              {/* Category + Meta Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap">
                {/* Category Pill */}
                <span className={`${typeBg} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                  {article.category ?? typeLabel}
                </span>

                {/* Meta Items */}
                <div className="flex items-center gap-4 text-[#4A5565] text-sm font-medium flex-wrap">
                  {article.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {article.readTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{article.views?.toLocaleString() ?? 0} views</span>
                  </div>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="flex flex-col gap-4">
                <h1
                  className="text-[36px] sm:text-[48px] md:text-[60px] font-bold text-[#101828] leading-tight font-['Plus_Jakarta_Sans',sans-serif] text-left tracking-tight"
                >
                  {(() => {
                    const parts = article.title.split('*');
                    if (parts.length >= 3) {
                      return (
                        <>
                          {parts[0]}
                          <span className="text-[#2251B5]">{parts[1]}</span>
                          {parts.slice(2).join('*')}
                        </>
                      );
                    }
                    return article.title;
                  })()}
                </h1>

                {article.excerpt && (
                  <p className="text-[20px] sm:text-[24px] text-[#4A5565] leading-relaxed text-left font-['Inter',sans-serif]">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>

            {/* Author Row + Share */}
            <div className="w-full border-b border-[#E5E7EB] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
              {/* Author */}
              <div className="flex items-center gap-4">
                {article.authorImage ? (
                  <Image
                    src={article.authorImage}
                    alt={article.authorName ?? 'Author'}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover shrink-0 ring-4 ring-[#F3F4F6]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#E96429]/10 flex items-center justify-center text-[#E96429] font-bold text-xl shrink-0 ring-4 ring-[#F3F4F6]">
                    {authorInitial}
                  </div>
                )}
                <div className="text-left">
                  <div className="font-bold text-[#101828] text-lg leading-tight mb-1 font-['Inter',sans-serif]">
                    {article.authorName ?? 'Innovative Network'}
                  </div>
                  {article.authorTitle && (
                    <div className="text-[#4A5565] text-sm font-['Inter',sans-serif]">
                      {article.authorTitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3">
                <button
                  onClick={undefined}
                  className="w-11 h-11 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#4A5565] hover:bg-gray-200 transition-colors"
                  title="Copy link"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded-full bg-[#E96429] text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#d8551f] transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </a>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="w-full max-w-5xl mx-auto mb-16 rounded-3xl overflow-hidden relative aspect-16/7">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content Layout — TOC + Article */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1200px] mx-auto pb-20">

            {/* Left Sidebar — TOC (desktop only) */}
            {tocItems.length > 0 && (
              <aside className="lg:col-span-3 hidden lg:block">
                <TableOfContents items={tocItems} />
              </aside>
            )}

            {/* Main Article Content */}
            <article className={`${tocItems.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'}`}>

              {/* Mobile TOC accordion */}
              {tocItems.length > 0 && (
                <div className="lg:hidden mb-8 bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <TableOfContents items={tocItems} />
                </div>
              )}

              {/* Rich HTML Content */}
              {contentWithIds ? (
                <HTMLContent content={contentWithIds} />
              ) : (
                <p className="text-[#6A7282] italic">No content available.</p>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#2251B5]/8 text-[#2251B5] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#2251B5]/15"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Bio Card */}
              {(article.authorName || article.authorBio) && (
                <div className="mt-12 p-8 rounded-[24px] bg-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-gray-100">
                  {article.authorImage ? (
                    <Image
                      src={article.authorImage}
                      alt={article.authorName ?? 'Author'}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover shrink-0 ring-4 ring-[#E96429]/20"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#E96429]/10 flex items-center justify-center text-[#E96429] font-bold text-3xl shrink-0 ring-4 ring-[#E96429]/20">
                      {authorInitial}
                    </div>
                  )}
                  <div className="text-center sm:text-left flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <h3 className="font-bold text-[#101828] text-2xl leading-snug">{article.authorName}</h3>
                        {article.authorTitle && (
                          <p className="font-semibold text-[#E96429] text-base mt-1">{article.authorTitle}</p>
                        )}
                      </div>
                      
                      {/* Social Links */}
                      {Array.isArray((article as any).authorSocials) && (article as any).authorSocials.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                          {((article as any).authorSocials as { platform: string; url: string }[]).map((social, i) => (
                            <a
                              key={i}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-full bg-[#F3F4F6] text-[#4A5565] flex items-center justify-center hover:bg-gray-200 transition-colors"
                              title={social.platform}
                            >
                              <ExternalLink size={16} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    {article.authorBio && (
                      <p className="text-[#364153] leading-relaxed text-base mt-4 max-w-3xl">
                        {article.authorBio}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Related Articles */}
              {related.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-2xl font-bold text-[#101828] mb-8 font-['Plus_Jakarta_Sans',sans-serif]">
                    Related {typeLabel}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/articles/${rel.slug}`}
                        className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                      >
                        {rel.coverImage && (
                          <div className="relative w-full h-40 overflow-hidden">
                            <Image src={rel.coverImage} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        <div className="p-5">
                          {rel.category && (
                            <span className={`${typeBg} text-white px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 inline-block`}>
                              {rel.category}
                            </span>
                          )}
                          <h3 className="text-base font-bold text-[#101828] line-clamp-2 group-hover:text-[#2251B5] transition-colors">
                            {rel.title}
                          </h3>
                          {rel.publishedAt && (
                            <p className="text-xs text-[#6A7282] mt-2">
                              {new Date(rel.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </main>

      <NewsletterCTASection />
    </>
  );
}
