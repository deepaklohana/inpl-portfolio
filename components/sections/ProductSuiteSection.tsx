"use client";

import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  FileText,
  Box,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface Feature {
  label: string;
}

interface ProductDetail {
  title: string;
  subtitle: string;
  description: string;
  users: string;
  icon: LucideIcon;
  features: Feature[];
  moreCount: number;
}

const products: ProductDetail[] = [
  {
    title: "HRM System",
    subtitle: "Complete Human Resource Management",
    description:
      "Streamline your HR operations with our comprehensive HRM solution covering attendance, payroll, leaves, and employee management.",
    users: "10K+",
    icon: Users,
    features: [
      { label: "Attendance Tracking" },
      { label: "Payroll Management" },
      { label: "Leave Management" },
    ],
    moreCount: 2,
  },
  {
    title: "ERP Solution",
    subtitle: "Enterprise Resource Planning",
    description:
      "Integrated business management platform that connects all departments and streamlines operations across your organization.",
    users: "15K+",
    icon: Building2,
    features: [
      { label: "Inventory Control" },
      { label: "Financial Management" },
      { label: "Supply Chain" },
    ],
    moreCount: 2,
  },
  {
    title: "Banquet Management",
    subtitle: "Event & Venue Management",
    description:
      "Complete banquet and event management system for bookings, catering, billing, and event coordination.",
    users: "5K+",
    icon: Calendar,
    features: [
      { label: "Event Booking" },
      { label: "Menu Management" },
      { label: "Guest Management" },
    ],
    moreCount: 2,
  },
  {
    title: "S&D System",
    subtitle: "Sales & Distribution",
    description:
      "Powerful sales and distribution management system for order processing, inventory, and route management.",
    users: "8K+",
    icon: TrendingUp,
    features: [
      { label: "Order Management" },
      { label: "Route Planning" },
      { label: "Distributor Portal" },
    ],
    moreCount: 2,
  },
  {
    title: "FBR Digital Invoicing",
    subtitle: "Tax Compliant Invoicing",
    description:
      "FBR compliant digital invoicing system with automated tax calculations and seamless integration.",
    users: "10K+",
    icon: FileText,
    features: [
      { label: "FBR Integration" },
      { label: "Auto Tax Calculation" },
      { label: "E-Invoicing" },
    ],
    moreCount: 2,
  },
  {
    title: "Asset Management",
    subtitle: "Complete Asset Tracking",
    description:
      "Track, maintain, and manage all your company assets with depreciation, maintenance, and lifecycle management.",
    users: "6K+",
    icon: Box,
    features: [
      { label: "Asset Tracking" },
      { label: "Maintenance Scheduling" },
      { label: "Depreciation" },
    ],
    moreCount: 2,
  },
];

export default function ProductSuiteSection() {
  return (
    <section className="w-full bg-[#FFFFFF] py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E96429]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-0 w-[400px] h-[400px] bg-[#2251B5]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 relative z-10 cursor-default">
        {/* Section Header */}
        <SectionHeader
          badge="Products"
          title="Our Product Suite"
          subtitle="Powerful, integrated solutions for every aspect of your business"
          align="center"
          titleColor="#101828"
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products.map((product, index) => (
            <div
              key={index}
              className="group flex flex-col p-8 rounded-3xl bg-white border border-[#E0E0E0] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_35px_-5px_rgba(233,100,41,0.15)] hover:border-[#E96429] cursor-pointer"
            >
              {/* Top Row: Icon and Users Badge */}
              <div className="flex justify-between items-start w-full mb-8">
                <div
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0 transition-colors duration-300 bg-[#2251B5] group-hover:bg-[#E96429] shadow-sm"
                >
                  <product.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col items-end gap-0">
                  <span className="font-bold text-[14px] leading-tight text-[#101828]">
                    {product.users}
                  </span>
                  <span className="text-[12px] leading-tight text-[#6A7282]">
                    Users
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2 mb-6">
                <h3 className="font-bold text-[22px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                  {product.title}
                </h3>
                <h4 className="font-semibold text-[13px] text-[#2251B5] group-hover:text-[#E96429] transition-colors font-['Inter',sans-serif]">
                  {product.subtitle}
                </h4>
                <p className="text-[#4A5565] text-[14px] leading-[1.6] font-['Inter',sans-serif] mt-1 line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-2.5 mb-8 grow">
                {product.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <Check 
                      className="w-4 h-4 text-[#2251B5] group-hover:text-[#E96429] transition-colors shrink-0" 
                      strokeWidth={3} 
                    />
                    <span className="text-[13px] text-[#4A5565] font-['Inter',sans-serif]">
                      {feature.label}
                    </span>
                  </div>
                ))}
                <div className="flex items-center mt-1">
                  <span className="text-[12px] italic text-[#8C8C8C] font-['Inter',sans-serif]">
                    +{product.moreCount} more features
                  </span>
                </div>
              </div>

              {/* CTA Link */}
              <div className="mt-auto pt-5 flex items-center gap-1.5 group/btn">
                <span className="font-bold text-[14px] text-[#2251B5] group-hover:text-[#E96429] transition-colors font-['Inter',sans-serif]">
                  View Details
                </span>
                <ArrowRight 
                  strokeWidth={2.5}
                  className="w-4 h-4 text-[#2251B5] group-hover:text-[#E96429] transition-colors transform group-hover/btn:translate-x-1" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
