import { ArrowRight, Calendar, type LucideIcon } from "lucide-react";
import Button from "./Button";

// ─── IconFeatureCard ─────────────────────────────────────────────────────────
// Figma: column, center-items, gap 12px, icon 48×48 bg rgba(34,81,181,0.1) rounded-[10px]
// Label: Inter 600, 18px, lh 1.5, color #101828, left-aligned (fill-width)

interface IconFeatureCardProps {
  icon: React.ElementType;
  label: string;
}

export function IconFeatureCard({ icon: Icon, label }: IconFeatureCardProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex justify-center items-center w-12 h-12 bg-[#2251B5]/10 rounded-[10px]">
        <Icon className="w-6 h-6 text-[#2251B5]" />
      </div>
      <span className="text-[#101828] font-semibold text-[18px] leading-normal font-['Inter',sans-serif] w-full text-center">
        {label}
      </span>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
// Figma: 384×290, padding 32px 24px, rounded-[14px]
// Highlighted: bg #FFF7F4, border 1px #E96429, shadow(0px 4px 6px -4px, 0px 10px 15px -3px)
// Normal: bg #FFFFFF, border 1px #E0E0E0 (from Section2 → fill_XMIZO8 = white, stroke_XB0Z27)
// Title: Plus Jakarta Sans 700 20px lh 1.4 — highlighted: #E96429, normal: #2251B5
// Desc: Inter 400 14px lh 1.625 color #3C3C3B
// Learn More btn: highlighted: #E96429, normal: #2251B5

interface ProductCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  highlight?: boolean;
  buttonLabel?: string;
}

export function ProductCard({
  title,
  description,
  icon: Icon,
  highlight = false,
  buttonLabel = "Learn More",
}: ProductCardProps) {
  return (
    <div
      className="group h-full flex flex-col p-6 md:p-8 rounded-[14px] transition-all duration-300 hover:-translate-y-1 bg-white border border-[#E0E0E0] hover:bg-[#FFF7F4] hover:border-[#E96429] hover:shadow-md"
    >
      <div className="flex flex-col h-full gap-6">
        {/* Icon */}
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-xl transition-colors duration-300 bg-[#2251B5]/10 text-[#2251B5] group-hover:bg-[#E96429]/10 group-hover:text-[#E96429]">
            <Icon size={24} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 grow">
          <h3 className="font-bold text-[20px] leading-[1.4] transition-colors duration-300 text-[#2251B5] group-hover:text-[#E96429] font-['Plus_Jakarta_Sans',sans-serif] line-clamp-2 min-h-[56px]">
            {title}
          </h3>
          <p className="text-[#3C3C3B] text-[14px] leading-relaxed font-['Inter',sans-serif] line-clamp-4 min-h-[88px]">
            {description}
          </p>
        </div>

        {/* Learn More */}
        <div className="mt-auto pt-4">
          <button className="flex items-center gap-1.5 font-medium text-[16px] leading-normal font-['Inter',sans-serif] transition-colors duration-300 text-[#2251B5] group-hover:text-[#E96429] group/btn">
            {buttonLabel}
            <ArrowRight
              size={16}
              className="transition-transform group-hover/btn:translate-x-1 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CTACard ──────────────────────────────────────────────────────────────────
// Figma: "primary" — bg #FFFFFF, shadow 0px 25px 50px -12px rgba(0,0,0,0.25), rounded-24px
//         padding 32px 32px 0px, icon box 56×56 gradient #E96429 → #E96429/70, rounded-16px
//         h3 Inter 700 24px color #101828; desc Inter 400 16px color #4A5565; link color #E96429
// Figma: "glass" — bg white/10 backdrop, border white/20, rounded-24px
//         icon box 56×56 bg gradient white → white/70, rounded-16px
//         h3 color #fff; desc color white/80; link color #fff

interface CTACardProps {
  title: string;
  description: string;
  linkLabel: string;
  svgPath: string;
  variant?: "primary" | "glass";
  href?: string;
}

export function CTACard({
  title,
  description,
  linkLabel,
  svgPath,
  variant = "primary",
  href,
}: CTACardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={`rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300 ${isPrimary
          ? "bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
          : "bg-white/10 backdrop-blur-md border border-white/20"
        }`}
    >
      <div className="flex items-start gap-6">
        {/* Icon box — 56×56 */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: isPrimary
              ? "linear-gradient(135deg, rgba(233,100,41,1) 0%, rgba(233,100,41,0.7) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 100%)",
          }}
        >
          <svg
            className={`w-6 h-6 ${isPrimary ? "text-white" : "text-[#2251B5]"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svgPath} />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className={`font-bold text-2xl mb-2 font-['Inter',sans-serif] ${isPrimary ? "text-[#101828]" : "text-white"
              }`}
          >
            {title}
          </h3>
          <p className={`mb-6 text-[16px] leading-normal font-['Inter',sans-serif] ${isPrimary ? "text-[#4A5565]" : "text-white/80"}`}>
            {description}
          </p>
          <Button
            href={href}
            variant="ghost-link"
            className={isPrimary ? "text-[#E96429]" : "text-white!"}
          >
            {linkLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── EventCard ─────────────────────────────────────────────────────────────────
// Figma: News & Events cards
// Width: 384px, Border radius: 14px, layout constraints
// Highlighted has shadow, normal has border #E0E0E0

interface EventCardProps {
  imageSrc: string;
  date: string;
  title: string;
  description: string;
  isHighlighted?: boolean;
}

export function EventCard({
  imageSrc,
  date,
  title,
  description,
  isHighlighted = false,
}: EventCardProps) {
  return (
    <div
      className={`flex flex-col rounded-[14px] bg-white transition-all duration-300 hover:-translate-y-1 ${isHighlighted
          ? "border border-[#F3F4F6] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
          : "border border-[#E0E0E0] hover:shadow-md"
        } overflow-hidden h-full`}
    >
      <div className="w-full h-[242px] relative bg-gray-100 shrink-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 p-6 grow">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#E96429]" />
          <span className="text-[#E96429] text-[14px] leading-[1.428] font-['Inter',sans-serif]">
            {date}
          </span>
        </div>
        <h3 className="font-bold text-[20px] leading-[1.4] text-[#2251B5] font-['Plus_Jakarta_Sans',sans-serif]">
          {title}
        </h3>
        <p className="text-[#3C3C3B] text-[14px] leading-relaxed font-['Inter',sans-serif]">
          {description}
        </p>
      </div>
    </div>
  );
}
