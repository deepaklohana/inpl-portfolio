import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import PartnerMarquee from "./PartnerMarquee";
import { ReactNode } from "react";
import HeroReveal from "@/components/animations/HeroReveal";

export interface ServicesHeroProps {
  badgeText?: string;
  badgeIcon?: ReactNode;
  title?: ReactNode;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showPartnerMarquee?: boolean;
}

export default function ServicesHero({
  badgeText = "Our Services",
  badgeIcon = <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
  title = (
    <>
      <span className="block">Elevate your</span>
      <span className="block text-[#2251B5]">Digital Presence</span>
    </>
  ),
  description = "From strategy to execution, we deliver end-to-end digital solutions that transform businesses and create lasting impact in the digital landscape.",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Scheduled Consultation",
  showPartnerMarquee = true,
}: ServicesHeroProps) {
  return (
    <section 
      className={`relative w-full overflow-hidden bg-white flex items-center justify-center pt-24 ${
        showPartnerMarquee ? "min-h-[740px] pb-16" : "pb-24 lg:pb-32"
      }`}
    >
      {/* Background Blurs — Desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:flex justify-center hidden">
        <div className="relative w-[1440px] h-full max-w-full">
          {/* Ellipse 1 — rgba(248,130,77,0.4) */}
          <div className="absolute w-[343px] h-[307px] left-[557px] top-[200px] bg-[rgba(248,130,77,0.4)] blur-[100px] rounded-full animate-pop-blob" />
          {/* Ellipse 3 — rgba(255,154,109,0.2) */}
          <div className="absolute w-[343px] h-[307px] left-[183px] top-[80px] bg-[rgba(255,154,109,0.2)] blur-[100px] rounded-full animate-pop-blob [animation-delay:2s]" />
          {/* Ellipse 2 — rgba(67,126,253,0.2) */}
          <div className="absolute w-[343px] h-[307px] left-[914px] top-[166px] bg-[rgba(67,126,253,0.2)] blur-[100px] rounded-full animate-pop-blob [animation-delay:4s]" />
          {/* Ellipse 4 — rgba(47,103,223,0.3) */}
          <div className="absolute w-[288px] h-[258px] left-[234px] top-[294px] bg-[rgba(47,103,223,0.3)] blur-[100px] rounded-full animate-pop-blob [animation-delay:1s]" />
          {/* Ellipse 5 — rgba(162,223,47,0.2) */}
          <div className="absolute w-[288px] h-[258px] left-[873px] top-[325px] bg-[rgba(162,223,47,0.2)] blur-[100px] rounded-full animate-pop-blob [animation-delay:3s]" />
        </div>
      </div>

      {/* Background Blurs — Mobile (Simplified) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:hidden flex justify-center">
        <div className="relative w-full h-full">
          <div className="absolute w-[200px] h-[200px] left-[10%] top-[20%] bg-[rgba(248,130,77,0.4)] blur-[80px] rounded-full animate-pop-blob" />
          <div className="absolute w-[200px] h-[200px] right-[10%] top-[50%] bg-[rgba(67,126,253,0.2)] blur-[80px] rounded-full animate-pop-blob [animation-delay:3s]" />
        </div>
      </div>

      {/* Content */}
      <HeroReveal className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center gap-6 mt-12 md:mt-0">
        <div className="flex items-center gap-2 bg-[#FFEDE5] border border-[rgba(233,100,41,0.3)] rounded-full px-4 py-2">
          {badgeIcon}
          <span className="text-sm font-medium text-[#101828] font-['Inter',sans-serif]">
            {badgeText}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[72px] font-bold text-[#101828] leading-[1.1] tracking-[-0.025em] font-['Inter',sans-serif] whitespace-pre-line w-full max-w-[896px]">
          {title}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-[24px] text-[#4A5565] leading-relaxed max-w-[990px] font-['Inter',sans-serif]">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-6">
          <Button variant="primary" icon={<ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />} className="w-full sm:w-auto">
            {primaryButtonText}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            {secondaryButtonText}
          </Button>
        </div>
      </HeroReveal>

      {showPartnerMarquee && <PartnerMarquee />}
    </section>
  );
}
