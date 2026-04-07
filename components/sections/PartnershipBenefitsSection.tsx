import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Zap, Globe, Layers, TrendingUp } from "lucide-react";

const benefits = [
  {
    title: "Accelerated Innovation",
    description: "Combine expertise and resources to bring solutions to market faster",
    icon: Zap,
    variant: "orange",
  },
  {
    title: "Expanded Reach",
    description: "Access new markets and customer segments through partnership networks",
    icon: Globe,
    variant: "blue",
  },
  {
    title: "Enhanced Capabilities",
    description: "Leverage complementary technologies and expertise",
    icon: Layers,
    variant: "orange",
  },
  {
    title: "Revenue Growth",
    description: "Create new revenue streams and business opportunities",
    icon: TrendingUp,
    variant: "blue",
  },
];

export default function PartnershipBenefitsSection() {
  return (
    <section className="py-20 md:py-[80px] bg-white w-full flex flex-col gap-12">
      <div className="flex justify-center w-full max-w-[672px] px-4 md:px-[120px] mx-auto text-center">
        <SectionHeader 
          badge="Benefits"
          title="Partnership Benefits"
          subtitle="Why leading companies choose to partner with us"
          align="center"
          titleColor="#2251B5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full max-w-[1232px] mx-auto mt-2">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          const isOrange = benefit.variant === "orange";
          const iconGradient = isOrange 
            ? "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.8) 100%)"
            : "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.8) 100%)";

          return (
            <div 
              key={idx}
              className="flex flex-col items-center text-center gap-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
                style={{ background: iconGradient }}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex flex-col gap-3">
                <h3 className="font-['Inter',sans-serif] font-bold text-xl leading-[1.4] text-[#101828]">
                  {benefit.title}
                </h3>
                <p className="font-['Inter',sans-serif] text-base leading-relaxed text-[#4A5565]">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
