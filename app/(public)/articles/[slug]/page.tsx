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
  const article = await getArticleBySlug(slug);

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

          {/* Back Button */}
          <div className="mb-10">
            <Link
              href="/news"
              className="inline-flex items-center text-[#4A5565] font-semibold text-sm hover:text-[#101828] transition-colors gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {typeLabel}
            </Link>
          </div>

          {/* Article Header — centered */}
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-12">
            {/* Category Pill */}
            <span className={`${typeBg} text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6`}>
              {article.category ?? typeLabel}
            </span>

            {/* Title */}
            <h1
              className="text-[30px] sm:text-[38px] md:text-[46px] font-bold text-[#101828] leading-[1.2] mb-6 font-['Plus_Jakarta_Sans',sans-serif]"
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

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-[#4A5565] leading-relaxed max-w-3xl mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Meta Row */}
            <div className="flex items-center justify-center gap-5 text-[#6A7282] text-sm font-medium mb-10 flex-wrap">
              {article.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 shrink-0" />
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
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{article.readTime}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 shrink-0" />
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Author Row + Share */}
            <div className="w-full border-y border-gray-200 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                {article.authorImage ? (
                  <Image
                    src={article.authorImage}
                    alt={article.authorName ?? 'Author'}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#E96429]/10 flex items-center justify-center text-[#E96429] font-bold text-lg shrink-0 border border-[#E96429]/20">
                    {authorInitial}
                  </div>
                )}
                <div className="text-left">
                  <div className="font-bold text-[#101828] text-base leading-tight">
                    {article.authorName ?? 'Innovative Network'}
                  </div>
                  {article.authorTitle && (
                    <div className="text-[#6A7282] text-sm">{article.authorTitle}</div>
                  )}
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3">
                <button
                  onClick={undefined}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#4A5565] hover:bg-gray-200 transition-colors"
                  title="Copy link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 rounded-full bg-[#E96429] text-white font-semibold text-sm flex items-center gap-2 hover:bg-[#d8551f] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
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
                <div className="mt-12 p-8 rounded-3xl bg-[#101828] flex flex-col sm:flex-row items-center sm:items-start gap-6 text-white">
                  {article.authorImage ? (
                    <Image
                      src={article.authorImage}
                      alt={article.authorName ?? 'Author'}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover shrink-0 ring-4 ring-white/10"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-2xl shrink-0 ring-4 ring-white/10">
                      {authorInitial}
                    </div>
                  )}
                  <div className="text-center sm:text-left flex-1">
                    <div className="font-bold text-xl mb-1">{article.authorName}</div>
                    {article.authorTitle && (
                      <div className="text-white/60 text-sm mb-3">{article.authorTitle}</div>
                    )}
                    {article.authorBio && (
                      <p className="text-white/80 leading-relaxed text-sm max-w-2xl mb-4">
                        {article.authorBio}
                      </p>
                    )}
                    {/* Social Links */}
                    {Array.isArray((article as any).authorSocials) && (article as any).authorSocials.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                        {((article as any).authorSocials as { platform: string; url: string }[]).map((social, i) => (
                          <a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium transition-colors border border-white/10"
                          >
                            <ExternalLink size={11} />
                            {social.platform}
                          </a>
                        ))}
                      </div>
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
