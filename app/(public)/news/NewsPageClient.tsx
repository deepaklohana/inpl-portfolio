"use client";

import { useMemo, useState } from "react";
import CategoryFilter from "@/components/ui/CategoryFilter";
import PageHero from "@/components/sections/PageHero";
import FeaturedArticleCard from "@/components/sections/FeaturedArticleCard";
import NewsGridSection from "@/components/sections/NewsGridSection";
import UpcomingEventsSection from "@/components/sections/UpcomingEventsSection";
import NewsletterCTASection from "@/components/sections/NewsletterCTASection";
import PartnerMarquee from "@/components/sections/PartnerMarquee";
import type { NewsArticle } from "@/components/sections/NewsGridSection";
import type { EventItem } from "@/components/sections/UpcomingEventsSection";

interface NewsPageClientProps {
  articles: any[];
}

function formatDate(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function mapToNewsArticle(article: any, index: number): NewsArticle {
  return {
    id: article.id,
    imageSrc: article.coverImage || "/images/news/news-card-cover.png",
    imageAlt: article.title,
    category: article.category || "News",
    categoryVariant: index % 2 === 0 ? "orange" : "blue",
    date: formatDate(article.publishedAt),
    readTime: article.readTime || "5 min read",
    title: article.title,
    description: article.excerpt || "",
    href: `/${article.type === "blog" ? "blog" : "news"}/${article.slug}`,
  };
}

function mapToEventItem(article: any): EventItem {
  return {
    id: article.id,
    imageSrc: article.coverImage || "/images/events/event-conference.png",
    imageAlt: article.title,
    type: article.category || "Event",
    statusLabel: article.isOnline ? "Online" : "In Person",
    title: article.title,
    date: formatDate(article.eventDate || article.publishedAt),
    location: article.location || "Online",
    attendees: "Available",
    href: `/events/${article.slug}`,
  };
}

export default function NewsPageClient({ articles = [] }: NewsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const {
    newsCategories,
    featuredArticle,
    mappedGridArticles,
    mappedEventArticles,
  } = useMemo(() => {
    const newsAndBlogs = articles.filter((a) => a.type === "news" || a.type === "blog");
    const eventArticles = articles.filter((a) => a.type === "event");

    const categoriesSet = new Set<string>();
    newsAndBlogs.forEach((a) => {
      if (a.category) categoriesSet.add(a.category);
    });
    const newsCategories = ["All", ...Array.from(categoriesSet)];

    const featuredArticle = newsAndBlogs.find((a) => a.featured) || newsAndBlogs[0];


    const filteredNews =
      activeCategory === "All"
        ? newsAndBlogs
        : newsAndBlogs.filter((a) => a.category === activeCategory);

    const mappedGridArticles = filteredNews.map((a, i) => mapToNewsArticle(a, i));
    const mappedEventArticles = eventArticles.map((a) => mapToEventItem(a));

    return {
      newsCategories,
      featuredArticle,
      mappedGridArticles,
      mappedEventArticles,
    };
  }, [articles, activeCategory]);

  return (
    <>
      <PageHero 
        badgeText="News & Events"
        title={
          <>
            <span className="block">Latest Updates</span>
            <span className="block text-[#2251B5]">& Industry Insights</span>
          </>
        }
        description="Stay informed with our latest news, product updates, and thought leadership content"
      >
        <PartnerMarquee />
      </PageHero>

      <CategoryFilter
        categories={newsCategories.length > 1 ? newsCategories : ["All", "Product Launch", "Partnership", "Events"]}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {featuredArticle && (
        <FeaturedArticleCard
          imageSrc={featuredArticle.coverImage || "/images/news/featured-article.png"}
          imageAlt={featuredArticle.title}
          category={featuredArticle.category || (featuredArticle.type === 'blog' ? 'Blog' : 'News')}
          date={formatDate(featuredArticle.publishedAt)}
          readTime={featuredArticle.readTime || "5 min read"}
          title={featuredArticle.title}
          description={featuredArticle.excerpt || ""}
          href={`/${featuredArticle.type === "blog" ? "blog" : "news"}/${featuredArticle.slug}`}
        />
      )}

      <NewsGridSection articles={mappedGridArticles} />

      {mappedEventArticles.length > 0 && (
        <UpcomingEventsSection events={mappedEventArticles} />
      )}

      <NewsletterCTASection />
    </>
  );
}
