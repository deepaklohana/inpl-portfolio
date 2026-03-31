"use client";

import { motion } from "framer-motion";


export default function DevStatsBar({stats}: {stats: any}) {
  let parsedStats = [];
  
  if (Array.isArray(stats)) {
    parsedStats = stats;
  } else if (typeof stats === 'string') {
    try {
      parsedStats = JSON.parse(stats);
      if (typeof parsedStats === 'string') {
        parsedStats = JSON.parse(parsedStats);
      }
    } catch (e) {
      console.log('Error parsing stats JSON:', e);
    }
  } else if (stats && typeof stats === 'object') {
    // maybe it was saved as some object wrapper? 
    if (Array.isArray(stats.stats)) parsedStats = stats.stats;
    else if (Array.isArray(stats.data)) parsedStats = stats.data;
  }

  if (!Array.isArray(parsedStats) || parsedStats.length === 0) {
    return null; // Return nothing if no valid stats
  }

  return (
    <section className="w-full bg-[#E96429] py-8 px-4 md:px-[140px]" style={{
      background: 'linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(34, 81, 181, 1) 100%)'
    }}>
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-[161px] justify-items-center">
        {parsedStats.map((stat: any, index: number) => (
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
