import React, { ReactNode } from "react";
import HeroReveal from "@/components/animations/HeroReveal";

export interface PageHeroProps {
  badgeText: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}

export default function PageHero({ badgeText, title, description, children }: PageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white min-h-[650px] flex items-center justify-center pt-24 pb-16">
      {/* Background Blurs — Desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:flex justify-center hidden">
        <div className="relative w-[1440px] h-full max-w-full">
          {/* Ellipse 1 */}
          <div className="absolute w-[343px] h-[307px] left-[557px] top-[200px] bg-[rgba(248,130,77,0.4)] blur-[100px] rounded-full animate-pop-blob" />
          {/* Ellipse 3 */}
          <div className="absolute w-[343px] h-[307px] left-[183px] top-[80px] bg-[rgba(255,154,109,0.2)] blur-[100px] rounded-full animate-pop-blob [animation-delay:2s]" />
          {/* Ellipse 2 */}
          <div className="absolute w-[343px] h-[307px] left-[914px] top-[166px] bg-[rgba(67,126,253,0.2)] blur-[100px] rounded-full animate-pop-blob [animation-delay:4s]" />
          {/* Ellipse 4 */}
          <div className="absolute w-[288px] h-[258px] left-[234px] top-[294px] bg-[rgba(47,103,223,0.3)] blur-[100px] rounded-full animate-pop-blob [animation-delay:1s]" />
          {/* Ellipse 5 */}
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

      {/* Main Container */}
      <HeroReveal className="relative z-10 flex flex-col items-center max-w-[990px] w-full px-4 md:px-8 mx-auto text-center gap-8 md:gap-[24px] pb-[80px]">
        {/* Badge */}
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FFEDE5] border border-[rgba(233,100,41,0.3)] rounded-full">
          <div className="w-2 h-2 bg-[#2251B5] rounded-full" />
          <span className="font-medium text-[14px] leading-[1.42] text-[#101828] font-['Inter',sans-serif]">
            {badgeText}
          </span>
        </div>

        {/* Headlines */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl sm:text-5xl md:text-[72px] font-bold text-[#101828] leading-[1.1] tracking-[-0.025em] font-['Inter',sans-serif] w-full max-w-[885px]">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-[20px] leading-[1.95] text-[#4A5565] max-w-[800px] mt-2 font-['Inter',sans-serif]">
            {description}
          </p>
        </div>
      </HeroReveal>

      {children}
    </section>
  );
}
