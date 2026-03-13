import { Lightbulb, Settings, TrendingUp, ShieldCheck, type LucideIcon } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";
import { IconFeatureCard } from "@/components/ui/Card";

// Figma: icon feature items gap 60px, each column-centered
const features: { icon: LucideIcon; label: string }[] = [
  { icon: Settings, label: "Expertise" },
  { icon: Lightbulb, label: "Innovation" },
  { icon: TrendingUp, label: "Scalable" },
  { icon: ShieldCheck, label: "Proven" },
];

export default function AboutSection() {
  return (
    // Figma: Section3, bg #FFFFFF, padding 80px 120px
    <section className="w-full flex justify-center py-12 md:py-[80px] px-6 lg:px-[120px] bg-white">
      {/* Figma: layout gap 24px between left-col and right-col image */}
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6">

        {/* Left Content — Figma: width 588, column gap 32px */}
        <div className="flex flex-col gap-8 w-full max-w-[588px]">

          {/* Top block — column gap 24px */}
          <div className="flex flex-col gap-6 w-full items-start">
            {/* Badge + heading — column gap 8px */}
            <div className="flex flex-col gap-2 w-full max-w-[500px]">
              {/* Figma: badge bg rgba(233,100,41,0.1), padding 8px 13px, rounded-full */}
              <SectionBadge label="About US" />
              {/* Figma: Plus Jakarta Sans 700, 38px, lh 1.052, tracking -3.15%, color #101828, left-aligned */}
              <h2
                className="text-[#101828] font-bold text-3xl lg:text-[38px] leading-[1.052] tracking-[-0.032em] text-left"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Pioneering Digital Excellence
              </h2>
            </div>

            {/* Paragraphs — Figma: Inter 400, 18px, lh 1.625, color #3C3C3B, column gap 12px */}
            <div className="flex flex-col gap-3 w-full">
              <p className="max-w-[581px] text-[#3C3C3B] text-base lg:text-[18px] leading-relaxed font-['Inter',sans-serif]">
                Innovative Network is a premier digital solutions provider, committed to
                transforming businesses through cutting-edge technology and strategic
                expertise. As a parent company of multiple specialized digital products
                and services, we bring together innovation, experience, and dedication
                to deliver excellence across every engagement.
              </p>
              <p className="max-w-[565px] text-[#3C3C3B] text-base lg:text-[18px] leading-relaxed font-['Inter',sans-serif]">
                Our mission is to empower organizations with integrated solutions that
                drive growth, efficiency, and competitive advantage in the digital
                landscape.
              </p>
            </div>
          </div>

          {/* Icon Feature Grid — Figma: row, gap 60px */}
          <div className="flex flex-wrap items-center gap-8 lg:gap-[60px]">
            {features.map((f) => (
              <IconFeatureCard key={f.label} icon={f.icon} label={f.label} />
            ))}
          </div>
        </div>

        {/* Right Image — Figma: 588×531 rounded-2xl */}
        <div className="w-full lg:w-[588px] h-[400px] lg:h-[531px] rounded-2xl overflow-hidden relative shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
            alt="Innovative Team"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
