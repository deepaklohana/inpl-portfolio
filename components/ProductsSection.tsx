import React from 'react';
import {
  Server,
  TrendingUp,
  FileText,
  Users,
  Calendar,
  Headphones,
  ArrowRight
} from 'lucide-react';

const products = [
  {
    title: "Enterprise Resource Planning (ERP)",
    description: "Streamline operations with comprehensive resource management and real-time insights.",
    icon: Server,
    highlight: true,
  },
  {
    title: "Sales & Distribution (S&D)",
    description: "Optimize your sales pipeline and distribution channels for maximum efficiency.",
    icon: TrendingUp,
    highlight: false,
  },
  {
    title: "FBR Digital Invoicing",
    description: "Stay compliant with automated digital invoicing solutions.",
    icon: FileText,
    highlight: false,
  },
  {
    title: "Human Resources Management (HRM)",
    description: "Empower your workforce with modern HR solutions and analytics.",
    icon: Users,
    highlight: false,
  },
  {
    title: "Banquet Management System (BMS)",
    description: "Manage events and banquets seamlessly with our specialized platform.",
    icon: Calendar,
    highlight: false,
  },
  {
    title: "Customer Relationship Management (CRM)",
    description: "Build lasting relationships with powerful customer engagement tools.",
    icon: Headphones,
    highlight: false,
  }
];

export default function ProductsSection() {
  return (
    <section className="w-full bg-[#F5F5F5] py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Ellipses */}
      <div className="absolute left-0 bottom-[-10%] w-[343px] h-[307px] bg-[#E96429] opacity-15 blur-[300px] rounded-full pointer-events-none"></div>
      <div className="absolute right-[-5%] top-[-5%] w-[343px] h-[307px] bg-[#2251B5] opacity-15 blur-[300px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-3 text-center max-w-[672px]">
          <div className="inline-flex items-center justify-center bg-[#E96429]/10 text-[#E96429] px-4 py-2 rounded-full">
            <span className="font-semibold  text-sm font-sans tracking-wide">Our Products</span>
          </div>
          <h2 className="text-[#2251B5] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-3xl md:text-[38px] leading-[1.05]">
            Explore Our Digital Mastery Portfolio
          </h2>
          <p className="text-[#3C3C3B] font-sans text-base md:text-[18px] leading-[1.55]">
            Comprehensive solutions designed to transform your business operations
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products.map((product, index) => {
            const Icon = product.icon;
            
            return (
              <div
                key={index}
                className={`flex flex-col p-6 md:p-8 rounded-[14px] transition-all duration-300 hover:-translate-y-1 ${
                  product.highlight
                    ? 'bg-[#FFF7F4] border border-[#E96429] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]'
                    : 'bg-white border border-[#E0E0E0] hover:shadow-md'
                }`}
              >
                <div className="flex flex-col h-full gap-6">
                  {/* Icon Area */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${
                      product.highlight ? 'bg-[#E96429]/10 text-[#E96429]' : 'bg-[#2251B5]/10 text-[#2251B5]'
                    }`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex flex-col gap-3 grow">
                    <h3 className={`font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] leading-[1.4] ${
                      product.highlight ? 'text-[#E96429]' : 'text-[#2251B5]'
                    }`}>
                      {product.title}
                    </h3>
                    <p className="font-sans text-[#3C3C3B] text-[14px] leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* Button Area */}
                  <div className="mt-auto pt-4">
                    <button className={`flex items-center gap-1.5 font-sans font-medium text-[16px] leading-normal group ${
                      product.highlight ? 'text-[#E96429]' : 'text-[#2251B5]'
                    }`}>
                      Learn More
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
