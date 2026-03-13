"use client";

import { useState } from "react";
import { ChevronRight, Code, Palette, TrendingUp, Settings, Users, ArrowRight, type LucideIcon } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

type ServiceItem = {
  title: string;
  description: string;
};

type Category = {
  id: string;
  name: string;
  count: number;
  icon: LucideIcon;
  color: string;
  services: ServiceItem[];
};

const categoriesData: Category[] = [
  {
    id: "development",
    name: "Development",
    count: 4,
    icon: Code,
    color: "#E96429",
    services: [
      { title: "Web Development", description: "Full-stack solutions with modern frameworks" },
      { title: "Mobile Apps", description: "Native iOS and Android applications" },
      { title: "API Development", description: "RESTful and GraphQL APIs" },
      { title: "E-commerce", description: "Scalable online stores and marketplaces" },
    ],
  },
  {
    id: "design",
    name: "Design",
    count: 4,
    icon: Palette,
    color: "#2251B5",
    services: [
      { title: "UI/UX Design", description: "Intuitive and engaging user interfaces" },
      { title: "Brand Identity", description: "Cohesive branding and visual design" },
      { title: "Prototyping", description: "Interactive wireframes and prototypes" },
      { title: "Design Systems", description: "Scalable component libraries" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    count: 4,
    icon: TrendingUp,
    color: "#E96429",
    services: [
      { title: "SEO", description: "Search engine optimization strategies" },
      { title: "Content Marketing", description: "Engaging content creation" },
      { title: "Social Media", description: "Social platform management and growth" },
      { title: "Paid Advertising", description: "Targeted ad campaigns" },
    ],
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    count: 4,
    icon: Settings,
    color: "#2251B5",
    services: [
      { title: "Cloud Hosting", description: "Scalable cloud deployment setups" },
      { title: "DevOps", description: "CI/CD pipelines and automation" },
      { title: "Security", description: "Audits and vulnerability protection" },
      { title: "Database Architecture", description: "Optimized data storage solutions" },
    ],
  },
  {
    id: "consulting",
    name: "Consulting",
    count: 4,
    icon: Users,
    color: "#E96429",
    services: [
      { title: "Technical Strategy", description: "Roadmaps for digital transformation" },
      { title: "Architecture Review", description: "Evaluate and improve system design" },
      { title: "Agile Coaching", description: "Process improvements for teams" },
      { title: "Vendor Selection", description: "Guidance on technology partnerships" },
    ],
  },
];

export default function ServiceCategories() {
  const [activeCategoryId, setActiveCategoryId] = useState("development");

  const activeCategory = categoriesData.find((c) => c.id === activeCategoryId) || categoriesData[0];

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
        {/* Header */}
        <div className="max-w-[672px] mx-auto">
          <SectionHeader
            badge="Categories"
            title="Service Categories"
            subtitle="Explore our comprehensive range of services across multiple domains"
            align="center"
            titleColor="#2251B5"
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-col lg:flex-row w-full gap-[53px] items-start lg:items-center justify-center">
          {/* Left Column: Categories List */}
          <div className="flex flex-col w-full lg:w-[420px] gap-4 shrink-0">
            {categoriesData.map((category) => {
              const isActive = category.id === activeCategoryId;
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
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
                      style={{ color: isActive ? "white" : category.color }}
                    >
                      <Icon className="w-8 h-8" strokeWidth={2} />
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3
                        className={`font-bold text-2xl font-['Inter',sans-serif] ${
                          isActive ? "text-[#E96429]" : "text-[#1F2937]"
                        }`}
                      >
                        {category.name}
                      </h3>
                      <p className="text-[#6A7282] font-medium text-sm font-['Inter',sans-serif]">
                        {category.count} Services Available
                      </p>
                    </div>
                  </div>
                  {/* Chevron Right */}
                  <div style={{ color: isActive ? "#E96429" : category.color }}>
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Services List pane */}
          <div className="flex flex-col bg-white border-2 border-[#E96429]/25 rounded-3xl w-full max-w-[595px] overflow-hidden">
            {/* Pane Header */}
            <div className="flex flex-col px-[34px] pt-[32px] pb-6 gap-3">
              <h3 className="font-bold text-[30px] leading-[1.2] text-[#E96429] font-['Inter',sans-serif]">
                {activeCategory.name} Services
              </h3>
              <div className="w-[80px] h-[4px] bg-[#E96429] rounded-full" />
            </div>

            {/* List of services for the active category */}
            <div className="flex flex-col px-[34px] pb-[34px] gap-6">
              {activeCategory.services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between h-[90px] px-4 -mx-4 rounded-2xl hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Orange dot indicator */}
                    <div className="w-3 h-3 rounded-full bg-[#E96429] shrink-0" />
                    <div className="flex flex-col">
                      <h4 className="font-bold text-xl text-[#0A0A0A] font-['Inter',sans-serif] group-hover:text-[#2251B5] transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-[#4A5565] text-base leading-relaxed font-['Inter',sans-serif]">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#99A1AF] group-hover:text-[#E96429] transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              ))}
              
              {/* Action Button */}
              <div className="mt-2 flex">
                <Button 
                  href={`/services/${activeCategory.id}`}
                  variant="primary" 
                  className="w-full"
                  icon={<ArrowRight className="w-5 h-5 ml-1" />}
                >
                  View All {activeCategory.name} Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
