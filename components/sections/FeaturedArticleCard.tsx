import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface FeaturedArticleCardProps {
  imageSrc: string;
  imageAlt?: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  href?: string;
}

export default function FeaturedArticleCard({
  imageSrc,
  imageAlt = "Featured article",
  category,
  date,
  readTime,
  title,
  description,
  href = "#",
}: FeaturedArticleCardProps) {
  return (
    <section className="w-full bg-white py-[80px] px-6 md:px-[120px]">
      <div
        className="
          relative flex flex-col lg:flex-row w-full rounded-3xl overflow-hidden
          shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)]
        "
        style={{
          background: "linear-gradient(135deg, rgba(249,250,251,1) 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        {/* Left — cover image with "Featured" badge */}
        <div className="relative w-full lg:w-[584px] h-[280px] lg:h-[400px] shrink-0 bg-gray-100">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          {/* Featured badge */}
          <span
            className="
              absolute top-[19px] left-[24px] z-10
              inline-flex items-center justify-center px-4 py-2
              bg-[#E96429] rounded-full
              font-semibold text-[14px] leading-[1.428] text-white
            "
          >
            Featured
          </span>
        </div>

        {/* Right — content */}
        <div className="flex flex-col justify-center gap-4 px-8 py-[43px] flex-1">
          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Category pill */}
            <span
              className="
                inline-flex items-center justify-center px-3 py-1
                rounded-full bg-[#2251B5]/10
                font-semibold text-[14px] leading-[1.428] text-[#2251B5]
              "
            >
              {category}
            </span>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#6A7282]" />
              <span className="text-[#6A7282] text-[14px] leading-[1.428] font-normal">
                {date}
              </span>
            </div>

            {/* Read time */}
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#6A7282]" />
              <span className="text-[#6A7282] text-[14px] leading-[1.428] font-normal">
                {readTime}
              </span>
            </div>
          </div>

          {/* Title + description */}
          <div className="flex flex-col gap-2">
            <h2
              className="font-bold text-[24px] md:text-[36px] leading-[1.11] text-[#101828]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {title}
            </h2>
            <p
              className="text-[#4A5565] text-[16px] md:text-[18px] leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {description}
            </p>
          </div>

          {/* CTA */}
          <Link
            href={href}
            className="
              inline-flex items-center gap-[5px]
              font-semibold text-[16px] leading-normal text-[#E96429]
              hover:gap-2 transition-all duration-200 w-fit
            "
          >
            Read Full Story
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
