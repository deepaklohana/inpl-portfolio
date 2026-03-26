"use client";

import { useState } from "react";
import CategoryFilter from "@/components/ui/CategoryFilter";
import PageHero from "@/components/sections/PageHero";
import FeaturedArticleCard from "@/components/sections/FeaturedArticleCard";
import NewsGridSection from "@/components/sections/NewsGridSection";
import UpcomingEventsSection from "@/components/sections/UpcomingEventsSection";
import NewsletterCTASection from "@/components/sections/NewsletterCTASection";

const NEWS_CATEGORIES = [
  "All",
  "Product Launch",
  "Partnership",
  "Awards",
  "Case Study",
  "Events",
  "Insights",
  "Company News",
];

export default function NewsPageClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      {/* Hero — Figma 297:152 */}
      <PageHero 
        badgeText="News & Events"
        title={<>Latest Updates<br className="hidden md:block" />& Industry Insights</>}
        description="Stay informed with our latest news, product updates, and thought leadership content"
      />

      {/* Category Filter Bar — Figma 297:424 */}
      <CategoryFilter
        categories={NEWS_CATEGORIES}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Featured Article — Figma 297:190 */}
      <FeaturedArticleCard
        imageSrc="/images/news/featured-article.png"
        imageAlt="AI-Powered Analytics Platform"
        category="Product Launch"
        date="March 5, 2026"
        readTime="5 min read"
        title="Innovative Network Launches Revolutionary AI-Powered Analytics Platform"
        description="Our latest product combines machine learning with intuitive design to deliver unprecedented business insights in real-time."
        href="/news/ai-powered-analytics-platform"
      />

      {/* News Grid — Figma 297:224 */}
      <NewsGridSection />

      {/* Upcoming Events — Figma 297:442 */}
      <UpcomingEventsSection />

      {/* Newsletter CTA — Figma 297:623 */}
      <NewsletterCTASection />
    </>
  );
}

