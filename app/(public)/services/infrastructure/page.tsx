import { Metadata } from 'next';
import { Cloud, Cog, Activity, ShieldCheck } from 'lucide-react';
import ServicesHero from '@/components/sections/ServicesHero';
import DevStatsBar from '@/components/sections/DevStatsBar';
import DetailedServicesGrid from '@/components/sections/DetailedServicesGrid';
import SimpleProcessSection, { ProcessStep } from '@/components/sections/SimpleProcessSection';
import ToolsWeUseSection, { ToolItem } from '@/components/sections/ToolsWeUseSection';
import ServicesCTASection from '@/components/sections/ServicesCTASection';

export const metadata: Metadata = {
  title: 'Infrastructure Services | Innovative Network',
  description: 'Build robust, scalable infrastructure with expert cloud migration, DevOps automation, and 24/7 monitoring.',
};

const infrastructureServices = [
  {
    id: "cloud-migration",
    title: "Cloud Migration",
    description: "Seamlessly migrate your infrastructure to the cloud with zero downtime and maximum efficiency",
    icon: <Cloud className="w-8 h-8 text-white" />,
    iconBg: "bg-[#E96429]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#E96429]" />,
    features: [
      "AWS, Azure, GCP expertise",
      "Migration planning & strategy",
      "Data transfer & validation",
      "Legacy system modernization",
      "Post-migration optimization",
    ],
    techStack: ["AWS", "Azure", "Google Cloud", "DigitalOcean"],
    price: "Starting at $5,000",
    buttonVariant: "primary" as const,
    themePrimary: "#E96429",
    themeSecondary: "#FFEDE5",
    borderActive: "border-[#E96429]",
  },
  {
    id: "devops-services",
    title: "DevOps Services",
    description: "Implement CI/CD pipelines and automation to accelerate your development lifecycle",
    icon: <Cog className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "CI/CD pipeline setup",
      "Infrastructure as Code",
      "Container orchestration",
      "Automated testing",
      "Release management",
    ],
    techStack: ["Jenkins", "GitLab CI", "GitHub Actions", "CircleCI"],
    price: "Starting at $8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "monitoring-observability",
    title: "Monitoring & Observability",
    description: "24/7 system monitoring with real-time alerts and comprehensive logging",
    icon: <Activity className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Application performance monitoring",
      "Log aggregation & analysis",
      "Real-time alerting",
      "Custom dashboards",
      "Incident management",
    ],
    techStack: ["Datadog", "New Relic", "Prometheus", "Grafana"],
    price: "Starting at $8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "security-compliance",
    title: "Security & Compliance",
    description: "Comprehensive security solutions to protect your infrastructure and ensure compliance",
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Security audits & assessments",
      "Penetration testing",
      "Compliance management",
      "Vulnerability scanning",
      "Security training",
    ],
    techStack: ["SOC 2", "ISO 27001", "GDPR", "HIPAA"],
    price: "Starting at $8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
];

const infrastructureProcessSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Assessment",
    description: "Evaluate current infrastructure and identify improvement areas",
    color: "orange",
  },
  {
    num: "02",
    title: "Planning",
    description: "Design architecture and create implementation roadmap",
    color: "blue",
  },
  {
    num: "03",
    title: "Implementation",
    description: "Execute migration and setup with minimal disruption",
    color: "orange",
  },
  {
    num: "04",
    title: "Optimization",
    description: "Monitor, optimize, and provide ongoing support",
    color: "blue",
  },
];

const infrastructureTools: ToolItem[] = [
  { name: "AWS", category: "Cloud Platforms", iconPath: "/icons/infrastructure/aws.svg" },
  { name: "Azure", category: "Cloud Platforms", iconPath: "/icons/infrastructure/azure.svg" },
  { name: "Google Cloud", category: "Cloud Platforms", iconPath: "/icons/infrastructure/gcp.svg" },
  { name: "DigitalOcean", category: "Cloud Platforms", iconPath: "/icons/infrastructure/digitalocean.svg" },
  { name: "Docker", category: "DevOps Tools", iconPath: "/icons/infrastructure/docker.svg" },
  { name: "Kubernetes", category: "DevOps Tools", iconPath: "/icons/infrastructure/kubernetes.svg" },
  { name: "Terraform", category: "DevOps Tools", iconPath: "/icons/infrastructure/terraform.svg" },
  { name: "Jenkins", category: "DevOps Tools", iconPath: "/icons/infrastructure/jenkins.svg" },
];

export default function InfrastructureServicesPage() {
  return (
    <>
      <ServicesHero
        badgeText="Infrastructure Services"
        badgeIcon={<Cloud className="w-4 h-4 text-[#E96429]" />}
        title={
          <>
            Infrastructure{'\n'}
            <span className="text-[#2251B5]">Excellence</span>
          </>
        }
        description="Build robust, scalable infrastructure with expert cloud migration, DevOps automation, and 24/7 monitoring. Power your applications with enterprise-grade reliability."
        primaryButtonText="Get Infrastructure Audit"
        secondaryButtonText="View Case Studies"
        showPartnerMarquee={false}
      />
      <DevStatsBar />
      <DetailedServicesGrid
        badgeLabel="Services"
        title="Infrastructure Services"
        description="Enterprise-grade infrastructure solutions for maximum reliability"
        featuresTitle="What We Do:"
        tagsTitle="Platforms & Tools:"
        services={infrastructureServices}
      />
      <SimpleProcessSection
        badge="Process"
        title="Our Infrastructure Process"
        subtitle="A systematic approach to infrastructure excellence"
        steps={infrastructureProcessSteps}
      />
      <ServicesCTASection 
        title="Ready to Scale Your Infrastructure?"
        description="Let's build a robust, secure infrastructure that powers your growth"
        primaryButtonText="Schedule Assessment"
        secondaryButtonText="Explore All Services"
      />
    </>
  );
}

