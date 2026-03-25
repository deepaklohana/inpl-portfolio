import { Metadata } from 'next';
import { Lightbulb, Layers, Presentation, LifeBuoy } from 'lucide-react';
import ServicesHero from '@/components/sections/ServicesHero';
import DevStatsBar from '@/components/sections/DevStatsBar';
import DetailedServicesGrid, { DetailedServiceItem } from '@/components/sections/DetailedServicesGrid';
import SimpleProcessSection, { ProcessStep } from '@/components/sections/SimpleProcessSection';
import ToolsWeUseSection, { ToolItem } from '@/components/sections/ToolsWeUseSection';
import ServicesCTASection from '@/components/sections/ServicesCTASection';

export const metadata: Metadata = {
  title: 'Consulting Services | Innovative Network',
  description: 'Expert guidance for your digital success. Navigate digital transformation with confidence.',
};

const consultingServices: DetailedServiceItem[] = [
  {
    id: "digital-strategy",
    title: "Digital Strategy",
    description: "Comprehensive digital transformation roadmaps tailored to your business objectives",
    icon: <Lightbulb className="w-8 h-8 text-white" />,
    iconBg: "bg-[#E96429]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#E96429]" />,
    features: [
      "Digital maturity assessment",
      "Technology roadmap creation",
      "Change management planning",
      "Innovation workshops",
      "KPI & metrics definition",
    ],
    techStack: ["Clear roadmap", "Stakeholder buy-in", "ROI projections", "Risk mitigation"],
    price: "$5,000",
    buttonVariant: "primary" as const,
    themePrimary: "#E96429",
    themeSecondary: "#FFEDE5",
    borderActive: "border-[#E96429]",
  },
  {
    id: "solution-architecture",
    title: "Solution Architecture",
    description: "Design scalable, secure system architectures that align with business goals",
    icon: <Layers className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "System architecture design",
      "Technology stack selection",
      "Scalability planning",
      "Security architecture",
      "Integration strategy",
    ],
    techStack: ["Architecture docs", "Technical specs", "Cost analysis", "Implementation plan"],
    price: "$8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "training-workshops",
    title: "Training & Workshops",
    description: "Upskill your team with customized training programs and hands-on workshops",
    icon: <Presentation className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Custom training programs",
      "Technical workshops",
      "Best practices training",
      "Certification prep",
      "Knowledge transfer",
    ],
    techStack: ["Skilled team", "Training materials", "Certifications", "Documentation"],
    price: "$8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "ongoing-support",
    title: "Ongoing Support",
    description: "Dedicated technical support and maintenance to keep your systems running smoothly",
    icon: <LifeBuoy className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "24/7 technical support",
      "Preventive maintenance",
      "Performance optimization",
      "Bug fixes & updates",
      "Emergency response",
    ],
    techStack: ["99.9% uptime", "Quick response", "Regular updates", "Peace of mind"],
    price: "$8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
];

const consultingProcessSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Consultation",
    description: "Deep dive into your business challenges and objectives",
    color: "orange",
  },
  {
    num: "02",
    title: "Analysis",
    description: "Comprehensive assessment of current state and opportunities",
    color: "blue",
  },
  {
    num: "03",
    title: "Recommendations",
    description: "Detailed action plan with prioritized recommendations",
    color: "orange",
  },
  {
    num: "04",
    title: "Implementation",
    description: "Hands-on support throughout execution and beyond",
    color: "blue",
  },
];

const consultingTools: ToolItem[] = [
  { name: "Cloud Strategy", category: "15+ years", iconPath: "/icons/consulting/cloud-strategy.svg" },
  { name: "Enterprise Architecture", category: "12+ years", iconPath: "/icons/consulting/enterprise-architecture.svg" },
  { name: "Digital Transformation", category: "10+ years", iconPath: "/icons/consulting/digital-transformation.svg" },
  { name: "Agile Methodology", category: "8+ years", iconPath: "/icons/consulting/agile-methodology.svg" },
  { name: "Security Compliance", category: "10+ years", iconPath: "/icons/consulting/security-compliance.svg" },
  { name: "Team Training", category: "12+ years", iconPath: "/icons/consulting/team-training.svg" },
  { name: "Performance Optimization", category: "10+ years", iconPath: "/icons/consulting/performance-optimization.svg" },
  { name: "Change Management", category: "8+ years", iconPath: "/icons/consulting/change-management.svg" },
];

export default function ConsultingServicesPage() {
  return (
    <>
      <ServicesHero
        badgeText="Consulting Services"
        badgeIcon={<div className="w-2 h-2 rounded-full bg-[#E96429]" />}
        title={
          <>
            Expert Guidance{'\n'}
            <span className="text-[#2251B5]">for Digital Success</span>
          </>
        }
        description="Navigate digital transformation with confidence. Our expert consultants provide strategic guidance, architecture design, team training, and ongoing support for lasting success."
        primaryButtonText="Book Consultation"
        secondaryButtonText="View Case Studies"
        showPartnerMarquee={false}
      />
      <DevStatsBar />
      <DetailedServicesGrid
        badgeLabel="Services"
        title="Consulting Services"
        description="Strategic guidance and hands-on support for your digital journey"
        featuresTitle="What We Deliver:"
        tagsTitle="Expected Outcomes:"
        services={consultingServices}
      />
      <SimpleProcessSection
        badge="Process"
        title="Our Consulting Process"
        subtitle="A proven methodology for delivering value"
        steps={consultingProcessSteps}
      />
      <ToolsWeUseSection 
        tools={consultingTools} 
      />
      <ServicesCTASection 
        title="Let's Transform Your Business Together"
        description="Get expert guidance to navigate your digital transformation journey"
        primaryButtonText="Schedule Free Consultation"
        secondaryButtonText="Explore All Services"
      />
    </>
  );
}

