import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Handshake, Network, Award, Rocket } from "lucide-react";

const programs = [
  {
    number: "50+",
    title: "Technology Partners",
    description: "Leading technology companies collaborating to deliver cutting-edge solutions",
    icon: Network,
    variant: "orange",
  },
  {
    number: "30+",
    title: "Strategic Alliances",
    description: "Long-term partnerships driving innovation and mutual growth",
    icon: Handshake,
    variant: "blue",
  },
  {
    number: "100+",
    title: "Certified Partners",
    description: "Verified experts trained in our platforms and methodologies",
    icon: Award,
    variant: "orange",
  },
  {
    number: "25+",
    title: "Startup Ecosystem",
    description: "Supporting innovative startups with technology and mentorship",
    icon: Rocket,
    variant: "blue",
  },
];

export default function PartnershipProgramsSection() {
  return (
    <section className="py-20 md:py-[80px] bg-white w-full flex flex-col gap-12">
      <div className="flex justify-center w-full max-w-[672px] mx-auto px-4 md:px-[120px] text-center">
        <SectionHeader 
          badge="Partnerships"
          title="Partnership Programs"
          subtitle="Flexible partnership models designed to create mutual value"
          align="center"
          titleColor="#2251B5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1232px] mx-auto mt-2">
        {programs.map((program, idx) => {
          const Icon = program.icon;
          const isOrange = program.variant === "orange";
          const numberColor = isOrange ? "text-[#E96429]" : "text-[#2251B5]";
          const iconGradient = isOrange 
            ? "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.8) 100%)"
            : "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.8) 100%)";

          return (
            <div 
              key={idx}
              className="flex flex-col bg-white border border-[#E0E0E0] rounded-[24px] p-8 gap-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
                style={{ background: iconGradient }}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex flex-col gap-2">
                <span className={`font-['Inter',sans-serif] font-bold text-4xl leading-[1.1] ${numberColor}`}>
                  {program.number}
                </span>
                <h3 className="font-['Inter',sans-serif] font-bold text-xl leading-[1.4] text-[#101828]">
                  {program.title}
                </h3>
              </div>

              <p className="font-['Inter',sans-serif] text-base leading-relaxed text-[#4A5565]">
                {program.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
