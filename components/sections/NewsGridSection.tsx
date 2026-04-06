import { NewsArticleCard } from "@/components/ui/NewsArticleCard";
import Button from "@/components/ui/Button";
import { Newspaper } from "lucide-react";

type ArticleVariant = "orange" | "blue";

export interface NewsArticle {
  id: string;
  imageSrc: string;
  imageAlt?: string;
  category: string;
  categoryVariant?: ArticleVariant;
  date: string;
  readTime: string;
  title: string;
  description: string;
  href?: string;
}

interface NewsGridSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  articles?: NewsArticle[];
}

export default function NewsGridSection({
  badge = "Latest",
  title = "Latest News",
  subtitle = "Recent updates and announcements",
  articles = [],
}: NewsGridSectionProps) {
  return (
    <section className="w-full py-[80px] px-6 md:px-[120px] bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">

        {/* Section Header — 2-column: badge+title left, subtitle right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-3">
            {/* Orange badge pill */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#E96429]/10 w-fit">
              <span className="font-semibold text-[14px] leading-[1.428] text-[#E96429]">
                {badge}
              </span>
            </div>
            {/* Title */}
            <h2
              className="font-bold text-[38px] leading-[1.05] text-[#2251B5]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {title}
            </h2>
          </div>
          {/* Right — subtitle */}
          <p
            className="text-[#4A5565] text-[20px] leading-[1.4] md:max-w-[600px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {subtitle}
          </p>
        </div>

        {articles.length > 0 ? (
          <>
            {/* 3×2 card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <NewsArticleCard
                  key={article.id}
                  imageSrc={article.imageSrc}
                  imageAlt={article.imageAlt}
                  category={article.category}
                  categoryVariant={article.categoryVariant}
                  date={article.date}
                  readTime={article.readTime}
                  title={article.title}
                  description={article.description}
                  href={article.href}
                />
              ))}
            </div>

            {/* Load more CTA */}
            <div className="flex justify-center">
              <Button variant="outline">Load More Articles</Button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2251B5]/8 flex items-center justify-center">
              <Newspaper className="w-8 h-8 text-[#2251B5]/40" />
            </div>
            <p
              className="text-[#4A5565] text-[18px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              No articles published yet. Check back soon!
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
