import SectionBadge from "@/components/ui/SectionBadge";
import { Globe, Lightbulb, Users, TrendingUp } from "lucide-react";

export default function WhoWeAreSection() {
  return (
    <section className="w-full flex justify-center py-12 md:py-[80px] px-6 lg:px-[120px] bg-white">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-12">
        
        {/* Left Content */}
        <div className="flex flex-col gap-6 w-full max-w-[586px]">
          <div className="flex flex-col gap-3">
            <SectionBadge label="Who We Are" />
            <h2
              className="font-bold text-3xl lg:text-[38px] leading-[1.052] text-[#2251B5] mt-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Our Story
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[#4A5565] text-base lg:text-[18px] leading-relaxed font-['Inter',sans-serif]">
              Founded in 2010, Innovative Network started with a simple
              mission: to help businesses harness the power of technology to
              achieve extraordinary results.
            </p>
            <p className="text-[#4A5565] text-base lg:text-[18px] leading-relaxed font-['Inter',sans-serif]">
              Today, we've grown into a global leader in digital
              transformation, serving over 1000 clients across 50 countries.
              Our team of 200+ experts brings together deep technical
              expertise with industry knowledge to deliver solutions that
              drive real business value.
            </p>
            <p className="text-[#4A5565] text-base lg:text-[18px] leading-relaxed font-['Inter',sans-serif]">
              We believe in building long-term partnerships, not just
              delivering projects. Every solution we create is designed with
              your unique challenges and goals in mind.
            </p>
          </div>
        </div>

        {/* Right Content - Cards Grid */}
        <div className="flex flex-col sm:flex-row gap-6 lg:gap-6 w-full max-w-[592px] items-start">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6 lg:gap-[48px] w-full sm:w-[284px]">
            {/* Card 1: Global Reach */}
            <div className="flex flex-col justify-center px-8 h-[216px] rounded-[24px] shadow-sm transition-transform hover:-translate-y-1"
                 style={{ background: "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.7) 100%)" }}>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[24px] leading-[1.33] text-white font-['Inter',sans-serif] mb-1">
                Global Reach
              </h3>
              <p className="text-white/90 text-[16px] leading-normal font-['Inter',sans-serif]">
                Operating in 50+ countries worldwide
              </p>
            </div>

            {/* Card 2: Innovation */}
            <div className="flex flex-col justify-center px-8 h-[216px] rounded-[24px] shadow-sm transition-transform hover:-translate-y-1"
                 style={{ background: "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.7) 100%)" }}>
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[24px] leading-[1.33] text-white font-['Inter',sans-serif] mb-1">
                Innovation
              </h3>
              <p className="text-white/90 text-[16px] leading-normal font-['Inter',sans-serif]">
                Leading-edge technology solutions
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6 lg:gap-[24px] lg:pt-[48px] w-full sm:w-[284px]">
            {/* Card 3: Expert Team */}
            <div className="flex flex-col justify-center px-8 h-[192px] rounded-[24px] shadow-sm transition-transform hover:-translate-y-1"
                 style={{ background: "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.7) 100%)" }}>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[24px] leading-[1.33] text-white font-['Inter',sans-serif] mb-1">
                Expert Team
              </h3>
              <p className="text-white/90 text-[16px] leading-normal font-['Inter',sans-serif]">
                200+ specialized professionals
              </p>
            </div>

            {/* Card 4: Growth */}
            <div className="flex flex-col justify-center px-8 h-[192px] rounded-[24px] shadow-sm transition-transform hover:-translate-y-1"
                 style={{ background: "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.7) 100%)" }}>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[24px] leading-[1.33] text-white font-['Inter',sans-serif] mb-1">
                Growth
              </h3>
              <p className="text-white/90 text-[16px] leading-normal font-['Inter',sans-serif]">
                Delivering measurable results
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
