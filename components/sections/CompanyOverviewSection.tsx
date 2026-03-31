import Image from "next/image";
import { Star, Lightbulb, TrendingUp, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const highlights = [
  { text: "Expertise", icon: Star },
  { text: "Innovation", icon: Lightbulb },
  { text: "Scalable", icon: TrendingUp },
  { text: "Proven", icon: ShieldCheck },
];

export default function CompanyOverviewSection() {
  return (
    <section className="relative w-full py-16 md:py-[100px] px-6 lg:px-[120px] bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10 relative">
        {/* Text Content */}
        <ScrollReveal variant="slideLeft" className="flex flex-col gap-6 lg:gap-8">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center justify-center px-[13px] py-2 bg-[#E96429]/10 rounded-full border border-[#E96429]/0 transition-colors hover:border-[#E96429]/20">
              <span className="text-[#E96429] font-inter font-semibold text-[14px] leading-tight uppercase tracking-wider">
                About US
              </span>
            </div>
            
            <h2 
              className="text-[#101828] font-bold text-3xl md:text-[38px] lg:text-[44px] leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Pioneering Digital Excellence
            </h2>
          </div>

          <div className="flex flex-col gap-4 text-[#3C3C3B] font-inter text-base md:text-[18px] leading-relaxed">
            <p>
              Innovative Network is a premier digital solutions provider, committed to
              transforming businesses through cutting-edge technology and strategic
              expertise. As a parent company of multiple specialized digital products
              and services, we bring together innovation, experience, and dedication
              to deliver excellence across every engagement.
            </p>
            <p>
              Our mission is to empower organizations with integrated solutions that
              drive growth, efficiency, and competitive advantage in the digital landscape.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 lg:pt-6">
            {highlights.map((item, i) => (
              <div key={i} className="flex flex-col items-center sm:items-start gap-3">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-[#2251B5]/10 flex items-center justify-center text-[#2251B5] transition-transform hover:-translate-y-1 duration-300">
                  <item.icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <span className="text-[#101828] font-inter font-semibold text-base md:text-[18px]">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Image Content */}
        <ScrollReveal variant="slideRight" className="relative w-full aspect-square md:aspect-4/3 lg:aspect-588/531 rounded-2xl md:rounded-[24px] overflow-hidden shadow-xl lg:ml-auto">
          <div className="absolute inset-0 bg-gray-100 z-0" />
          <Image
            src="/images/sections/about-company.png"
            alt="Pioneering Digital Excellence"
            fill
            className="object-cover object-center transition-transform duration-700 hover:scale-105 z-10"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
