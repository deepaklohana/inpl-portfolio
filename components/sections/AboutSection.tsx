import { Lightbulb, FileText, Rocket, BarChart2, type LucideIcon } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const steps: {
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  color: "orange" | "blue";
}[] = [
  {
    number: "01",
    title: "Discovery & Strategy",
    description:
      "We dive deep into your business goals, challenges, and opportunities to create a tailored roadmap.",
    tags: ["Requirements Analysis", "Market Research", "Strategic Planning"],
    icon: Lightbulb,
    color: "orange",
  },
  {
    number: "02",
    title: "Design & Planning",
    description:
      "Our team crafts detailed designs and technical architecture that bring your vision to life.",
    tags: ["UI/UX Design", "Technical Architecture", "Prototyping"],
    icon: FileText,
    color: "blue",
  },
  {
    number: "03",
    title: "Development & Testing",
    description:
      "Expert developers build robust solutions with rigorous testing at every stage.",
    tags: ["Agile Development", "Quality Assurance", "Performance Testing"],
    icon: Rocket,
    color: "orange",
  },
  {
    number: "04",
    title: "Launch & Optimize",
    description:
      "Seamless deployment followed by continuous monitoring and optimization for peak performance.",
    tags: ["Deployment", "Monitoring", "Optimization"],
    icon: BarChart2,
    color: "blue",
  },
];

export default function AboutSection() {
  return (
    <section className="relative w-full py-16 md:py-[120px] px-6 lg:px-[120px] bg-linear-to-b from-white via-gray-50/50 to-white overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[10%] -left-[10%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#E96429]/6 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[0%] w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-[#2251B5]/6 rounded-full blur-[120px] md:blur-[150px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto flex flex-col items-center z-10 relative">
        {/* Section Header */}
        <ScrollReveal variant="fadeUp" className="flex flex-col items-center gap-4 text-center mb-16 md:mb-[100px]">
          <SectionBadge label="Our Process" />
          <h2
            className="text-[#2251B5] font-bold text-3xl md:text-[38px] leading-[1.1] tracking-[-0.02em]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            How We Work
          </h2>
          <p className="max-w-[600px] text-[#4A5565] text-lg md:text-[20px] leading-relaxed font-['Inter',sans-serif]">
            A proven methodology that ensures successful project delivery from
            concept to completion
          </p>
        </ScrollReveal>

        {/* Timeline Area */}
        <div className="relative w-full max-w-[1200px] mx-auto pb-8 md:pb-24">
          {/* Vertical Center Line (Desktop Only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-4 w-[4px] -translate-x-1/2 rounded-full bg-linear-to-b from-[#E96429] via-[#2251B5] to-[#E96429]" />

          <div className="flex flex-col gap-16 md:gap-[100px] w-full relative pt-8 md:pt-12">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className="w-full flex flex-col md:flex-row items-center relative"
                >
                  {/* Left Column (50%) */}
                  <ScrollReveal variant="slideLeft" className="w-full md:w-1/2 flex justify-start md:justify-end md:pr-12 lg:pr-16 z-10">
                    {isLeft ? (
                      // Text on the left
                      <div className="flex flex-col items-start md:items-end text-left md:text-right gap-5 w-full max-w-[535px]">
                        <div
                          className={`px-4 py-2 rounded-full border text-[20px] md:text-[24px] font-bold w-max ${
                            step.color === "orange"
                              ? "bg-[#E96429]/10 border-[#E96429]/25 text-[#E96429]"
                              : "bg-[#2251B5]/10 border-[#2251B5]/25 text-[#2251B5]"
                          }`}
                        >
                          {step.number}
                        </div>
                        <h3 className="text-[#101828] text-2xl md:text-[30px] font-bold">
                          {step.title}
                        </h3>
                        <p className="text-[#4A5565] text-base md:text-[18px] leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 justify-start md:justify-end">
                          {step.tags.map((tag, i) => (
                            <span
                              key={i}
                              className={`px-[16px] py-[8px] bg-white rounded-full border shadow-sm text-[13px] md:text-[14px] font-semibold ${
                                step.color === "orange"
                                  ? "border-[#E96429]/25 text-[#E96429]"
                                  : "border-[#2251B5]/25 text-[#2251B5]"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Icon on the left
                      <div className="flex justify-start md:justify-end w-full max-w-[535px]">
                        <div className="relative w-[128px] h-[128px] flex items-center justify-center transition-transform hover:scale-105 duration-300">
                          <div
                            className={`absolute inset-0 rounded-full ${
                              step.color === "orange"
                                ? "bg-[#E96429]/15"
                                : "bg-[#2251B5]/15"
                            }`}
                          />
                          <div
                            className={`relative z-10 w-[90px] h-[90px] rounded-full flex items-center justify-center shadow-lg ${
                              step.color === "orange"
                                ? "bg-[#E96429]"
                                : "bg-[#2251B5]"
                            }`}
                          >
                            <step.icon className="text-white w-10 h-10" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                    )}
                  </ScrollReveal>

                  {/* Right Column (50%) */}
                  <ScrollReveal variant="slideRight" className="w-full md:w-1/2 flex justify-start md:pl-12 lg:pl-16 z-10 mt-8 md:mt-0">
                    {isLeft ? (
                      // Icon on the right
                      <div className="flex justify-start w-full max-w-[535px]">
                        <div className="relative w-[128px] h-[128px] flex items-center justify-center transition-transform hover:scale-105 duration-300">
                          <div
                            className={`absolute inset-0 rounded-full ${
                              step.color === "orange"
                                ? "bg-[#E96429]/15"
                                : "bg-[#2251B5]/15"
                            }`}
                          />
                          <div
                            className={`relative z-10 w-[90px] h-[90px] rounded-full flex items-center justify-center shadow-lg ${
                              step.color === "orange"
                                ? "bg-[#E96429]"
                                : "bg-[#2251B5]"
                            }`}
                          >
                            <step.icon className="text-white w-10 h-10" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Text on the right
                      <div className="flex flex-col items-start text-left gap-5 w-full max-w-[535px]">
                        <div
                          className={`px-4 py-2 rounded-full border text-[20px] md:text-[24px] font-bold w-max ${
                            step.color === "orange"
                              ? "bg-[#E96429]/10 border-[#E96429]/25 text-[#E96429]"
                              : "bg-[#2251B5]/10 border-[#2251B5]/25 text-[#2251B5]"
                          }`}
                        >
                          {step.number}
                        </div>
                        <h3 className="text-[#101828] text-2xl md:text-[30px] font-bold">
                          {step.title}
                        </h3>
                        <p className="text-[#4A5565] text-base md:text-[18px] leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 justify-start">
                          {step.tags.map((tag, i) => (
                            <span
                              key={i}
                              className={`px-[16px] py-[8px] bg-white rounded-full border shadow-sm text-[13px] md:text-[14px] font-semibold ${
                                step.color === "orange"
                                  ? "border-[#E96429]/25 text-[#E96429]"
                                  : "border-[#2251B5]/25 text-[#2251B5]"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-16 md:mt-24 z-10">
          <button className="bg-[#2251B5] hover:bg-[#1c4294] transition-colors text-white text-[16px] font-semibold py-[18px] px-[32px] rounded-xl shadow-md">
            Start Your Project Journey
          </button>
        </div>
      </div>
    </section>
  );
}
