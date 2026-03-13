"use client";

import SectionBadge from "../ui/SectionBadge";
import Container from "../ui/Container";
import { Check } from "lucide-react";

export default function ProductFeaturesSection() {
  const features = [
    "Cloud-based & On-premise options",
    "Mobile apps for iOS & Android",
    "Real-time data synchronization",
    "Customizable workflows",
    "Advanced security features",
    "24/7 technical support",
  ];

  return (
    <section className="relative w-full py-20 lg:py-24 overflow-hidden bg-white">
      {/* ── Background Blur Ellipses ─────────────────────────────────── */}
      {/* Top-left orange blur */}
      <div className="absolute left-[-83px] top-[369px] w-[343px] h-[307px] bg-[#E96429]/15 blur-[300px] rounded-full pointer-events-none" />
      {/* Top-right blue blur */}
      <div className="absolute right-[-143px] top-[-81px] w-[343px] h-[307px] bg-[#2251B5]/20 blur-[300px] rounded-full pointer-events-none" />

      <Container className="relative z-10 flex flex-col lg:flex-row gap-16 justify-between items-center lg:items-start">
        {/* ── Left Content (Text & Features) ───────────────────────── */}
        <div className="flex flex-col flex-1 max-w-[493px] w-full">
          <SectionBadge label="Our Products" variant="light" />

          <h2 className="mt-6 font-bold text-[38px] leading-[1.05] tracking-[-0.03em] text-[#2251B5] font-['Plus_Jakarta_Sans',sans-serif] whitespace-pre-line">
            {"Why Choose\nOur Products?"}
          </h2>

          <p className="mt-4 text-[20px] leading-[1.4] text-[#4A5565] font-['Inter',sans-serif]">
            Built with cutting-edge technology and years of industry expertise,
            our products deliver unmatched performance and reliability.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E96429] shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-[16px] leading-normal text-[#364153] font-['Inter',sans-serif]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Content (Stats Grid) ───────────────────────────── */}
        {/* On desktop, this block is aligned right. */}
        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto shrink-0 relative lg:mt-[32px] justify-center sm:items-stretch">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6 w-full sm:w-[284px]">
            {/* Uptime Guarantee */}
            <div className="flex flex-col justify-center px-8 h-[136px] rounded-3xl bg-linear-to-br from-[#E96429] to-[#E96429]/70 hover:-translate-y-1 transition-transform duration-300 shadow-[0px_10px_15px_-3px_rgba(233,100,41,0.2)]">
              <span className="font-bold text-[36px] leading-[1.11] text-white font-['Inter',sans-serif] tracking-tight">
                99.9%
              </span>
              <span className="text-[16px] leading-normal text-white/90 font-['Inter',sans-serif] mt-2">
                Uptime Guarantee
              </span>
            </div>

            {/* Customer Support */}
            <div className="flex flex-col justify-center px-8 h-[136px] rounded-3xl bg-linear-to-br from-[#2251B5] to-[#2251B5]/70 hover:-translate-y-1 transition-transform duration-300 shadow-[0px_10px_15px_-3px_rgba(34,81,181,0.2)]">
              <span className="font-bold text-[36px] leading-[1.11] text-white font-['Inter',sans-serif] tracking-tight">
                24/7
              </span>
              <span className="text-[16px] leading-normal text-white/90 font-['Inter',sans-serif] mt-2">
                Customer Support
              </span>
            </div>
          </div>

          {/* Column 2 (Staggered by pt-12 on sm screens) */}
          <div className="flex flex-col gap-6 w-full sm:w-[284px] sm:pt-12">
            {/* Certified Quality */}
            <div className="flex flex-col justify-center px-8 h-[136px] rounded-3xl bg-linear-to-br from-[#2251B5] to-[#2251B5]/70 hover:-translate-y-1 transition-transform duration-300 shadow-[0px_10px_15px_-3px_rgba(34,81,181,0.2)]">
              <span className="font-bold text-[36px] leading-[1.11] text-white font-['Inter',sans-serif] tracking-tight">
                ISO
              </span>
              <span className="text-[16px] leading-normal text-white/90 font-['Inter',sans-serif] mt-2">
                Certified Quality
              </span>
            </div>

            {/* Happy Clients */}
            <div className="flex flex-col justify-center px-8 h-[136px] rounded-3xl bg-linear-to-br from-[#E96429] to-[#E96429]/70 hover:-translate-y-1 transition-transform duration-300 shadow-[0px_10px_15px_-3px_rgba(233,100,41,0.2)]">
              <span className="font-bold text-[36px] leading-[1.11] text-white font-['Inter',sans-serif] tracking-tight">
                2000+
              </span>
              <span className="text-[16px] leading-normal text-white/90 font-['Inter',sans-serif] mt-2">
                Happy Clients
              </span>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
