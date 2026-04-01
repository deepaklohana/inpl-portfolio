"use client";

import {
  Check,
  ArrowRight,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";
import Link from "next/link";
import DynamicIcon from "@/components/ui/DynamicIcon";

export default function ProductSuiteSection({ products = [] }: { products?: any[] }) {
  return (
    <section className="w-full bg-[#FFFFFF] py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E96429]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-0 w-[400px] h-[400px] bg-[#2251B5]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 relative z-10 cursor-default">
        {/* Section Header */}
        <ScrollReveal variant="fadeUp">
          <SectionHeader
            badge="Products"
            title="Our Product Suite"
            subtitle="Powerful, integrated solutions for every aspect of your business"
            align="center"
            titleColor="#101828"
          />
        </ScrollReveal>

        {/* Cards Grid */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products.map((product, index) => {
            const topModules = product.modules?.slice(0, 3) || [];
            const moreCount = Math.max(0, (product.modules?.length || 0) - 3);

            return (
            <Link
              href={`/products/${product.slug}`}
              key={product.id || index}
              className="group flex flex-col p-8 rounded-3xl bg-white border border-[#E0E0E0] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_35px_-5px_rgba(233,100,41,0.15)] hover:border-[#E96429] cursor-pointer"
            >
              {/* Top Row: Icon and Users Badge */}
              <div className="flex justify-between items-start w-full mb-8">
                <div
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0 transition-colors duration-300 bg-[#2251B5] group-hover:bg-[#E96429] shadow-sm"
                >
                  <DynamicIcon name={product.icon || 'Box'} className="w-6 h-6 text-white" />
                </div>
                {product.userCount && (
                <div className="flex flex-col items-end gap-0">
                  <span className="font-bold text-[14px] leading-tight text-[#101828]">
                    {product.userCount}
                  </span>
                  <span className="text-[12px] leading-tight text-[#6A7282]">
                    Users
                  </span>
                </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2 mb-6">
                <h3 className="font-bold text-[22px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                  {product.fullName || product.name || 'Unnamed Product'}
                </h3>
                <h4 className="font-semibold text-[13px] text-[#2251B5] group-hover:text-[#E96429] transition-colors font-['Inter',sans-serif]">
                  {product.name}
                </h4>
                <p className="text-[#4A5565] text-[14px] leading-[1.6] font-['Inter',sans-serif] mt-1 line-clamp-3">
                  {product.shortDescription || product.description || 'No description available.'}
                </p>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-2.5 mb-8 grow">
                {topModules.map((moduleItem: any, fIndex: number) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <Check 
                      className="w-4 h-4 text-[#2251B5] group-hover:text-[#E96429] transition-colors shrink-0" 
                      strokeWidth={3} 
                    />
                    <span className="text-[13px] text-[#4A5565] font-['Inter',sans-serif] line-clamp-1">
                      {moduleItem.name}
                    </span>
                  </div>
                ))}
                {moreCount > 0 && (
                <div className="flex items-center mt-1">
                  <span className="text-[12px] italic text-[#8C8C8C] font-['Inter',sans-serif]">
                    +{moreCount} more features
                  </span>
                </div>
                )}
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
            </Link>
          )})}
        </StaggerReveal>
      </div>
    </section>
  );
}
