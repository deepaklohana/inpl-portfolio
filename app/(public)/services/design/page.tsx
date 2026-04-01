import { Metadata } from 'next';
import { Palette, Sparkles, Video, LayoutGrid } from 'lucide-react';
import ServicesHero from '@/components/sections/ServicesHero';
import DevStatsBar from '@/components/sections/DevStatsBar';
import DetailedServicesGrid from '@/components/sections/DetailedServicesGrid';
import SimpleProcessSection, { ProcessStep } from '@/components/sections/SimpleProcessSection';
import ToolsWeUseSection, { ToolsSection } from '@/components/sections/ToolsWeUseSection';
import ServicesCTASection from '@/components/sections/ServicesCTASection';

export const metadata: Metadata = {
  title: 'Design Services | Innovative Network',
  description: 'Create beautiful, user-centered experiences that captivate your audience.',
};

const designServices = [
  {
    id: "ui-ux",
    title: "UI/UX Design",
    description: "Create intuitive, user-centered interfaces that delight users and drive engagement",
    icon: <Palette className="w-8 h-8 text-white" />,
    iconBg: "bg-[#E96429]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#E96429]" />,
    features: [
      "User research & personas",
      "Wireframing & prototyping",
      "Usability testing",
      "Responsive design",
      "Design systems",
    ],
    techStack: ["Figma files", "Design system", "Prototypes", "Documentation"],
    price: "$5,000",
    buttonVariant: "primary" as const,
    themePrimary: "#E96429",
    themeSecondary: "#FFEDE5",
    borderActive: "border-[#E96429]",
  },
  {
    id: "branding",
    title: "Branding & Identity",
    description: "Build memorable brands with comprehensive identity systems that stand out",
    icon: <Sparkles className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Logo design & variations",
      "Color palette & typography",
      "Brand guidelines",
      "Marketing collateral",
      "Brand strategy",
    ],
    techStack: ["Logo files", "Brand book", "Templates", "Asset library"],
    price: "$8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "motion",
    title: "Motion Design",
    description: "Engaging animations and micro-interactions that bring your designs to life",
    icon: <Video className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "UI animations",
      "Micro-interactions",
      "Loading animations",
      "Explainer videos",
      "Interactive prototypes",
    ],
    techStack: ["Animation files", "Lottie files", "Video exports", "Code snippets"],
    price: "$8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "design-systems",
    title: "Design Systems",
    description: "Scalable design systems that ensure consistency across all platforms",
    icon: <LayoutGrid className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Component libraries",
      "Style guides",
      "Documentation",
      "Accessibility standards",
      "Version control",
    ],
    techStack: ["Component library", "Style guide", "Documentation", "Figma files"],
    price: "$8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
];

const designProcessSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Research & Discovery",
    description: "Understanding your users, competitors, and business goals",
    color: "orange",
  },
  {
    num: "02",
    title: "Ideation & Sketching",
    description: "Brainstorming concepts and exploring design directions",
    color: "blue",
  },
  {
    num: "03",
    title: "Design & Iteration",
    description: "Creating high-fidelity designs with user feedback loops",
    color: "orange",
  },
  {
    num: "04",
    title: "Handoff & Support",
    description: "Developer handoff with ongoing design support",
    color: "blue",
  },
];

const designToolsData: ToolsSection = {
  description: "Industry-leading design tools we use to bring your vision to life",
  categories: [
    {
      name: "Design Tools",
      tools: [
        { name: "Figma", icon: "/icons/tools/figma.svg" },
        { name: "Adobe XD", icon: "/icons/tools/adobe-xd.svg" },
        { name: "After Effects", icon: "/icons/tools/after-effects.svg" },
        { name: "Adobe Illustrator", icon: "/icons/tools/illustrator.svg" },
        { name: "Adobe Photoshop", icon: "/icons/tools/photoshop.svg" },
        { name: "InVision", icon: "/icons/tools/invision.svg" },
        { name: "Sketch", icon: "/icons/tools/sketch.svg" },
      ],
    },
  ],
};

export default function DesignServicesPage() {
  return (
    <>
      <ServicesHero
        badgeText="Design Services"
        badgeIcon={<Palette className="w-4 h-4 text-[#E96429]" />}
        title={
          <>
            Design That {'\n'}
            <span className="text-[#2251B5]">Inspire</span>
          </>
        }
        description="Create beautiful, user-cantered experiences that captivate your audience and drive business results. From UI/UX to branding, we craft designs that make an impact."
        primaryButtonText="Start Your Design"
        secondaryButtonText="View Portfolio"
        showPartnerMarquee={false}
      />
      <DevStatsBar />
      <DetailedServicesGrid
        badgeLabel="Services"
        title="Our Design Services"
        description="Comprehensive design solutions that elevate your brand"
        featuresTitle="What We Do:"
        tagsTitle="Deliverables:"
        services={designServices}
      />
      <SimpleProcessSection
        badge="Process"
        title="Our Design Process"
        subtitle="A collaborative approach that puts users first"
        steps={designProcessSteps}
      />
      <ToolsWeUseSection data={designToolsData} />
      <ServicesCTASection 
        title="Let's Create Something Beautiful"
        description="Transform your vision into stunning designs that users love"
        primaryButtonText="Start Your Design Project"
        secondaryButtonText="Explore All Services"
      />
    </>
  );
}
