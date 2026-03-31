"use client";

import { motion } from "framer-motion";


const ORANGE_ICON_BG =
  "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.8) 100%)";
const BLUE_ICON_BG =
  "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.8) 100%)";

import { icons } from "lucide-react";

// ── Component ──────────────────────────────────────────────────────────────
export default function ERPWhyChooseSection({ 
  title, 
  description, 
  points,
  pillText
}: { 
  title?: string | null; 
  description?: string | null; 
  points?: any[] | null; 
  pillText?: string | null;
}) {
  const finalPillText = pillText ? pillText.toUpperCase() : "Why Choose Us";

  const displayFeatures = points && points.length > 0
    ? points.map((p, i) => {
        const iconName = p.icon as keyof typeof icons;
        const DynamicIcon = iconName && icons[iconName] ? icons[iconName] : null;
        
        return {
          iconVariant: i % 2 === 0 ? "orange" : "blue",
          title: p.title || p.name || "",
          description: p.description || p.shortDescription || "",
          icon: DynamicIcon 
            ? <DynamicIcon className="text-white w-8 h-8" strokeWidth={1.5} /> 
            : <div className="w-8 h-8 rounded-full border-2 border-white/50" />
        };
      })
    : [];

  return (
    <section
      className="w-full py-16 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, rgba(34, 81, 181, 0.1) 0%, rgba(233, 100, 41, 0.1) 100%)",
      }}
    >
      <div className="max-w-[1234px] mx-auto px-4 md:px-8 lg:px-10 flex flex-col items-center gap-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 max-w-[672px] text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-[13px] py-2 rounded-full bg-[rgba(233,100,41,0.1)]">
            <span
              className="text-[14px] font-semibold leading-[1.43] text-[#E96429]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {finalPillText}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-bold text-[28px] md:text-[38px] leading-[1.05] text-[#2251B5]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title || "Why Choose Our Solution?"}
          </h2>

          {/* Subtitle */}
          <p
            className="text-base md:text-[20px] leading-[1.4] text-[#4A5565]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {description || "Experience the difference with our comprehensive, user-friendly, and scalable system"}
          </p>
        </motion.div>

        {/* ── Feature Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full auto-rows-fr">
          {displayFeatures.map((feature: any, i: number) => (
            <motion.div
              key={feature.title + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.06 * i }}
              whileHover={{ y: -4, boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.12)" }}
              className="flex flex-col gap-4 p-8 bg-white border border-[#E0E0E0] rounded-2xl transition-all duration-300 cursor-default h-full"
            >
              {/* Icon — 64×64 */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    feature.iconVariant === "orange" ? ORANGE_ICON_BG : BLUE_ICON_BG,
                }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                className="font-bold text-[20px] leading-[1.4] text-[#101828]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="text-[16px] leading-relaxed text-[#4A5565]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
