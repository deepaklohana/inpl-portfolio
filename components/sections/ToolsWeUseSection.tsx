"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";

export interface ToolItem {
  name: string;
  category: string;
  iconPath: string;
}

interface ToolsWeUseSectionProps {
  tools: ToolItem[];
}

export default function ToolsWeUseSection({ tools }: ToolsWeUseSectionProps) {
  return (
    <section className="w-full bg-white py-20 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
        <SectionHeader
          badge="Tools"
          title="Tools We Use"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-[16px] border border-[#E0E0E0] hover:border-[#E96429] hover:shadow-lg transition-all bg-white"
            >
              <div className="w-12 h-12 relative flex items-center justify-center mb-1">
                <Image
                  src={tool.iconPath}
                  alt={`${tool.name} icon`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="text-center flex flex-col gap-1">
                <h3 className="font-bold text-base text-[#101828] font-['Inter',sans-serif]">
                  {tool.name}
                </h3>
                <p className="text-xs text-[#6A7282] font-['Inter',sans-serif]">
                  {tool.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
