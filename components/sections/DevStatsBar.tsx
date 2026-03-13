"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "500+",
    label: "Projects Delivered",
  },
  {
    value: "50+",
    label: "Expert Developers",
  },
  {
    value: "15+",
    label: "Years Experience",
  },
  {
    value: "98%",
    label: "Client Satisfaction",
  },
];

export default function DevStatsBar() {
  return (
    <section className="w-full bg-linear-to-b from-[#E96429] to-[#2251B5] py-8 px-4 md:px-[140px]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-[161px] justify-items-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center justify-center text-center gap-1"
          >
            <div className="font-['Inter'] font-bold text-4xl md:text-[48px] leading-none text-white">
              {stat.value}
            </div>
            <div className="font-['Inter'] font-normal text-sm md:text-base leading-relaxed text-white/80">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
