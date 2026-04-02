"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";

export interface DetailedServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  techStack: string[];
}

interface DetailedServicesGridProps {
  badgeLabel: string;
  title: string;
  description: string;
  featuresTitle?: string;
  tagsTitle?: string;
  services: DetailedServiceItem[];
}

export default function DetailedServicesGrid({
  badgeLabel,
  title,
  description,
  featuresTitle = "What We Do:",
  tagsTitle = "Deliverables:",
  services,
}: DetailedServicesGridProps) {
  return (
    <section className="relative w-full bg-[#F9FAFB] py-20 px-4 md:px-8 overflow-hidden">
      {/* Decorative Ellipses */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:flex justify-center hidden opacity-50">
        <div className="relative w-[1440px] h-full max-w-full">
          <div className="absolute w-[343px] h-[307px] left-[-181px] top-[1401px] bg-[rgba(34,81,181,0.2)] blur-[100px] rounded-full" />
          <div className="absolute w-[343px] h-[307px] left-[1181px] top-[-38px] bg-[rgba(34,81,181,0.2)] blur-[100px] rounded-full" />
          <div className="absolute w-[343px] h-[307px] left-[-132px] top-[-56px] bg-[rgba(233,100,41,0.15)] blur-[100px] rounded-full" />
          <div className="absolute w-[343px] h-[307px] left-[1143px] top-[1425px] bg-[rgba(233,100,41,0.15)] blur-[100px] rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col gap-[180px]">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 max-w-[672px] mx-auto">
          <SectionBadge 
            label="Services"
          />
          <h2 className="font-bold text-[38px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
            {title}
          </h2>
          <p className="text-[18px] text-[#4A5565] font-['Inter',sans-serif] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-[24px] p-8 border border-[#E0E0E0] hover:border-[#E96429] hover:shadow-[0px_10px_20px_-5px_rgba(233,100,41,0.15)] transition-all duration-300"
            >
              <div className="flex flex-col gap-6">
                {/* 1. Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#2251B5] group-hover:bg-[#E96429] transition-colors duration-300 shadow-sm shrink-0">
                  {service.icon}
                </div>

                {/* 2. Title + Desc */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-[24px] text-[#101828] font-['Inter',sans-serif] leading-snug group-hover:text-[#E96429] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-[16px] text-[#4A5565] font-['Inter',sans-serif] leading-[1.625em] min-h-[52px]">
                    {service.description}
                  </p>
                </div>

                {/* 3. Features */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold text-[16px] text-[#101828] font-['Inter',sans-serif]">
                    {featuresTitle}
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-[8px]">
                        <Check 
                          className="w-5 h-5 shrink-0 text-[#2251B5] group-hover:text-[#E96429] transition-colors duration-300" 
                        />
                        <span className="text-[14px] text-[#4A5565] font-['Inter',sans-serif] leading-[1.428em]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Technologies / Tags */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold text-[16px] text-[#101828] font-['Inter',sans-serif]">
                    {tagsTitle}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.techStack.map((tech, tIndex) => (
                      <span
                        key={tIndex}
                        className="text-[12px] font-semibold font-['Inter',sans-serif] px-3 py-1.5 rounded-full inline-flex items-center justify-center leading-[1.333em] bg-[#F0F4FF] text-[#2251B5] group-hover:bg-[#FFEDE5] group-hover:text-[#E96429] transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

