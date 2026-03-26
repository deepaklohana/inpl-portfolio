"use client";

import { useState } from "react";
import { Star, Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionBadge from "@/components/ui/SectionBadge";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";
import CountUp from "@/components/animations/CountUp";

// ─── Data ────────────────────────────────────────────────────────────────────

export interface TestimonialProp {
  id?: string;
  name: string;
  role: string;
  company: string;
  companyType?: string;
  project: string;
  quote: string;
  avatar: string;
  rating?: number;
}



const stats = [
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
  { value: 1000, suffix: "+", label: "Projects Completed" },
  { value: 50, suffix: "+", label: "Industry Awards" },
];

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className="text-[#E96429] fill-[#E96429]"
        />
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TestimonialsSection({ testimonials }: { testimonials?: TestimonialProp[] }) {
  const displayData = testimonials && testimonials.length > 0 ? testimonials : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = displayData[activeIndex] || displayData[0];

  if (!active) {
    return null;
  }

  return (
    <section className="w-full bg-[#F5F5F5] py-20">
      <Container className="flex flex-col items-center gap-12">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <ScrollReveal variant="fadeUp" className="flex flex-col items-center gap-3 max-w-[672px] text-center">
          <SectionBadge label="Client Success" />
          <h2
            className="font-bold text-3xl md:text-[38px] leading-[1.05] tracking-[-0.03em]"
            style={{ color: "#2251B5", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            What Our Client Say{" "}
          </h2>
          <p className="text-[#4A5565] text-lg md:text-[20px] leading-[1.4]">
            A proven methodology that ensures successful project delivery from
            concept to completion
          </p>
        </ScrollReveal>

        {/* ── Main content: Testimonial card + Client selector ─────────── */}
        <div className="flex flex-col gap-16 w-full">
          {/* Card + selector row */}
          <div className="flex flex-col lg:flex-row items-center gap-6 w-full">
            {/* ── Featured Testimonial Card ──────────────────────────── */}
            <ScrollReveal variant="slideLeft" className="w-full lg:w-[588px] shrink-0 bg-white rounded-3xl border-2 border-[#E96429]/25 shadow-[0px_14px_40px_-12px_rgba(0,0,0,0.11)] p-10 flex flex-col gap-6 relative min-h-[422px]">
              {/* Quote icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(233,100,41,1) 0%, rgba(233,100,41,0.8) 100%)",
                }}
              >
                <Quote size={32} className="text-white" />
              </div>

              {/* Star rating */}
              <StarRating count={active.rating || 5} />

              {/* Quote text */}
              <p className="text-[#364153] text-lg md:text-[20px] italic leading-relaxed font-['Inter',sans-serif]">
                "{active.quote}"
              </p>

              {/* Author info */}
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={active.avatar}
                  alt={active.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
                />
                <div className="flex flex-col">
                  <h4 className="text-[#101828] font-bold text-lg leading-[1.55] font-['Inter',sans-serif]">
                    {active.name}
                  </h4>
                  <div className="text-[#4A5565] text-sm leading-[1.428] font-['Inter',sans-serif]">
                    {active.role}{active.company ? `, ${active.company}` : ''}
                  <h6 className="text-[#E96429] text-sm leading-[1.428] font-['Inter',sans-serif] font-semibold">{active.companyType}</h6>
                  </div>
                  <p className="text-[#E96429] font-semibold text-sm leading-[1.428] font-['Inter',sans-serif]">
                    {active.project}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* ── Client Selector Grid ───────────────────────────────── */}
            <ScrollReveal variant="slideRight" className="flex flex-col gap-6 w-full lg:flex-1">
              {/* Row layout: 2 columns × n rows on desktop, stack on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayData.map((t, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={t.id || t.name + i}
                      onClick={() => setActiveIndex(i)}
                      className={`flex flex-col gap-3 p-6 rounded-2xl border transition-all duration-300 text-left ${
                        isActive
                          ? "bg-white border-[#E96429] border-2 shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)]"
                          : "bg-white/50 border-[#F3F4F6] hover:bg-white/80"
                      }`}
                    >
                      {/* User info row */}
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-[#101828] font-bold text-sm leading-[1.428] font-['Inter',sans-serif]">
                            {t.name}
                          </span>
                          <span className="text-[#4A5565] font-medium text-xs leading-[1.33] font-['Inter',sans-serif]">
                            {t.role}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating || 5 }).map((_, j) => (
                          <Star
                            key={j}
                            size={12}
                            className={`${isActive ? "text-[#E96429] fill-[#E96429]" : "text-[#2251B5] fill-[#2251B5]"}`}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* ── Stats Row ─────────────────────────────────────────────── */}
          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 bg-white/80 border border-[#F3F4F6] rounded-2xl p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
              >
                <span
                  className="bg-clip-text text-transparent inline-block"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, #E96429 0%, #2251B5 100%)",
                  }}
                >
                  <CountUp
                    end={stat.value}
                    suffix={stat.suffix}
                    className="font-bold text-4xl leading-[1.11] font-['Inter',sans-serif]"
                  />
                </span>
                <span className="text-[#4A5565] font-medium text-sm leading-[1.428] font-['Inter',sans-serif] text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </Container>
    </section>
  );
}
