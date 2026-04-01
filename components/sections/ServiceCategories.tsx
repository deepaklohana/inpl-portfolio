"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import DynamicIcon from "@/components/ui/DynamicIcon";

type SubService = {
  name: string;
  description: string;
};

type ServiceItem = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  subServices: SubService[] | null;
};

interface ServiceCategoriesProps {
  services?: ServiceItem[];
}

export default function ServiceCategories({ services = [] }: ServiceCategoriesProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  useEffect(() => {
    if (services.length > 0 && !activeCategoryId) {
      setActiveCategoryId(services[0].slug);
    }
  }, [services, activeCategoryId]);

  const activeCategory = services.find((s) => s.slug === activeCategoryId) || services[0];

  if (!services || services.length === 0) {
    return (
      <section className="w-full bg-white py-20 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
          {/* Header */}
          <ScrollReveal variant="fadeUp" className="max-w-[672px] mx-auto">
            <SectionHeader
              badge="Categories"
              title="Service Categories"
              subtitle="Explore our comprehensive range of services across multiple domains"
              align="center"
              titleColor="#2251B5"
            />
          </ScrollReveal>
          
          <div className="text-center py-12 px-4 border border-dashed border-gray-300 rounded-2xl w-full text-gray-500 font-medium">
            No published services available at the moment. Please go to the admin panel and publish some services.
          </div>
        </div>
      </section>
    );
  }

  // Define colors to cycle for categories to maintain the design
  const colors = ["#E96429", "#2251B5"];

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
        {/* Header */}
        <ScrollReveal variant="fadeUp" className="max-w-[672px] mx-auto">
          <SectionHeader
            badge="Categories"
            title="Service Categories"
            subtitle="Explore our comprehensive range of services across multiple domains"
            align="center"
            titleColor="#2251B5"
          />
        </ScrollReveal>

        {/* Content Container */}
        <div className="flex flex-col lg:flex-row w-full gap-[53px] items-start lg:items-center justify-center">
          {/* Left Column: Categories List */}
          <ScrollReveal variant="slideLeft" className="flex flex-col w-full lg:w-[420px] gap-4 shrink-0">
            {services.map((category, index) => {
              const isActive = category.slug === activeCategoryId;
              const subCount = category.subServices?.length || 0;
              const categoryColor = colors[index % colors.length];

              return (
                <button
                  key={category.slug}
                  onClick={() => setActiveCategoryId(category.slug)}
                  className={`flex items-center justify-between px-6 py-[25px] rounded-3xl w-full text-left transition-all duration-300 ${
                    isActive
                      ? "bg-white border-2 border-[#E96429] shadow-[0px_15px_30px_-12px_rgba(0,0,0,0.15)] z-10 relative"
                      : "bg-white border-2 border-transparent shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.05)] hover:border-[#F3F4F6] hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div
                      className={`w-[64px] h-[64px] rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] ${
                        isActive
                          ? "bg-linear-to-br from-[#E96429] to-[#E96429]/80 text-white"
                          : "bg-[#F3F4F6]"
                      }`}
                      style={{ color: isActive ? "white" : categoryColor }}
                    >
                      <DynamicIcon name={category.icon || "Code"} className="w-8 h-8" strokeWidth={2} />
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3
                        className={`font-bold text-2xl font-['Inter',sans-serif] ${
                          isActive ? "text-[#E96429]" : "text-[#1F2937]"
                        }`}
                      >
                        {category.title}
                      </h3>
                      <p className="text-[#6A7282] font-medium text-sm font-['Inter',sans-serif]">
                        {subCount} Services Available
                      </p>
                    </div>
                  </div>
                  {/* Chevron Right */}
                  <div style={{ color: isActive ? "#E96429" : categoryColor }}>
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </button>
              );
            })}
          </ScrollReveal>

          {/* Right Column: Services List pane */}
          <ScrollReveal variant="slideRight" className="flex flex-col bg-white border-2 border-[#E96429]/25 rounded-3xl w-full max-w-[595px] overflow-hidden">
            {/* Pane Header */}
            <div className="flex flex-col px-[34px] pt-[32px] pb-6 gap-3">
              <h3 className="font-bold text-[30px] leading-[1.2] text-[#E96429] font-['Inter',sans-serif]">
                {activeCategory?.title} Services
              </h3>
              <div className="w-[80px] h-[4px] bg-[#E96429] rounded-full" />
            </div>

            {/* List of services for the active category */}
            <div className="flex flex-col px-[34px] pb-[34px] gap-6">
              {activeCategory?.subServices?.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between min-h-[90px] py-2 px-4 -mx-4 rounded-2xl hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Orange dot indicator */}
                    <div className="w-3 h-3 rounded-full bg-[#E96429] shrink-0" />
                    <div className="flex flex-col">
                      <h4 className="font-bold text-xl text-[#0A0A0A] font-['Inter',sans-serif] group-hover:text-[#2251B5] transition-colors">
                        {sub.name}
                      </h4>
                      <p className="text-[#4A5565] text-base leading-relaxed font-['Inter',sans-serif]">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#99A1AF] group-hover:text-[#E96429] transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              ))}

              {!activeCategory?.subServices?.length && (
                <div className="text-center py-8 text-[#6A7282] italic font-medium">
                  No sub-services available at the moment.
                </div>
              )}
              
              {/* Action Button */}
              {activeCategory && (
                <div className="mt-2 flex">
                  <Button 
                    href={`/services/${activeCategory.slug}`}
                    variant="primary" 
                    className="w-full"
                    icon={<ArrowRight className="w-5 h-5 ml-1" />}
                  >
                    View All {activeCategory.title} Services
                  </Button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
