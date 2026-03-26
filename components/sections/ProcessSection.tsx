"use client";

import SectionHeader from "../ui/SectionHeader";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { Lightbulb, ClipboardList, Settings, BarChart3, type LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";

interface ProcessStep {
  num: string;
  title: string;
  description: string;
  tags: string[];
  color: "orange" | "blue";
  icon: LucideIcon;
  iconBg: "orange" | "blue";
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Discovery & Strategy",
    description:
      "We dive deep into your business goals, challenges, and opportunities to create a tailored roadmap.",
    tags: ["Requirements Analysis", "Market Research", "Strategic Planning"],
    color: "orange",
    icon: Lightbulb,
    iconBg: "orange",
  },
  {
    num: "02",
    title: "Design & Planning",
    description:
      "Our team crafts detailed designs and technical architecture that bring your vision to life.",
    tags: ["UI/UX Design", "Technical Architecture", "Prototyping"],
    color: "blue",
    icon: ClipboardList,
    iconBg: "blue",
  },
  {
    num: "03",
    title: "Development & Testing",
    description:
      "Expert developers build robust solutions with rigorous testing at every stage.",
    tags: ["Agile Development", "Quality Assurance", "Performance Testing"],
    color: "orange",
    icon: Settings,
    iconBg: "orange",
  },
  {
    num: "04",
    title: "Launch & Optimize",
    description:
      "Seamless deployment followed by continuous monitoring and optimization for peak performance.",
    tags: ["Deployment", "Monitoring", "Optimization"],
    color: "blue",
    icon: BarChart3,
    iconBg: "blue",
  },
];

function StepIcon({ icon: Icon, bg }: { icon: LucideIcon; bg: "orange" | "blue" }) {
  const bgColor = bg === "orange" ? "#E96429" : "#2251B5";
  return (
    <div className="relative w-[100px] h-[100px] md:w-[128px] md:h-[128px] shrink-0">
      {/* Main circle */}
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function NumberBadge({ num, color }: { num: string; color: "orange" | "blue" }) {
  const isOrange = color === "orange";
  return (
    <div
      className={`px-4 py-2 rounded-full border-2 inline-flex items-center justify-center ${
        isOrange
          ? "bg-linear-to-br from-[#E96429]/13 to-[#E96429]/6 border-[#E96429]/25"
          : "bg-linear-to-br from-[#2251B5]/13 to-[#2251B5]/6 border-[#2251B5]/25"
      }`}
    >
      <span
        className={`font-bold text-2xl leading-[1.33] ${
          isOrange ? "text-[#E96429]" : "text-[#2251B5]"
        }`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {num}
      </span>
    </div>
  );
}

function TagPill({ label, color }: { label: string; color: "orange" | "blue" }) {
  const isOrange = color === "orange";
  return (
    <span
      className={`whitespace-nowrap px-3 py-1.5 bg-white rounded-full border text-sm font-semibold leading-[1.43] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] font-['Inter',sans-serif] ${
        isOrange
          ? "border-[#E96429]/25 text-[#E96429]"
          : "border-[#2251B5]/25 text-[#2251B5]"
      }`}
    >
      {label}
    </span>
  );
}

export default function ProcessSection() {
  return (
    <section
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 50%, #FFFFFF 100%)",
      }}
    >
      {/* ── Background Blur Ellipses ─────────────────────────────────── */}
      {/* Top-left orange blur */}
      <div className="absolute -left-[226px] top-[14px] w-[452px] h-[452px] bg-[#E96429]/5 blur-[128px] rounded-full pointer-events-none" />
      {/* Right blue blur */}
      <div className="absolute right-[-50px] top-[490px] w-[343px] h-[307px] bg-[#2251B5]/20 blur-[300px] rounded-full pointer-events-none" />
      {/* Bottom-left blue blur */}
      <div className="absolute -left-[202px] bottom-[20px] w-[343px] h-[307px] bg-[#2251B5]/20 blur-[300px] rounded-full pointer-events-none" />
      {/* Mid-left orange blur */}
      <div className="absolute -left-[123px] top-[56%] w-[343px] h-[307px] bg-[#E96429]/15 blur-[300px] rounded-full pointer-events-none" />
      {/* Bottom-right orange blur */}
      <div className="absolute right-[-100px] bottom-0 w-[343px] h-[307px] bg-[#E96429]/15 blur-[300px] rounded-full pointer-events-none" />

      <Container className="relative z-10 flex flex-col items-center">
        {/* ── Section Header ──────────────────────────────────────────── */}
        <ScrollReveal variant="fadeUp">
          <SectionHeader
            badge="Our Process"
            title="How We Work"
            subtitle="A proven methodology that ensures successful project delivery from concept to completion"
            align="center"
          />
        </ScrollReveal>

        {/* ── Timeline Container ─────────────────────────────────────── */}
        <div className="relative w-full mt-16 md:mt-24">
          {/* Central Gradient Line (Desktop Only) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full hidden lg:block bg-linear-to-b from-[#E96429] via-[#2251B5] to-[#E96429]" />

          {/* ── Steps ─────────────────────────────────────────────────── */}
          <StaggerReveal className="flex flex-col gap-12 lg:gap-0">
            {PROCESS_STEPS.map((step, index) => {
              const isLeft = index % 2 === 0; // steps 01, 03 have content on the LEFT
              const Icon = step.icon;

              return (
                <div
                  key={step.num}
                  className="relative lg:min-h-[280px] flex items-start lg:items-center"
                >
                  {/* ── Desktop Layout ────────────────────────────────── */}
                  <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] w-full items-center gap-0">
                    {/* LEFT COLUMN */}
                    <div
                      className={`flex ${
                        isLeft ? "justify-end pr-16" : "justify-start pl-16"
                      }`}
                    >
                      {isLeft ? (
                        /* Content block on the left — text right-aligned */
                        <div className="flex flex-col items-end text-right max-w-[536px] w-full">
                          <NumberBadge num={step.num} color={step.color} />
                          <h3 
                            className="text-[#101828] font-bold text-[30px] leading-[1.2] mt-4"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {step.title}
                          </h3>
                          <p className="text-[#4A5565] text-lg leading-relaxed mt-3 max-w-[440px] font-['Inter',sans-serif]">
                            {step.description}
                          </p>
                          <div className="flex flex-wrap lg:flex-nowrap gap-2 mt-6 justify-end">
                            {step.tags.map((tag) => (
                              <TagPill key={tag} label={tag} color={step.color} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Icon on the left */
                        <div className="flex items-center justify-center">
                          <StepIcon icon={Icon} bg={step.iconBg} />
                        </div>
                      )}
                    </div>

                    {/* CENTER COLUMN — timeline dot area (transparent, line behind) */}
                    <div className="w-4" />

                    {/* RIGHT COLUMN */}
                    <div
                      className={`flex ${
                        isLeft ? "justify-start pl-16" : "justify-start pl-16"
                      }`}
                    >
                      {isLeft ? (
                        /* Icon on the right */
                        <div className="flex items-center justify-center">
                          <StepIcon icon={Icon} bg={step.iconBg} />
                        </div>
                      ) : (
                        /* Content block on the right — text left-aligned */
                        <div className="flex flex-col items-start text-left max-w-[536px] w-full">
                          <NumberBadge num={step.num} color={step.color} />
                          <h3 
                            className="text-[#101828] font-bold text-[30px] leading-[1.2] mt-4"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {step.title}
                          </h3>
                          <p className="text-[#4A5565] text-lg leading-relaxed mt-3 max-w-[440px] font-['Inter',sans-serif]">
                            {step.description}
                          </p>
                          <div className="flex flex-wrap lg:flex-nowrap gap-2 mt-6 justify-start">
                            {step.tags.map((tag) => (
                              <TagPill key={tag} label={tag} color={step.color} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Mobile Layout ─────────────────────────────────── */}
                  <div className="flex flex-col items-center text-center lg:hidden w-full">
                    <StepIcon icon={Icon} bg={step.iconBg} />
                    <NumberBadge num={step.num} color={step.color} />
                    <h3 
                      className="text-[#101828] font-bold text-[26px] leading-[1.2] mt-3"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[#4A5565] text-base leading-relaxed mt-2 max-w-[400px] font-['Inter',sans-serif]">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5 justify-center">
                      {step.tags.map((tag) => (
                        <TagPill key={tag} label={tag} color={step.color} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </StaggerReveal>
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <div className="mt-16 md:mt-24 z-10">
          <Button variant="primary" href="/contact">
            Start Your Project Journey
          </Button>
        </div>
      </Container>
    </section>
  );
}
