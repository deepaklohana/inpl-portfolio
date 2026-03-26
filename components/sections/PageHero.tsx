import React, { ReactNode } from "react";

export interface PageHeroProps {
  badgeText: string;
  title: ReactNode;
  description: string;
}

export default function PageHero({ badgeText, title, description }: PageHeroProps) {
  return (
    <section className="relative w-full h-[650px] bg-white overflow-hidden flex flex-col items-center justify-center pt-[125px]">
      {/* Background glowing ellipses matching Figma styling */}
      <div className="absolute w-[343px] h-[307px] bg-[#F8824D]/40 blur-[300px] left-1/2 -translate-x-[163px] top-[200px]" />
      <div className="absolute w-[343px] h-[307px] bg-[#437EFD]/20 blur-[300px] left-1/2 translate-x-[194px] top-[166px]" />
      <div className="absolute w-[343px] h-[307px] bg-[#FF9A6D]/20 blur-[300px] left-1/2 -translate-x-[537px] top-[80px]" />
      <div className="absolute w-[288px] h-[258px] bg-[#2F67DF]/30 blur-[300px] left-1/2 -translate-x-[486px] top-[294px]" />
      <div className="absolute w-[288px] h-[258px] bg-[#A2DF2F]/20 blur-[300px] left-1/2 translate-x-[153px] top-[325px]" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-[990px] w-full px-6 mx-auto gap-[24px] text-center mb-[125px]">
        
        {/* Badge */}
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FFEDE5] border border-[#E96429]/30 rounded-[33554400px]">
          <div className="w-2 h-2 bg-[#2251B5] rounded-full" />
          <span className="font-medium text-[14px] leading-[1.42] text-[#101828] font-['Inter',sans-serif]">{badgeText}</span>
        </div>

        {/* Headlines */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-bold text-[40px] md:text-[72px] leading-[1.1] tracking-[-0.025em] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
            {title}
          </h1>
          <p className="text-[18px] md:text-[20px] leading-[1.95] text-[#4A5565] max-w-[800px] mt-2 font-['Inter',sans-serif]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
