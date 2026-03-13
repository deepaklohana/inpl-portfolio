import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import { Target, Lightbulb, Heart, Award } from "lucide-react";

const coreValues = [
  {
    title: "Mission-Driven",
    description: "We are committed to revolutionizing how businesses leverage technology for sustainable growth and innovation.",
    icon: Target,
    gradient: "from-[#E96429] to-[#E96429]/80",
    shadow: "shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
  },
  {
    title: "Innovation First",
    description: "Cutting-edge solutions that stay ahead of the curve and push the boundaries of what's possible.",
    icon: Lightbulb,
    gradient: "from-[#2251B5] to-[#2251B5]/80",
    shadow: "shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
  },
  {
    title: "Customer-Centric",
    description: "Your success is our success. We build lasting partnerships based on trust and mutual growth.",
    icon: Heart,
    gradient: "from-[#E96429] to-[#E96429]/80",
    shadow: "shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
  },
  {
    title: "Excellence Always",
    description: "We maintain the highest standards of quality in everything we do, from code to customer service.",
    icon: Award,
    gradient: "from-[#2251B5] to-[#2251B5]/80",
    shadow: "shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
  }
];

export default function CoreValuesSection() {
  return (
    <section className="w-full bg-[#F9F9F9] py-16 md:py-20 lg:py-[80px]">
      <Container>
        <div className="flex flex-col items-center gap-12">
          {/* Header */}
          <SectionHeader
            badge="Values"
            title="Our Core Values"
            subtitle="The principles that guide everything we do"
            align="center"
          />

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-[24px] border border-[#E0E0E0] p-8 flex flex-col items-start gap-6 hover:-translate-y-1 transition-transform duration-300"
                >
                  {/* Icon Container */}
                  <div
                    className={`w-16 h-16 rounded-[16px] flex items-center justify-center bg-linear-to-br ${value.gradient} ${value.shadow} shrink-0`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-[24px] leading-[1.33] text-[#101828] font-['Inter',sans-serif]">
                      {value.title}
                    </h3>
                    <p className="font-normal text-[16px] leading-relaxed text-[#4A5565] font-['Inter',sans-serif]">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
