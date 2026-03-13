import { Metadata } from 'next';
import { Search, FileText, Share2, Target } from 'lucide-react';
import ServicesHero from '@/components/sections/ServicesHero';
import DevStatsBar from '@/components/sections/DevStatsBar';
import DetailedServicesGrid from '@/components/sections/DetailedServicesGrid';
import SimpleProcessSection, { ProcessStep } from '@/components/sections/SimpleProcessSection';
import ToolsWeUseSection, { ToolItem } from '@/components/sections/ToolsWeUseSection';
import ServicesCTASection from '@/components/sections/ServicesCTASection';

export const metadata: Metadata = {
  title: 'Marketing Services | Innovative Network',
  description: 'Marketing That Delivers Results - SEO, Content, Social Media, and PPC Advertising.',
};

const marketingServices = [
  {
    id: "seo",
    title: "SEO Services",
    description: "Boost your search rankings and drive qualified organic traffic to your website",
    icon: <Search className="w-8 h-8 text-white" />,
    iconBg: "bg-[#E96429]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#E96429]" />,
    features: [
      "Keyword research & analysis",
      "On-page optimization",
      "Technical SEO audits",
      "Link building campaigns",
      "Local SEO optimization",
    ],
    techStack: ["Traffic Growth", "Ranking Improvement", "Conversion Rate", "ROI Tracking"],
    price: "Starting at $5,000",
    buttonVariant: "primary" as const,
    themePrimary: "#E96429",
    themeSecondary: "#FFEDE5",
    borderActive: "border-[#E96429]",
  },
  {
    id: "content-marketing",
    title: "Content Marketing",
    description: "Engage your audience with compelling stories and valuable content",
    icon: <FileText className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Content strategy development",
      "Blog writing & optimization",
      "Video content production",
      "Infographics & visuals",
      "Editorial calendar management",
    ],
    techStack: ["Engagement Rate", "Lead Generation", "Brand Awareness", "Content Performance"],
    price: "Starting at $8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "social-media",
    title: "Social Media Marketing",
    description: "Build brand awareness and connect with your audience across platforms",
    icon: <Share2 className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Social media strategy",
      "Content creation & posting",
      "Community management",
      "Influencer partnerships",
      "Social advertising",
    ],
    techStack: ["Follower Growth", "Engagement Rate", "Reach & Impressions", "Social ROI"],
    price: "Starting at $8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
  {
    id: "ppc",
    title: "PPC Advertising",
    description: "Drive immediate results and maximize ROI with targeted ad campaigns",
    icon: <Target className="w-8 h-8 text-white" />,
    iconBg: "bg-[#2251B5]",
    badgeIcon: <div className="w-2 h-2 rounded-full bg-[#2251B5]" />,
    features: [
      "Campaign strategy & setup",
      "Google Ads management",
      "Facebook & Instagram ads",
      "Display advertising",
      "A/B testing & optimization",
    ],
    techStack: ["Click-Through Rate", "Cost Per Click", "Conversion Rate", "ROAS"],
    price: "Starting at $8,000",
    buttonVariant: "default" as const,
    themePrimary: "#2251B5",
    themeSecondary: "#F0F4FF",
    borderActive: "border-[#E0E0E0]",
  },
];

const marketingProcessSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Audit & Analysis",
    description: "In-depth review of your current marketing efforts and market landscape",
    color: "orange",
  },
  {
    num: "02",
    title: "Strategy Development",
    description: "Crafting a customized, data-driven marketing plan",
    color: "blue",
  },
  {
    num: "03",
    title: "Campaign Execution",
    description: "Implementing strategies across selected digital channels",
    color: "orange",
  },
  {
    num: "04",
    title: "Optimize & Scale",
    description: "Continuous monitoring, A/B testing, and performance scaling",
    color: "blue",
  },
];

const marketingTools: ToolItem[] = [
  { name: "Google Ads", category: "search", iconPath: "/icons/marketing/google-ads.svg" },
  { name: "Facebook", category: "Social", iconPath: "/icons/marketing/facebook.svg" },
  { name: "LinkedIn", category: "B2B", iconPath: "/icons/marketing/linkedin.svg" },
  { name: "Twitter/X", category: "Social", iconPath: "/icons/marketing/twitter.svg" },
  { name: "TikTok", category: "Social", iconPath: "/icons/marketing/tiktok.svg" },
  { name: "YouTube", category: "Video", iconPath: "/icons/marketing/youtube.svg" },
  { name: "Pinterest", category: "Visual", iconPath: "/icons/marketing/pinterest.svg" },
  { name: "Instagram", category: "Social", iconPath: "/icons/marketing/instagram.svg" },
];

export default function MarketingServicesPage() {
  return (
    <>
      <ServicesHero
        badgeText="Marketing Services"
        badgeIcon={<Search className="w-4 h-4 text-[#E96429]" />}
        title={
          <>
            Marketing That {'\n'}
            <span className="text-[#2251B5]">Delivers Results</span>
          </>
        }
        description="Drive growth with data-driven marketing strategies across SEO, content, social media, and paid advertising. Get measurable results that impact your bottom line."
        primaryButtonText="Get Marketing Audit"
        secondaryButtonText="View Case Studies"
        showPartnerMarquee={false}
      />
      <DevStatsBar />
      <DetailedServicesGrid
        badgeLabel="Services"
        title="Our Marketing Services"
        description="Comprehensive marketing solutions that drive growth and engagement"
        featuresTitle="What We Do:"
        tagsTitle="Key Metrics:"
        services={marketingServices}
      />
      <SimpleProcessSection
        badge="Process"
        title="Our Marketing Process"
        subtitle="A proven methodology that maximizes ROI"
        steps={marketingProcessSteps}
      />
      <ToolsWeUseSection tools={marketingTools} />
      <ServicesCTASection 
        title="Ready to Grow Your Business?"
        description="Let's build a marketing strategy tailored to your goals."
        primaryButtonText="Get Free Consultation"
        secondaryButtonText="Explore All Services"
      />
    </>
  );
}
