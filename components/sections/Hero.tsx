import { ArrowRight } from "lucide-react";
import HeroReveal from "@/components/animations/HeroReveal";
import PartnerMarquee from "./PartnerMarquee";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white min-h-[740px] flex items-center justify-center pt-24 pb-16">
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

      {/* Background Blurs — Mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:hidden flex justify-center">
        <div className="relative w-full h-full">
          <div className="absolute w-[200px] h-[200px] left-[10%] top-[20%] bg-[rgba(248,130,77,0.4)] blur-[80px] rounded-full animate-pop-blob" />
          <div className="absolute w-[200px] h-[200px] right-[10%] top-[50%] bg-[rgba(67,126,253,0.2)] blur-[80px] rounded-full animate-pop-blob [animation-delay:3s]" />
        </div>
      </div>

      {/* Dot Grid overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 mix-blend-multiply" />

      {/* Content */}
      <HeroReveal className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center gap-8 md:gap-12">
        {/* Badge — Figma: bg #FFEDE5, border rgba(233,100,41,0.3), padding 8px 16px */}
        <div className="flex items-center gap-2 bg-[#FFEDE5] border border-[rgba(233,100,41,0.3)] rounded-full px-4 py-2 mt-8 md:mt-0">
          <div className="w-2 h-2 rounded-full bg-[#2251B5]" />
          <span className="text-sm font-medium text-[#101828] font-['Inter',sans-serif]">
            Digital Excellence Since 2016
          </span>
        </div>

        {/* Headline — Figma: Inter 700, 72px, lh 1.1, color #101828 */}
        <h1 className="text-4xl sm:text-5xl md:text-[72px] font-bold text-[#101828] leading-[1.1] tracking-[-0.025em] font-['Inter',sans-serif] w-full max-w-[885px] mb-[-15px] md:mb-[-20px]">
          <span className="block">Strategic Partner for</span>
          <span className="block text-[#2251B5]">Digital Mastery</span>
        </h1>
        {/* Sub — Figma: Inter 400, 20px, lh 1.6, color #4A5565 */}
        <p className="text-base sm:text-lg md:text-[20px] text-[#4A5565] leading-[1.6] max-w-[745px] font-['Inter',sans-serif]">
          We empower businesses with integrated, master-class digital solutions that drive growth and innovation.
        </p>

        {/* Buttons — Figma: gap 16px between buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary: Plus Jakarta Sans 600 16px, h-14 (56px), px-8, py-[18px], bg #2251B5, rounded-xl */}
          <Button variant="primary" icon={<ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45" />} className="w-full sm:w-auto">
            Explore Solutions
          </Button>
          {/* Outline: Inter 500 16px, px-8, py-4, border-2 #D1D5DC, rounded-[10px], color #101828 */}
          <Button variant="outline" className="w-full sm:w-auto">
            Watch Demo
          </Button>
        </div>
      </HeroReveal>

      <PartnerMarquee />
    </section>
  );
}
