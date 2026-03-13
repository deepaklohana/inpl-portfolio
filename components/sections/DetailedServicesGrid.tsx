"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";
import Button from "@/components/ui/Button";

export interface DetailedServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badgeIcon: React.ReactNode;
  features: string[];
  techStack: string[];
  price: string;
  buttonVariant: "primary" | "default" | "outline" | "ghost" | "link";
  themePrimary: string;
  themeSecondary: string;
  borderActive: string;
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
  featuresTitle = "Key Features:",
  tagsTitle = "Technologies:",
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
            label={badgeLabel} 
            icon={<div className="w-2 h-2 rounded-full bg-[#E96429]" />} 
          />
          <h2 className="font-bold text-[38px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
            {title}
          </h2>
          <p className="text-[18px] text-[#4A5565] font-['Inter',sans-serif] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-3xl p-8 border ${service.borderActive} ${index === 0 ? "shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] border-[#E96429]" : "border-[#E0E0E0] hover:border-[#E96429]/50 hover:shadow-lg transition-all"}`}
            >
              <div className="flex flex-col gap-6">
                {/* Header: Icon + Title + Desc */}
                <div className="flex flex-col gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.iconBg} shadow-sm`}>
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-[24px] text-[#101828] font-['Inter',sans-serif]">
                    {service.title}
                  </h3>
                  <p className="text-base text-[#4A5565] font-['Inter',sans-serif] leading-relaxed min-h-[48px]">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-4 mt-2">
                  <h4 className="font-semibold text-base text-[#101828] font-['Inter',sans-serif]">
                    {featuresTitle}
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#E96429] shrink-0 mt-0.5" />
                        <span className="text-[15px] text-[#4A5565] font-['Inter',sans-serif]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies / Tags */}
                <div className="flex flex-col gap-3 mt-4">
                  <h4 className="font-semibold text-base text-[#101828] font-['Inter',sans-serif]">
                    {tagsTitle}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.techStack.map((tech, tIndex) => (
                      <span
                        key={tIndex}
                        className={`text-[13px] font-medium font-['Inter',sans-serif] px-3 py-1.5 rounded-full ${index === 0 ? "bg-[#FFEDE5] text-[#E96429]" : "bg-[#F0F4FF] text-[#2251B5]"}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#EAEAEA] mt-4">
                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#6A7282] font-['Inter',sans-serif]">
                      Starting Price
                    </span>
                    <span className="font-bold text-[20px] text-[#101828] font-['Inter',sans-serif]">
                      Starting at {service.price}
                    </span>
                  </div>
                  
                  <Button 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    variant={service.buttonVariant as any}
                    icon={<ArrowRight className="w-5 h-5" />}
                    className={index !== 0 ? "bg-[#2251B5] text-white hover:bg-[#1E4399]" : ""}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
