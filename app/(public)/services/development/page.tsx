import { Code, Smartphone, Database, ShoppingCart } from "lucide-react";
import ServicesHero from "@/components/sections/ServicesHero";
import DevStatsBar from "@/components/sections/DevStatsBar";
import DetailedServicesGrid from "@/components/sections/DetailedServicesGrid";
import TechMasterySection from "@/components/sections/TechMasterySection";
import ServicesCTASection from "@/components/sections/ServicesCTASection";
import SimpleProcessSection, { ProcessStep } from "@/components/sections/SimpleProcessSection";

const developmentServices = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Build powerful, scalable web applications with modern frameworks and technologies",
    icon: <Code className="w-8 h-8 text-white" />,
    iconBg: "bg-[#E96429]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#E96429]" />,
    features: [
      "React, Vue, Angular expertise",
      "Node.js & Python backends",
      "Progressive Web Apps (PWA)",
      "Real-time applications",
      "Microservices architecture",
    ],
    techStack: ["React", "Next.js", "Node.js", "Django", "PostgreSQL"],
    price: "$5,000",
    buttonVariant: "primary" as const,
    themePrimary: "#E96429",
    themeSecondary: "#FFEDE5",
    borderActive: "border-[#E96429]",
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    description: "Native iOS and Android applications that deliver exceptional user experiences",
    icon: <Smartphone className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Native iOS (Swift)",
      "Native Android (Kotlin)",
      "Cross-platform (React Native)",
      "App Store optimization",
      "Push notifications & Analytics",
    ],
    techStack: ["Swift", "Kotlin", "React Native", "Firebase", "Redux"],
    price: "$8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "api-dev",
    title: "API Development",
    description: "RESTful and GraphQL APIs designed for performance, security, and scalability",
    icon: <Database className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "RESTful API design",
      "GraphQL implementation",
      "API documentation (Swagger)",
      "Authentication & Authorization",
      "Rate limiting & caching",
    ],
    techStack: ["Express", "FastAPI", "GraphQL", "JWT", "Redis"],
    price: "$3,500",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "ecommerce",
    title: "E-commerce Solutions",
    description: "Complete online stores and marketplaces with payment integration and inventory management",
    icon: <ShoppingCart className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Custom e-commerce platforms",
      "Payment gateway integration",
      "Inventory management systems",
      "Multi-vendor marketplaces",
      "Sales analytics & reporting",
    ],
    techStack: ["Shopify", "WooCommerce", "Stripe", "Magento", "Elasticsearch"],
    price: "$6,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
];

const developmentTechData = {
  heading: "Technologies We Master",
  categories: [
    {
      name: "Frontend",
      items: ["React", "Next.js", "Vue.js", "Angular", "TypeScript"],
    },
    {
      name: "Backend",
      items: ["Node.js", "Python", "Django", "FastAPI", "Express"],
    },
    {
      name: "Mobile",
      items: ["React Native", "Swift", "Kotlin", "Flutter"],
    },
    {
      name: "Database",
      items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    },
  ],
};

const developmentProcessSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Discovery & Planning",
    description: "We analyze your requirements and create a detailed project roadmap",
    color: "orange",
  },
  {
    num: "02",
    title: "Design & Architecture",
    description: "Our team designs the system architecture and user interfaces",
    color: "blue",
  },
  {
    num: "03",
    title: "Development & Testing",
    description: "Agile development with continuous testing and quality assurance",
    color: "orange",
  },
  {
    num: "04",
    title: "Deployment & Support",
    description: "Smooth deployment and ongoing maintenance and support",
    color: "blue",
  },
];

export default function DevelopmentServicesPage() {
  return (
    <>
      <ServicesHero
        badgeText="Development Services"
        badgeIcon={<Code className="w-4 h-4 text-[#101828]" />}
        title={"Development\nExcellence"}
        description="Transform your ideas into powerful, scalable applications with our expert development team. From web and mobile to APIs and e-commerce, we build solutions that drive results."
        primaryButtonText="Start Your Project"
        secondaryButtonText="View Portfolio"
        showPartnerMarquee={false}
      />
      <DevStatsBar />
      <DetailedServicesGrid
        badgeLabel="Services"
        title="Our Development Services"
        description="Comprehensive development solutions tailored to your business needs"
        services={developmentServices}
      />
      <SimpleProcessSection
        badge="Process"
        title="Our Development Process"
        subtitle="A proven methodology that ensures quality and timely delivery"
        steps={developmentProcessSteps}
      />
      <TechMasterySection data={developmentTechData} />
      <ServicesCTASection 
        title="Ready to Build Something Amazing?"
        description="Let's turn your ideas into powerful applications"
        primaryButtonText="Start Your Project"
        secondaryButtonText="View Portfolio"
      />
    </>
  );
}
