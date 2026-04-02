import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getServiceBySlug, getServices } from '@/lib/actions/services';
import type {
  StatItem,
  SubService,
  ProcessStep,
  TechSection,
  ToolsSection
} from '@/lib/actions/services';

import ServicesHero from '@/components/sections/ServicesHero';
import DevStatsBar from '@/components/sections/DevStatsBar';
import DetailedServicesGrid, { DetailedServiceItem } from '@/components/sections/DetailedServicesGrid';
import SimpleProcessSection, { ProcessStep as SimpleProcessStep } from '@/components/sections/SimpleProcessSection';
import TechMasterySection from '@/components/sections/TechMasterySection';
import ToolsWeUseSection from '@/components/sections/ToolsWeUseSection';
import DynamicIcon from '@/components/ui/DynamicIcon';

export const revalidate = 86400;
export const dynamicParams = true; // Enable on-demand generation for slugs not in generateStaticParams

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    console.log('[generateStaticParams] Attempting to fetch published services from database...');
    const services = await getServices({ status: 'published' });
    
    console.log(`[generateStaticParams] Database connection successful. Found ${services.length} published service(s).`);
    
    if (services.length === 0) {
      console.warn('[generateStaticParams] No published services found in database. This may be expected if the database is empty or if no services are published yet.');
    }
    
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('[generateStaticParams] Database error: Failed to fetch services during build phase.', error);
    console.error('[generateStaticParams] This may indicate database is inaccessible, environment variables are missing, or connection failed.');
    console.error('[generateStaticParams] Returning empty array - pages will be generated on-demand at request time due to dynamicParams=true.');
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || service.status !== 'published') return {};

  const seo = service.seo_metadata;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return buildMetadata({
    title: seo?.meta_title ?? service.title,
    description: seo?.meta_description ?? service.description ?? undefined,
    image: seo?.og_image ?? undefined,
    url: `${baseUrl}/services/${service.slug}`,
    type: 'website',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    noIndex: seo?.no_index || false,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  // Call notFound() for missing or non-published records
  if (!service || service.status !== 'published') {
    notFound();
  }

  // Parse JSON fields with type safety
  const srv = service as any;
  const stats = srv.stats as StatItem[] | null;
  const subServices = srv.subServices as SubService[] | null;
  const processSteps = srv.processSteps as ProcessStep[] | null;
  const techSection = srv.techSection as TechSection | null;
  const toolsSection = srv.toolsSection as ToolsSection | null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: `${baseUrl}/services/${service.slug}`,
    provider: { '@type': 'Organization', name: 'Company Name' },
  };

  const blackHeading = (service as any).blackHeading;
  const blueHeading = (service as any).blueHeading;
  const pillText = (service as any).pillText;

  let titleNode: React.ReactNode = service.title;
  if (blackHeading || blueHeading) {
    titleNode = (
      <>
        {blackHeading && <>{blackHeading}{' \n'}</>}
        {blueHeading && <span className="text-[#2251B5]">{blueHeading}</span>}
      </>
    );
  }

  // Map sub-services to DetailedServiceItem format
  const mappedSubServices: DetailedServiceItem[] | null = subServices?.map((sub, index) => {
    const isFirst = index === 0;
    return {
      id: sub.name,
      title: sub.name,
      description: sub.description || sub.shortDescription || "",
      icon: <DynamicIcon name={sub.icon} className="w-8 h-8 text-white" />,
      iconBg: isFirst ? "bg-[#E96429]" : "bg-[#2251B5]",
      badgeIcon: <div className={`w-2 h-2 rounded-full ${isFirst ? "bg-[#E96429]" : "bg-[#2251B5]"}`} />,
      features: sub.features || [],
      techStack: sub.technologies || [],
      themePrimary: isFirst ? "#E96429" : "#2251B5",
      themeSecondary: isFirst ? "#FFEDE5" : "#F0F4FF",
      borderActive: isFirst ? "border-[#E96429]" : "border-[#E0E0E0]",
    };
  }) || null;

  // Map process steps
  const mappedProcessSteps: SimpleProcessStep[] | null = processSteps?.map((step, index) => ({
    num: step.number < 10 ? `0${step.number}` : step.number.toString(),
    title: step.heading,
    description: step.description,
    color: index % 2 === 0 ? "orange" : "blue",
  })) || null;

  const sectionType = srv.sectionType || 'technologies';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServicesHero
        badgeText={pillText || "Our Services"}
        badgeIcon={<div className="w-2 h-2 rounded-full bg-[#E96429]" />}
        title={titleNode}
        description={service.description || undefined}
        primaryButtonText="Get Started"
        secondaryButtonText="Scheduled Consultation"
        showPartnerMarquee={false}
      />

      {stats && stats.length > 0 && (
        <DevStatsBar stats={stats} />
      )}

      {mappedSubServices && mappedSubServices.length > 0 && (
        <DetailedServicesGrid
          badgeLabel={(service as any).subServicesHeading || "Services"}
          title={(service as any).subServicesHeading || "Our Services"}
          description={(service as any).subServicesDescription || ""}
          services={mappedSubServices}
        />
      )}

      {mappedProcessSteps && mappedProcessSteps.length > 0 && (
        <SimpleProcessSection
          badge="Process"
          title={(service as any).processStepsHeading || "Development Process"}
          subtitle={(service as any).processStepsDescription || "How we deliver excellence"}
          steps={mappedProcessSteps}
        />
      )}

      {sectionType === 'technologies' && techSection && (
        <TechMasterySection data={techSection} />
      )}

      {sectionType === 'tools' && toolsSection && (
        <ToolsWeUseSection data={toolsSection} />
      )}
    </>
  );
}
