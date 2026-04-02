import ServicesHero from "@/components/sections/ServicesHero";
import ServiceCategories from "@/components/sections/ServiceCategories";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ServicesCTASection from "@/components/sections/ServicesCTASection";
import { getTestimonials } from "@/lib/actions/testimonials";
import { getServices } from "@/lib/actions/services";

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const [dbTestimonials, dbServices] = await Promise.all([
    getTestimonials({ page: 'services', limit: 4 }),
    getServices({ status: 'published' }),
  ]);
  
  const formattedTestimonials = dbTestimonials.map((t: any) => ({
    id: String(t.id),
    name: t.client_name,
    role: t.client_title || '',
    company: t.client_company || '',
    companyType: t.company_type || '',
    project: (t as any).projects?.title || '',
    quote: t.content,
    avatar: t.client_image || "https://randomuser.me/api/portraits/lego/1.jpg",
    rating: t.rating || 5,
  }));

  const formattedServices = dbServices.map((s: any) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    icon: s.icon,
    subServices: s.subServices ? (s.subServices as any) : [],
  }));

  return (
    <>
      <ServicesHero />
      <ServiceCategories services={formattedServices} />
      <ProcessSection />
      <TestimonialsSection testimonials={formattedTestimonials} />
      <ServicesCTASection />
    </>
  );
}
