"use client";

import { useRef } from "react";
import { motion, useScroll, Variants } from "framer-motion";
import SectionBadge from "@/components/ui/SectionBadge";
import ShinyCard from "@/components/ui/ShinyCard";

const milestones = [
  {
    year: "2010",
    title: "Company Founded",
    description: "Started with a vision to transform digital experiences",
    align: "left",
  },
  {
    year: "2013",
    title: "First Enterprise Client",
    description: "Secured our first Fortune 500 partnership",
    align: "right",
  },
  {
    year: "2016",
    title: "Global Expansion",
    description: "Opened offices in 5 countries across 3 continents",
    align: "left",
  },
  {
    year: "2019",
    title: "AI Innovation Lab",
    description: "Launched dedicated AI research and development center",
    align: "right",
  },
  {
    year: "2022",
    title: "1000+ Clients",
    description: "Reached milestone of serving over 1000 businesses worldwide",
    align: "left",
  },
  {
    year: "2024",
    title: "Industry Leader",
    description: "Recognized as a leader in digital transformation solutions",
    align: "right",
  },
];

export default function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section className="relative w-full flex justify-center py-12 md:py-[80px] bg-white overflow-hidden">
      {/* Background Ellipses */}
      <div className="absolute top-0 right-[-100px] w-[343px] h-[307px] bg-[#2251B5]/20 rounded-full blur-[150px] md:blur-[300px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 left-[-50px] w-[343px] h-[307px] bg-[#E96429]/15 rounded-full blur-[150px] md:blur-[300px] mix-blend-multiply pointer-events-none" />

      <div className="w-full max-w-[1200px] px-6 lg:px-[120px] flex flex-col items-center">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 text-center mb-16 md:mb-[64px] z-10"
        >
          <SectionBadge label="Journey" />
          <h2
            className="font-bold text-3xl md:text-[38px] leading-[1.052] text-[#2251B5] mt-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Our Journey
          </h2>
          <p className="text-[#4A5565] text-lg md:text-[20px] leading-[1.4] max-w-[600px] font-['Inter',sans-serif]">
            Key milestones that shaped our growth
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative w-full max-w-[960px] flex flex-col z-10" ref={containerRef}>
          {/* Vertical Center Gradient Line */}
          <motion.div 
            className="absolute left-[24px] lg:left-1/2 top-4 bottom-4 w-1 lg:-ml-[2px] rounded-full bg-linear-to-b from-[#2251B5] to-[#E96429] opacity-20"
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
          />

          <div className="flex flex-col gap-8 md:gap-12">
            {milestones.map((milestone, index) => {
              const isLeft = milestone.align === "left";
              
              const itemVariants: Variants = {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.3,
                  }
                }
              };

              const getCardVariants = (isLeftPos: boolean): Variants => ({
                hidden: { opacity: 0, x: isLeftPos ? -30 : 30, y: 20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                    when: "beforeChildren",
                    staggerChildren: 0.2
                  }
                }
              });

              const dotVariants: Variants = {
                hidden: { opacity: 0, scale: 0 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring" } }
              };

              const textVariants: Variants = {
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
              };

              return (
                <motion.div
                  key={milestone.year}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "0px 0px -55% 0px" }}
                  variants={itemVariants}
                  className={`relative flex flex-col lg:flex-row items-start lg:items-center w-full gap-8 lg:gap-0
                    ${isLeft ? "lg:justify-start" : "lg:justify-end"}`}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    variants={dotVariants}
                    className={`absolute left-[9px] lg:left-1/2 top-[32px] lg:top-1/2 w-8 h-8 rounded-full border-[3px] border-white shadow-md shrink-0 z-20 
                      -translate-y-1/2 lg:-translate-x-1/2
                      ${isLeft ? "bg-[#E96429]" : "bg-[#2251B5]"}`}
                  />

                  {/* Content Card */}
                  <motion.div
                    variants={getCardVariants(isLeft)}
                    className={`w-full lg:w-[calc(50%-2rem)] pl-16 lg:pl-0 flex flex-col
                      ${isLeft ? "lg:pr-12 lg:items-end lg:text-right" : "lg:pl-12 lg:items-start lg:text-left"}`}
                  >
                    <ShinyCard
                      glowColor={isLeft ? "#2251B5" : "#E96429"}
                      className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      <motion.span
                        variants={textVariants}
                        className={`font-bold text-2xl font-['Inter',sans-serif] block mb-2
                          ${isLeft ? "text-[#E96429]" : "text-[#2251B5]"}`}
                      >
                        {milestone.year}
                      </motion.span>
                      <motion.h3 
                        variants={textVariants} 
                        className="text-[#101828] text-xl font-bold font-['Inter',sans-serif] mb-2 leading-[1.4]"
                      >
                        {milestone.title}
                      </motion.h3>
                      <motion.p 
                        variants={textVariants} 
                        className="text-[#4A5565] text-base leading-normal font-['Inter',sans-serif]"
                      >
                        {milestone.description}
                      </motion.p>
                    </ShinyCard>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
