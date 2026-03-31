"use client";

import { motion } from "framer-motion";

const MODULES = [
  { label: "H.R Management", color: "orange" },
  { label: "CRM Management", color: "blue" },
  { label: "Procurement Management", color: "orange" },
  { label: "Import Management", color: "blue" },
  { label: "Inventory Management", color: "blue" },
  { label: "Store & Spares", color: "orange" },
  { label: "Production Management", color: "blue" },
  { label: "Toll Manufacturing", color: "orange" },
  { label: "Indenting Management", color: "orange" },
  { label: "Sales Management", color: "blue" },
] as const;

const ORANGE_GRADIENT = "linear-gradient(90deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.9) 100%)";
const BLUE_GRADIENT = "linear-gradient(90deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.9) 100%)";

export default function ERPModulesSection({ 
  slug, 
  modules 
}: { 
  slug?: string | null; 
  modules?: any[] 
}) {
  const displayModules = modules && modules.length > 0 
    ? modules.map((m, i) => ({ id: m.id, label: m.name, color: i % 2 === 0 ? "orange" : "blue" }))
    : MODULES;

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="max-w-[1232px] mx-auto px-4 md:px-8 lg:px-10 flex flex-col items-center gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 max-w-[672px] text-center"
        >
          <h2
            className="font-bold text-[28px] md:text-[38px] leading-[1.05] text-[#2251B5]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Explore Our Modules
          </h2>
          <p
            className="text-base md:text-[20px] leading-[1.4] text-[#4A5565]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
           Click on any module to jump to its details
          </p>
        </motion.div>

        {/* Module Pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-[17px]"
        >
          {displayModules.map((module, i) => (
            <motion.button
              key={module.label}
              onClick={() => {
                if ('id' in module && module.id) {
                  const el = document.getElementById(`module-${module.id}`);
                  if (el) {
                    const yOffset = -80; 
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-[14px] text-white font-semibold text-[14px] leading-[1.43] font-['Inter',sans-serif] cursor-pointer shadow-sm transition-shadow hover:shadow-md"
              style={{
                background: module.color === "orange" ? ORANGE_GRADIENT : BLUE_GRADIENT,
              }}
            >
              {module.label}
            </motion.button>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
