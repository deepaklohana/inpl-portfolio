"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionBadge from "@/components/ui/SectionBadge";
import DynamicIcon from "@/components/ui/DynamicIcon";

export interface ToolItem {
  name: string;
  icon: string; // image URL or lucide icon name
}

export interface ToolCategory {
  name: string; // e.g. "Design"
  tools: ToolItem[];
}

export interface ToolsSection {
  heading?: string;
  description: string;
  categories: ToolCategory[];
}

interface ToolsWeUseSectionProps {
  data: ToolsSection;
}

export default function ToolsWeUseSection({ data }: ToolsWeUseSectionProps) {
  // Flatten tools to display in a single grid, attaching their category name
  const allTools = data.categories.flatMap((category) =>
    category.tools.map((tool) => ({
      ...tool,
      categoryName: category.name,
    }))
  );

  return (
    <section className="relative w-full bg-white py-20 px-4 md:px-8 overflow-hidden">
      {/* Decorative Ellipses */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:flex justify-center hidden opacity-50">
        <div className="relative w-[1440px] h-full max-w-full">
          <div className="absolute w-[343px] h-[307px] left-[-156px] top-[273px] bg-[rgba(34,81,181,0.2)] blur-[100px] rounded-full" />
          <div className="absolute w-[343px] h-[307px] left-[1148px] top-[45px] bg-[rgba(233,100,41,0.15)] blur-[100px] rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-[672px] mx-auto">
          <SectionBadge 
            label="Tools"
          />
          <h2 className="font-bold text-[38px] text-[#2251B5] font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
            {data.heading || "Tools We Use"}
          </h2>
          {data.description && (
            <p className="text-[18px] md:text-[20px] text-[#4A5565] font-['Inter',sans-serif] leading-[1.4em]">
              {data.description}
            </p>
          )}
        </div>

        {/* Tools Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {allTools.map((tool, index) => {
            const isImage =
              tool.icon?.startsWith("/") ||
              tool.icon?.startsWith("http") ||
              tool.icon?.endsWith(".svg") ||
              tool.icon?.endsWith(".png") ||
              tool.icon?.endsWith(".jpg");

            return (
              <motion.div
                key={`${tool.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-[16px] border border-[#E0E0E0] bg-white hover:border-[#E96429] hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 relative flex items-center justify-center mb-1">
                  {isImage ? (
                    <Image
                      src={tool.icon}
                      alt={`${tool.name} icon`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <DynamicIcon
                      name={tool.icon}
                      size={48}
                      className="text-[#2251B5] group-hover:text-[#E96429] transition-colors"
                    />
                  )}
                </div>
                <div className="text-center flex flex-col gap-1">
                  <h4 className="font-bold text-[16px] text-[#101828] font-['Inter',sans-serif] leading-[1.5em]">
                    {tool.name}
                  </h4>
                  <span className="text-[12px] text-[#6A7282] font-['Inter',sans-serif] leading-[1.333em]">
                    {tool.categoryName}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
