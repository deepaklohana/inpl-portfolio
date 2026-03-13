import React from "react";

export default function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white min-h-[583px] flex items-center justify-center pt-24 pb-16">
      {/* Background Blurs — Desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:flex justify-center hidden">
        <div className="relative w-[1440px] h-full max-w-full">
          {/* Ellipse 1 */}
          <div className="absolute w-[343px] h-[307px] left-[557px] top-[200px] bg-[rgba(248,130,77,0.4)] blur-[150px] rounded-full" />
          {/* Ellipse 3 */}
          <div className="absolute w-[343px] h-[307px] left-[183px] top-[80px] bg-[rgba(255,154,109,0.2)] blur-[150px] rounded-full" />
          {/* Ellipse 2 */}
          <div className="absolute w-[343px] h-[307px] left-[914px] top-[166px] bg-[rgba(67,126,253,0.2)] blur-[150px] rounded-full" />
          {/* Ellipse 4 */}
          <div className="absolute w-[288px] h-[258px] left-[234px] top-[294px] bg-[rgba(47,103,223,0.3)] blur-[150px] rounded-full" />
          {/* Ellipse 5 */}
          <div className="absolute w-[288px] h-[258px] left-[873px] top-[325px] bg-[rgba(162,223,47,0.2)] blur-[150px] rounded-full" />
        </div>
      </div>

      {/* Background Blurs — Mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:hidden flex justify-center">
        <div className="relative w-full h-full">
          <div className="absolute w-[200px] h-[200px] left-[10%] top-[20%] bg-[rgba(248,130,77,0.4)] blur-[80px] rounded-full" />
          <div className="absolute w-[200px] h-[200px] right-[10%] top-[50%] bg-[rgba(67,126,253,0.2)] blur-[80px] rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="flex items-center gap-2 bg-[#FFEDE5] border border-[rgba(233,100,41,0.3)] rounded-full px-4 py-2 mt-8 md:mt-0">
          <div className="w-2 h-2 rounded-full bg-[#2251B5]" />
          <span className="text-sm font-medium text-[#101828] font-['Inter',sans-serif]">
            About Us
          </span>
        </div>

        {/* Headline */}
        <div className="flex flex-col items-center gap-6 w-full max-w-[885px]">
          <h1 className="text-4xl sm:text-5xl md:text-[72px] font-bold text-[#101828] leading-[1.1] tracking-[-0.025em] font-['Inter',sans-serif]">
            Pioneering Digital Excellence Since 2016
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-[20px] text-[#4A5565] leading-[1.6] max-w-[990px] font-['Inter',sans-serif]">
            We are your strategic partner in navigating the digital landscape with innovative solutions that empower businesses to thrive in an ever-evolving world.
          </p>
        </div>
      </div>
    </section>
  );
}
