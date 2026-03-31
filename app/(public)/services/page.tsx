import ServicesHero from "@/components/sections/ServicesHero";
import ServiceCategories from "@/components/sections/ServiceCategories";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ServicesCTASection from "@/components/sections/ServicesCTASection";
import { getTestimonials } from "@/lib/actions/testimonials";

export const revalidate = 60; // Fallback validation

export default async function ServicesPage() {
  const dbTestimonials = await getTestimonials({ page: 'services', limit: 4 });
  
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

  return (
    <>
      <ServicesHero />
      <ServiceCategories />
      <ProcessSection />
      <TestimonialsSection testimonials={formattedTestimonials} />
      <ServicesCTASection />
    </>
  );
}
