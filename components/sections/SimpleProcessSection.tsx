"use client";

import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Container from "../ui/Container";

export interface ProcessStep {
  num: string;
  title: string;
  description: string;
  color: "orange" | "blue";
}

interface SimpleProcessSectionProps {
  badge: string;
  title: string;
  subtitle: string;
  titleColor?: string;
  steps: ProcessStep[];
}

export default function SimpleProcessSection({
  badge,
  title,
  subtitle,
  titleColor = "#2251B5",
  steps,
}: SimpleProcessSectionProps) {
  return (
    <section className="w-full py-20 md:py-28 bg-[#F9F9F9]">
      <Container className="flex flex-col items-center">
        <SectionHeader
          badge={badge}
          title={title}
          subtitle={subtitle}
          align="center"
          titleColor={titleColor}
        />

        <div className="w-full mt-16 md:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const isOrange = step.color === "orange";
              const hasConnector = index < steps.length - 1;

              return (
                <motion.div
                  key={step.num}
                  className="flex flex-col items-center text-center relative max-w-[284px] mx-auto w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Big Number */}
                  <div
                    className={`text-[72px] font-bold leading-none opacity-20 mb-4 font-inter ${
                      isOrange ? "text-[#E96429]" : "text-[#2251B5]"
                    }`}
                  >
                    {step.num}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-[#101828] text-[20px] font-bold leading-[1.4] mb-2 font-inter z-10 w-full px-2">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-[#4A5565] text-[16px] leading-relaxed font-inter z-10">
                    {step.description}
                  </p>

                  {/* Desktop Connector Line */}
                  {hasConnector && (
                    <div
                      className="hidden lg:block absolute top-[48px] -right-[16px] w-[32px] h-[2px] z-0"
                      style={{
                        background:
                          step.color === "orange"
                            ? "linear-gradient(90deg, #E96429 0%, #2251B5 100%)"
                            : "linear-gradient(90deg, #2251B5 0%, #E96429 100%)",
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
