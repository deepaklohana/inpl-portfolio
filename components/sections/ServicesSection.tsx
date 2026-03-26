import {
  Code2,
  Palette,
  BarChart3,
  Smartphone,
  Cloud,
  HeadphonesIcon,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/ui/Card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";

// ─── Figma: Section 5 — "Our Services" ───────────────────────────────────────
// Layout: 1440px wide, padding 80px 120px, col gap 48px
// Header: center-aligned, 672px max-width
// Cards grid: row wrap, gap 24px — 3 columns on desktop
// First card: highlighted (bg #FFF7F4, border #E96429, shadow)
// Remaining 5: standard (bg #FFFFFF, border #E0E0E0)
// Button label: "Explore Services →"

interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight?: boolean;
}

const services: Service[] = [
  {
    title: "Custom Development",
    description:
      "Tailored software solutions built with cutting-edge technologies to meet your unique business needs.",
    icon: Code2,
    highlight: true,
  },
  {
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces that enhance user experience and drive engagement.",
    icon: Palette,
  },
  {
    title: "Digital Marketing",
    description:
      "Data-driven strategies to boost your online presence and maximize ROI.",
    icon: BarChart3,
  },
  {
    title: "Mobile Solutions",
    description:
      "Native and cross-platform mobile apps that deliver exceptional performance.",
    icon: Smartphone,
  },
  {
    title: "Cloud Infrastructure",
    description:
      "Scalable, secure cloud architecture designed for high availability and performance.",
    icon: Cloud,
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock expert support to ensure your operations run smoothly.",
    icon: HeadphonesIcon,
  },
];

export default function ServicesSection() {
  return (
    <section className="w-full bg-white py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Figma: Ellipse 3 — orange glow top-right, rgba(233,100,41,0.15) blur 300px */}
      <div
        className="absolute top-5 right-[232px] w-[343px] h-[307px] rounded-full pointer-events-none"
        style={{
          background: "rgba(233, 100, 41, 0.15)",
          filter: "blur(300px)",
        }}
      />

      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 relative z-10">
        {/* Section Header — reuses existing SectionHeader + SectionBadge */}
        <ScrollReveal variant="fadeUp">
          <SectionHeader
            badge="Our Services"
            title={"Comprehensive Solutions\nfor Every Need"}
            subtitle="From concept to deployment and beyond, our full-stack services cover every aspect of your digital journey with excellence and innovation."
            align="center"
            titleColor="#2251B5"
          />
        </ScrollReveal>
        {/* Cards Grid — 3 col desktop, 2 col tablet, 1 col mobile */}
        {/* Figma: row wrap, gap 24px, each card 384px wide */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {services.map((service, index) => (
            <ProductCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              highlight={service.highlight}
              buttonLabel="Explore Services"
            />
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
