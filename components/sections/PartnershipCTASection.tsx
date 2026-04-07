import React from "react";
import Link from "next/link";

export default function PartnershipCTASection() {
  return (
    <section className="relative w-full bg-[#2251B5] pb-[160px]">
      
      {/* 
        Layer 1: Clipped Decorators
        We use an absolute container with overflow-hidden so the top orbs get cleanly cut off
        at the section boundary (like Figma's mask), without cutting off the bottom bleeding orb.
      */}
      <div className="absolute inset-0 w-full overflow-hidden flex justify-center pointer-events-none">
        <div className="relative w-full max-w-[1440px] h-full">
          {/* Decorative Orbs mapped perfectly from Figma layout */}
          <div className="absolute top-[-58px] right-[-104px] w-[260px] h-[260px] bg-[#E96429] rounded-full" />
          <div className="absolute top-[52px] left-[69px] w-[40px] h-[40px] bg-[#E96429] rounded-full hidden sm:block" />
          <div className="absolute top-[307px] left-[1323px] w-[40px] h-[40px] bg-[#E96429] rounded-full hidden sm:block" />
        </div>
      </div>

      {/* Layer 2: Content & Bleeding Elements */}
      <div className="relative w-full max-w-[1440px] mx-auto pt-[109px]">
        
        {/* Ellipse 8: Shifted from Footer layer to CTA layer because Footer clipPath hides it natively. No overflow-hidden here! */}
        <div className="absolute bottom-[-200px] left-[-107px] w-[234px] h-[234px] bg-[#E96429] rounded-full hidden md:block pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[896px] mx-auto px-4">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[32px] md:text-[48px] leading-tight tracking-[-0.025em] text-white">
            Ready to Partner With Us?
          </h2>
          
          <div className="mt-4">
            <p className="font-['Inter',sans-serif] text-[16px] md:text-[20px] leading-[1.4] text-[rgba(255,255,255,0.9)] max-w-[865px] mx-auto">
              Join our global network of partners and unlock new opportunities for growth and innovation
            </p>
          </div>

          <div className="mt-8">
            <Link 
              href="/contact-us"
              className="inline-flex items-center justify-center bg-white text-[#2251B5] font-['Inter',sans-serif] font-semibold text-[16px] px-[25px] py-[16px] rounded-[12px] transition-transform hover:-translate-y-1"
              style={{ boxShadow: "0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
