"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface InnerServiceCTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonSlug?: string;
  secondaryButtonText?: string;
  secondaryButtonSlug?: string;
}

export default function InnerServiceCTASection({
  title = "Let's Create Something Beautiful",
  description = "Transform your vision into stunning designs that users love",
  primaryButtonText = "Start Your Design Project",
  primaryButtonSlug = "/contact",
  secondaryButtonText = "Explore All Services",
  secondaryButtonSlug = "/services"
}: InnerServiceCTASectionProps) {
  return (
    <section className="relative w-full bg-[#2251B5] overflow-hidden py-24 px-4 md:px-8 mt-12 mb-0">
      {/* Decorative large orange ellipse — top-right */}
      <div className="absolute top-[-57px] right-[-100px] lg:right-[-104px] w-[260px] h-[260px] bg-[#E96429] rounded-full pointer-events-none" />
      
      {/* Decorative small orange ellipse — top-left */}
      <div className="absolute top-[52px] left-[69px] w-[40px] h-[40px] bg-[#E96429] rounded-full pointer-events-none hidden md:block" />

      {/* Decorative small orange ellipse — bottom-right */}
      <div className="absolute bottom-[40px] lg:bottom-[307px] right-[77px] lg:right-[117px] w-[40px] h-[40px] bg-[#E96429] rounded-full pointer-events-none hidden md:block" />

      <div className="relative z-10 flex flex-col items-center gap-10 max-w-[896px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 w-full"
        >
          {/* Headline */}
          <h2 className="font-bold text-[40px] md:text-[48px] leading-[1.25] text-white font-['Plus_Jakarta_Sans',sans-serif] tracking-[-0.02em]">
            {title}
          </h2>

          {/* Sub-description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[18px] md:text-[20px] leading-[1.4] text-white/90 font-['Inter',sans-serif] max-w-[560px]"
          >
            {description}
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          {primaryButtonText && (
            <Link href={primaryButtonSlug} className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-3 px-[25px] py-[16px] bg-white rounded-[12px] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)] font-semibold text-[16px] leading-[1.5] text-[#2251B5] font-['Inter',sans-serif]"
              >
                {primaryButtonText}
              </motion.button>
            </Link>
          )}

          {secondaryButtonText && (
            <Link href={secondaryButtonSlug} className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center border-2 border-white gap-2 px-[27px] py-[14px] rounded-[12px] font-semibold text-[16px] leading-[1.5] text-white font-['Inter',sans-serif]"
              >
                {secondaryButtonText}
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
