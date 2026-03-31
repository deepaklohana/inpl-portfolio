"use client";

import { motion } from "framer-motion";
import { 
  Users, Calendar, FileText, CheckSquare, 
  TrendingUp, BarChart2, Briefcase, Award,
  Clock, Shield, Settings, Activity, Layers,
  Box, Database, PieChart, icons
} from "lucide-react";

const ICONS = [
  Users, Calendar, FileText, CheckSquare, 
  TrendingUp, BarChart2, Briefcase, Award,
  Clock, Shield, Settings, Activity, Layers,
  Box, Database, PieChart
];

// ── Component ──────────────────────────────────────────────────────────────
export default function ERPHRMSection({ 
  title, 
  description, 
  features,
  index = 0,
  id,
  shortCode,
}: { 
  title?: string; 
  description?: string | null; 
  features?: any[];
  index?: number;
  id?: string;
  shortCode?: string | null;
}) {
  const displayFeatures = features && features.length > 0
    ? features.map((f, i) => {
        const iconName = f.icon as keyof typeof icons;
        const DynamicIcon = iconName && icons[iconName] ? icons[iconName] : null;
        const FallbackIcon = ICONS[i % ICONS.length];
        const FinalIcon = (DynamicIcon || FallbackIcon) as any;
        
        return {
          iconVariant: i % 2 === 0 ? "orange" : "blue",
          title: f.name,
          description: f.shortDescription,
          icon: <FinalIcon className="text-white w-7 h-7" strokeWidth={1.5} />
        };
      })
    : [];

  if (!features || features.length === 0) {
    return null;
  }

  // Use shortCode from DB or fallback to initials
  const acronym = shortCode || (title 
    ? title.split(' ').filter(w => w.length > 0).map(w => w[0]).join('').toUpperCase().slice(0, 3)
    : "MOD");
  
  const pillText = acronym.length >= 2 ? acronym : "Module";
  const sectionBgColor = index % 2 === 0 ? "bg-[#F4F4F4]" : "bg-[#FFFFFF]";

  return (
    <section id={id} className={`w-full ${sectionBgColor} py-16 md:py-24 overflow-hidden border-t border-gray-100`}>
      <div className="max-w-[1232px] mx-auto px-4 md:px-8 lg:px-10 flex flex-col gap-14 md:gap-20">

        {/* Header - Centered as per Figma */}
        <div className="flex flex-col items-center justify-center gap-4 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="px-4 py-1.5 rounded-full bg-[#E96429]/10 text-[#E96429] font-semibold text-sm tracking-wide">
              {pillText}
            </div>
            <h2
              className="font-bold text-[32px] md:text-[38px] leading-[1.1] text-[#2251B5]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {title || "Module Overview"}
            </h2>
            <p
              className="text-base md:text-[20px] leading-relaxed text-[#4A5565]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {description || `Discover the core capabilities of the ${title || 'module'} designed to elevate your business operations.`}
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {displayFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-[#E0E0E0] rounded-2xl p-6 flex flex-col gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group h-full"
            >
              <div
                className={`w-[56px] h-[56px] rounded-[14px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                style={{
                  background: feature.iconVariant === "orange" 
                    ? "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.8) 100%)"
                    : "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.8) 100%)"
                }}
              >
                {feature.icon}
              </div>
              <div className="flex flex-col gap-3">
                <h3
                  className="font-bold text-[18px] text-[#101828]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed text-[#4A5565]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
