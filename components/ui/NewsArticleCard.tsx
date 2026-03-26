import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface NewsArticleCardProps {
  imageSrc: string;
  imageAlt?: string;
  category: string;
  categoryVariant?: "orange" | "blue";
  date: string;
  readTime: string;
  title: string;
  description: string;
  href?: string;
}

export function NewsArticleCard({
  imageSrc,
  imageAlt = "Article image",
  category,
  categoryVariant = "orange",
  date,
  readTime,
  title,
  description,
  href = "#",
}: NewsArticleCardProps) {
  const isOrange = categoryVariant === "orange";

  return (
    <div className="flex flex-col w-full rounded-3xl bg-white border border-[#E0E0E0] overflow-hidden hover:-translate-y-1 transition-transform duration-300">
      {/* Cover image with category pill */}
      <div className="relative w-full h-[192px] bg-gray-100 shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
        {/* Category pill */}
        <span
          className={`absolute top-4 left-4 z-10 inline-flex items-center justify-center px-3 py-1 rounded-full font-semibold text-[12px] leading-[1.33] ${
            isOrange
              ? "bg-[#E96429] text-white"
              : "bg-[#2251B5] text-white"
          }`}
        >
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-[#6A7282] shrink-0" />
            <span className="text-[#6A7282] text-[12px] leading-[1.33] font-normal">
              {date}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-[#6A7282] shrink-0" />
            <span className="text-[#6A7282] text-[12px] leading-[1.33] font-normal">
              {readTime}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-[20px] leading-[1.4] text-[#101828]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-[#4A5565] text-[16px] leading-relaxed"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {description}
        </p>

        {/* Read More link */}
        <Link
          href={href}
          className={`inline-flex items-center gap-1 font-semibold text-[14px] leading-[1.428] mt-1 w-fit transition-gap duration-200 hover:gap-2 ${
            isOrange ? "text-[#E96429]" : "text-[#2251B5]"
          }`}
        >
          Read More
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
