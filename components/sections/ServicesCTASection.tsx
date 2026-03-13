"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface ServicesCTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export default function ServicesCTASection({
  title = "Ready to Build Something Amazing",
  description = "Let's discuss your project and turn your vision into reality",
  primaryButtonText = "Schedule Consultation",
  secondaryButtonText = "Explore All Services",
}: ServicesCTASectionProps = {}) {
  return (
    <section className="relative w-full py-24 lg:pt-28 lg:pb-[160px] bg-[#2251B5] overflow-hidden">
      {/* Decorative Ellipses */}
      
      {/* Top Right Large */}
      <div 
        className="absolute top-[-58px] right-[-100px] lg:right-[156px] w-[260px] h-[260px] bg-[#E96429] rounded-full" 
      />
      
      {/* Bottom Left Large (Matches Ellipse 8 from footer overlapping into blue) */}
      <div 
        className="absolute bottom-0 left-[-107px] w-[234px] h-[234px] bg-[#E96429] rounded-full" 
      />

      {/* Top Left Small */}
      <div 
        className="absolute top-[52px] left-[69px] w-[40px] h-[40px] bg-[#E96429] rounded-full hidden md:block" 
      />

      {/* Bottom Right Small */}
      <div 
        className="absolute bottom-[40px] right-[117px] w-[40px] h-[40px] bg-[#E96429] rounded-full hidden md:block" 
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8">
        <div className="flex flex-col items-center max-w-[896px] w-full gap-8">
          
          <div className="flex flex-col items-center gap-4 w-full">
            <h2 className="font-bold text-4xl md:text-[48px] text-white leading-tight tracking-[-0.025em] font-['Plus_Jakarta_Sans',sans-serif]">
              {title}
            </h2>
            
            <p className="text-[20px] text-white/90 leading-[1.4] font-['Inter',sans-serif] max-w-[539px]">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Button 
              variant="white"
              className="px-[25px] py-[16px] text-[16px] font-semibold text-[#2251B5] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)] rounded-xl"
            >
              {primaryButtonText}
            </Button>
            {secondaryButtonText && (
              <Button 
                variant="outline"
                className="px-[27px] py-[16px] text-[16px] font-semibold text-white border-white border-2 hover:bg-white/10 rounded-xl"
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}

