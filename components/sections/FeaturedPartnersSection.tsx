import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";

const partners = [
  {
    acronym: "CS",
    type: "Technology Partner",
    since: "Since 2018",
    name: "CloudTech Solutions",
    category: "Cloud Infrastructure",
    description: "Global leader in cloud computing and enterprise solutions",
    variant: "orange"
  },
  {
    acronym: "DA",
    type: "Strategic Alliance",
    since: "Since 2019",
    name: "DataFlow Analytics",
    category: "Data Analytics",
    description: "Advanced analytics and business intelligence platform",
    variant: "blue"
  },
  {
    acronym: "SS",
    type: "Technology Partner",
    since: "Since 2020",
    name: "SecureNet Systems",
    category: "Cybersecurity",
    description: "Enterprise security and compliance solutions",
    variant: "orange"
  },
  {
    acronym: "AIL",
    type: "Strategic Alliance",
    since: "Since 2021",
    name: "AI Innovations Lab",
    category: "Artificial Intelligence",
    description: "Leading AI research and development organization",
    variant: "blue"
  },
  {
    acronym: "MFT",
    type: "Certified Partner",
    since: "Since 2020",
    name: "Mobile First Tech",
    category: "Mobile Development",
    description: "Cross-platform mobile app development experts",
    variant: "orange"
  },
  {
    acronym: "GEC",
    type: "Technology Partner",
    since: "Since 2022",
    name: "Green Energy Cloud",
    category: "Sustainability",
    description: "Sustainable cloud infrastructure provider",
    variant: "blue"
  }
];

export default function FeaturedPartnersSection() {
  return (
    <section className="py-20 md:py-[80px] bg-[#F9FAFB] w-full flex flex-col gap-12">
      <div className="flex justify-center w-full max-w-[672px] px-4 md:px-[120px] mx-auto text-center">
        <SectionHeader 
          title="Featured Partners"
          subtitle="Collaborating with industry leaders to drive innovation"
          align="center"
          titleColor="#2251B5"
          badge="Partners"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1232px] mx-auto mt-2">
        {partners.map((partner, idx) => {
          const isOrange = partner.variant === "orange";
          const pillBg = isOrange ? "bg-[#E96429]/10" : "bg-[#2251B5]/10";
          const pillText = isOrange ? "text-[#E96429]" : "text-[#2251B5]";
          // Figma actually uses alternating background gradients overlaying the images. We'll use a dynamic solid gradient as a placeholder for the image block.
          const imgGradient = isOrange 
            ? "linear-gradient(135deg, rgba(233, 100, 41, 0.8) 0%, rgba(248, 130, 77, 0.8) 100%)"
            : "linear-gradient(135deg, rgba(34, 81, 181, 0.8) 0%, rgba(67, 126, 253, 0.8) 100%)";

          return (
            <div 
              key={idx}
              className="flex flex-col bg-white border border-[#E0E0E0] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              {/* Image / Banner Block */}
              <div 
                className="w-full h-[192px] relative flex items-center justify-center bg-gray-200"
                style={{ background: imgGradient }}
              >
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                <span 
                  className="relative z-10 font-['Inter',sans-serif] font-bold text-[30px] text-white"
                  style={{ textShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)" }}
                >
                  {partner.acronym}
                </span>
              </div>

              {/* Content Block */}
              <div className="flex flex-col p-6 gap-6">
                {/* Meta row */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1.5 rounded-full font-['Inter',sans-serif] font-semibold text-xs leading-none ${pillBg} ${pillText}`}>
                    {partner.type}
                  </span>
                  <span className="font-['Inter',sans-serif] text-xs text-[#6A7282]">
                    {partner.since}
                  </span>
                </div>

                {/* Title & Category */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-['Inter',sans-serif] font-bold text-xl text-[#101828]">
                    {partner.name}
                  </h3>
                  <span className="font-['Inter',sans-serif] font-semibold text-sm text-[#6A7282]">
                    {partner.category}
                  </span>
                </div>

                {/* Description */}
                <p className="font-['Inter',sans-serif] text-base leading-relaxed text-[#4A5565]">
                  {partner.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
