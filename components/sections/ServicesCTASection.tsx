"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ─── Inline SVG Icons ─────────────────────────────────── */

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L11.5 7.5L17 9L11.5 10.5L10 16L8.5 10.5L3 9L8.5 7.5L10 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M16.5 2.5V5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 4H18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3.5 14.5V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.5 15H4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="#2251B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5L19 12L12 19" stroke="#2251B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FastTurnaroundIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 20C7 12.82 12.82 7 20 7C27.18 7 33 12.82 33 20C33 27.18 27.18 33 20 33" stroke="white" strokeWidth="3.33" strokeLinecap="round"/>
    <path d="M20 13V20L24 24" stroke="white" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 27L7 33" stroke="white" strokeWidth="3.33" strokeLinecap="round"/>
    <path d="M4 30H10" stroke="white" strokeWidth="3.33" strokeLinecap="round"/>
  </svg>
);

const ExpertTeamIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="13" r="6" stroke="white" strokeWidth="3.33"/>
    <path d="M7 33C7 27.477 13.268 23 20 23C26.732 23 33 27.477 33 33" stroke="white" strokeWidth="3.33" strokeLinecap="round"/>
    <path d="M33 5V12" stroke="white" strokeWidth="3.33" strokeLinecap="round"/>
    <path d="M30 8.33H36.67" stroke="white" strokeWidth="3.33" strokeLinecap="round"/>
  </svg>
);

const OngoingSupportIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.33 20C8.33 20 8.33 28.33 20 28.33C31.67 28.33 31.67 20 31.67 20" stroke="white" strokeWidth="3.33" strokeLinecap="round"/>
    <path d="M20 8.33V28.33" stroke="white" strokeWidth="3.33" strokeLinecap="round"/>
    <rect x="8.33" y="11.67" width="23.34" height="16.66" rx="2" stroke="white" strokeWidth="3.33"/>
  </svg>
);

/* ─── Feature Cards Data ───────────────────────────────── */

const FEATURES = [
  {
    icon: <FastTurnaroundIcon />,
    title: "Fast Turnaround",
    description: "Quick delivery without compromising quality",
  },
  {
    icon: <ExpertTeamIcon />,
    title: "Expert Team",
    description: "Seasoned professionals in every domain",
  },
  {
    icon: <OngoingSupportIcon />,
    title: "Ongoing Support",
    description: "24/7 support and maintenance",
  },
];

/* ─── Component ────────────────────────────────────────── */

interface ServicesCTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string | undefined;
}

export default function ServicesCTASection({
  title = "Let's Build Something Amazing Together",
  description = "Partner with us to create innovative digital solutions that drive growth, enhance user experience, and deliver measurable results.",
  primaryButtonText = "Start Your Project",
  secondaryButtonText = "Schedule a Call"
}: ServicesCTASectionProps = {}) {
  return (
    <section className="relative w-full bg-[#2251B5] overflow-x-hidden">
      {/* Decorative orange ellipse — top-right */}
      <div className="absolute top-[-57px] right-[-100px] lg:right-[-104px] w-[260px] h-[260px] bg-[#E96429] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-4 md:px-8 pt-20 pb-16 mb-32 gap-12 max-w-[896px] mx-auto">
        {/* ── Main content block ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 w-full text-center"
        >
          {/* Badge */}
          <div
            className="flex items-center gap-2 px-6 py-[10px] rounded-full border border-white/30 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <SparklesIcon />
            <span className="text-white font-bold text-sm font-['Inter',sans-serif] leading-[1.43]">
              Ready to Transform Your Business?
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-bold text-[48px] leading-[1.04] text-white font-['Plus_Jakarta_Sans',sans-serif] max-w-[507px]">
            {title}
          </h2>

          {/* Sub-description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[20px] leading-normal text-white/90 font-['Inter',sans-serif] max-w-[743px]"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            {/* Primary — white */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-10 py-[22px] h-[60px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] font-bold text-[18px] leading-[1.56] text-[#2251B5] font-['Inter',sans-serif]"
            >
              <span className="flex items-center gap-2">
                {primaryButtonText}
              </span>
              <ArrowRightIcon />
            </motion.button>

            {/* Secondary — ghost */}
            {secondaryButtonText && (
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-[37px] py-[21px] h-[60px] rounded-2xl border-2 border-white font-bold text-[18px] leading-[1.56] text-white font-['Inter',sans-serif] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {secondaryButtonText}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* ── Feature Cards row ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-stretch gap-6 w-full"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="flex flex-col items-center gap-3 flex-1 p-[25px] rounded-2xl border border-white/20 shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)] text-center"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              {feature.icon}
              <h3 className="font-bold text-[18px] leading-[1.56] text-white font-['Inter',sans-serif]">
                {feature.title}
              </h3>
              <p className="text-[14px] leading-[1.43] text-white/80 font-['Inter',sans-serif]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom contact strip ──
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-[6px] pb-10 text-center px-4"
      >
        <p className="text-[16px] leading-normal text-white/80 font-['Inter',sans-serif]">
          Have questions? We&apos;re here to help!
        </p>
        <Link
          href="mailto:hello@innovativenetwork.com"
          className="font-bold text-[16px] leading-normal text-white font-['Inter',sans-serif] hover:underline"
        >
          hello@innovativenetwork.com
        </Link>
      </motion.div> */}
    </section>
  );
}
