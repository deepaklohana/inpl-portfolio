import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, Link as LinkIcon, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import NewsletterCTASection from '@/components/sections/NewsletterCTASection';
import Button from '@/components/ui/Button';

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
      
      <main className="w-full bg-white pt-10 sm:pt-16 pb-0">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <div className="mb-10">
            <Link 
              href="/news" 
              className="inline-flex items-center text-[#4A5565] font-semibold text-sm hover:text-[#101828] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to News
            </Link>
          </div>

          {/* Header Metadata */}
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Category Pill */}
            <div className="bg-[#E96429] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              Product Launch
            </div>

            {/* Title */}
            <h1 
              className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#101828] leading-[1.2] mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Innovative Network Launches Revolutionary AI-Powered Analytics Platform
            </h1>

            {/* Subtitle / Excerpt */}
            <p className="text-[18px] text-[#4A5565] leading-relaxed max-w-3xl mb-8">
              Our latest product combines machine learning with intuitive design to deliver unprecedented business insights in real-time
            </p>

            {/* Meta Row: Date, Read Time, Views */}
            <div className="flex items-center justify-center gap-6 text-[#6A7282] text-sm font-medium mb-12 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>March 5, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>12.5K views</span>
              </div>
            </div>

            {/* Author Row & Share */}
            <div className="w-full border-y border-gray-200 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                  <div className="w-full h-full bg-[#E96429]/10 flex items-center justify-center text-[#E96429] font-bold text-lg">
                    A
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-[#101828] text-base">Ahmed</div>
                  <div className="text-[#6A7282] text-sm">Chief Product Officer</div>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#4A5565] hover:bg-gray-200 transition-colors">
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button className="h-10 px-4 rounded-full bg-[#E96429] text-white font-semibold text-sm flex items-center gap-2 hover:bg-[#d8551f] transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="w-full max-w-5xl mx-auto mt-12 mb-16 h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100 rounded-3xl overflow-hidden relative">
            {/* Fallback pattern / image */}
            <div className="absolute inset-0 bg-linear-to-tr from-[#2251B5]/20 to-[#E96429]/20" />
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              [Cover Image Placeholder]
            </div>
          </div>

          {/* Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1200px] mx-auto pb-20">
            {/* Left Sidebar: Table of Contents */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24">
                <h3 className="font-bold text-lg text-[#101828] mb-4">Table of Contents</h3>
                <nav className="flex flex-col gap-3">
                  <a href="#challenge" className="text-[#2251B5] font-medium text-sm border-l-2 border-[#2251B5] pl-4">The Challenge We Set Out to Solve</a>
                  <a href="#solution" className="text-[#6A7282] hover:text-[#101828] text-sm border-l-2 border-transparent pl-4 transition-colors">Introducing the Solution</a>
                  <a href="#features" className="text-[#6A7282] hover:text-[#101828] text-sm border-l-2 border-transparent pl-4 transition-colors">Key Features and Capabilities</a>
                  <a href="#impact" className="text-[#6A7282] hover:text-[#101828] text-sm border-l-2 border-transparent pl-4 transition-colors">Real-World Impact</a>
                  <a href="#whats-next" className="text-[#6A7282] hover:text-[#101828] text-sm border-l-2 border-transparent pl-4 transition-colors">What's Next</a>
                </nav>
              </div>
            </aside>

            {/* Right Content: Main Article */}
            <article className="lg:col-span-8 lg:col-start-5 prose prose-lg prose-blue max-w-none text-[#4A5565]">
              <p className="text-xl leading-relaxed text-[#101828] mb-10">
                Today marks a significant milestone in our journey to empower businesses with cutting-edge technology. We're thrilled to announce the launch of our revolutionary AI-Powered Analytics Platform, a game-changing solution designed to transform how organizations understand and leverage their data.
              </p>

              <h2 id="challenge" className="text-3xl font-bold text-[#101828] mt-12 mb-6">The Challenge We Set Out to Solve</h2>
              <p>
                In today's data-driven world, businesses are drowning in information but starving for insights. Traditional analytics tools are complex, time-consuming, and require specialized expertise. Teams spend weeks waiting for reports that are often outdated by the time they're delivered.
              </p>
              <p>
                We recognized that organizations needed a solution that could democratize data analytics—making powerful insights accessible to everyone, not just data scientists. The vision was clear: create a platform that combines the sophistication of enterprise-grade analytics with the simplicity of consumer applications.
              </p>

              {/* Blockquote */}
              <div className="my-10 p-8 rounded-2xl bg-[#E96429]/5 border-l-4 border-[#E96429]">
                <p className="text-xl font-bold text-[#E96429] mb-4 italic">
                  "Our mission was to put the power of AI-driven analytics in the hands of every business user, regardless of their technical background."
                </p>
                <footer className="text-sm font-semibold text-[#101828]">
                  — Ahmed, Chief Product Officer
                </footer>
              </div>

              <h2 id="solution" className="text-3xl font-bold text-[#101828] mt-12 mb-6">Introducing the Solution</h2>
              <p>
                Our new AI-Powered Analytics Platform represents the culmination of two years of research, development, and collaboration with industry leaders. Built on advanced machine learning algorithms, the platform automatically analyzes your data, identifies trends, and delivers actionable insights in real-time.
              </p>

              {/* Embedded Image Area */}
              <figure className="my-10 rounded-2xl overflow-hidden border border-gray-200">
                <div className="w-full h-[350px] bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400 font-medium">[Dashboard Interface Image]</span>
                </div>
                <figcaption className="text-center text-sm text-[#6A7282] py-4 bg-gray-50 border-t border-gray-200">
                  The intuitive dashboard provides real-time insights at a glance
                </figcaption>
              </figure>

              <h2 id="features" className="text-3xl font-bold text-[#101828] mt-12 mb-6">Key Features and Capabilities</h2>
              <p className="mb-8">
                The platform comes packed with innovative features designed to make analytics effortless:
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
                <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <h3 className="text-xl font-bold text-[#101828] mb-3">🤖 AI-Powered Insights</h3>
                  <p className="text-[#4A5565] text-sm">Our machine learning engine continuously analyzes your data, automatically detecting patterns, anomalies, and opportunities. No configuration required—just connect your data and let the AI do the work.</p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <h3 className="text-xl font-bold text-[#101828] mb-3">📊 Natural Language Queries</h3>
                  <p className="text-[#4A5565] text-sm">Ask questions in plain English and get instant answers. "What were our best-performing products last quarter?" transforms into detailed visualizations and insights in seconds.</p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <h3 className="text-xl font-bold text-[#101828] mb-3">⚡ Real-Time Processing</h3>
                  <p className="text-[#4A5565] text-sm">Stream processing capabilities ensure you're always working with the latest data. Make decisions based on what's happening right now, not what happened yesterday.</p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <h3 className="text-xl font-bold text-[#101828] mb-3">🎨 Interactive Visualizations</h3>
                  <p className="text-[#4A5565] text-sm">Beautiful, customizable charts and dashboards that update in real-time. Drag, drop, and configure to create the perfect view for your needs.</p>
                </div>
              </div>

              <h2 id="impact" className="text-3xl font-bold text-[#101828] mt-12 mb-6">Real-World Impact</h2>
              <p className="mb-8">
                Early adopters are already seeing remarkable results. During our beta program, companies reported:
              </p>

              {/* Stats Row */}
              <div className="flex flex-col sm:flex-row gap-4 my-8 not-prose">
                <div className="flex-1 bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <div className="text-4xl font-bold text-[#2251B5] mb-2">85%</div>
                  <div className="text-sm font-medium text-[#101828]">Faster Decision Making</div>
                </div>
                <div className="flex-1 bg-[#2251B5] rounded-2xl p-6 text-center text-white">
                  <div className="text-4xl font-bold mb-2">3x</div>
                  <div className="text-sm font-medium text-white/90">More Insights Generated</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <div className="text-4xl font-bold text-[#2251B5] mb-2">60%</div>
                  <div className="text-sm font-medium text-[#101828]">Cost Reduction</div>
                </div>
              </div>

              <h2 id="whats-next" className="text-3xl font-bold text-[#101828] mt-12 mb-6">What's Next</h2>
              <p>
                This launch is just the beginning. Our product roadmap includes exciting enhancements like predictive analytics, automated report generation, and deeper integrations with popular business tools. We're committed to continuous innovation based on customer feedback and emerging AI capabilities.
              </p>
              <p>
                We invite you to experience the future of analytics firsthand. Visit our platform page to start your free trial and join the thousands of businesses already transforming their data into actionable insights.
              </p>

              {/* Inline CTA Box */}
              <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-[#2251B5] text-center not-prose text-white overflow-hidden relative">
                {/* Decorative background ellipses */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E96429] opacity-30 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E96429] opacity-30 blur-2xl rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Analytics?</h3>
                  <p className="text-white/80 mb-8 max-w-xl mx-auto">
                    Start your free 30-day trial today. No credit card required.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="white" className="w-full sm:w-auto">Start Free Trial</Button>
                    <Button variant="glass" className="w-full sm:w-auto">Schedule Demo</Button>
                  </div>
                </div>
              </div>

              {/* Author Bio Box */}
              <div className="mt-16 p-8 rounded-3xl bg-[#101828] flex flex-col sm:flex-row items-center sm:items-start gap-6 not-prose text-white">
                <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden shrink-0">
                  <div className="w-full h-full bg-slate-600 flex items-center justify-center text-white font-bold text-2xl">
                    A
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-xl mb-1">Ahmed Khan</div>
                  <div className="text-white/60 text-sm mb-4">Chief Product Officer</div>
                  <p className="text-white/80 leading-relaxed text-sm max-w-2xl">
                    Ahmed leads our product innovation team with over 15 years of experience in enterprise software development and digital transformation.
                  </p>
                </div>
              </div>

            </article>
          </div>
        </div>
      </main>

      {/* Newsletter Section Footer */}
      <NewsletterCTASection />
    </>
  );
}
