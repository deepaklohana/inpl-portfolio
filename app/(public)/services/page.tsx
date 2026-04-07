import ServicesHero from "@/components/sections/ServicesHero";
import ServiceCategories from "@/components/sections/ServiceCategories";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ServicesCTASection from "@/components/sections/ServicesCTASection";
import { getTestimonials } from "@/lib/actions/testimonials";
import { getServices } from "@/lib/actions/services";
import AboutSection from "@/components/sections/AboutSection";

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  let dbTestimonials: any[] = [];
  let dbServices: any[] = [];
  let errorMsg: string | null = null;

  try {
    const results = await Promise.all([
      getTestimonials({ page: 'services', limit: 4 }),
      getServices({ status: 'published' }),
    ]);
    dbTestimonials = results[0];
    dbServices = results[1];
  } catch (e: any) {
    errorMsg = e?.message || String(e);
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-red-50 text-red-900 p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">CRITICAL ERROR ON SERVICES PAGE</h1>
          <p className="font-mono bg-white p-4 rounded border border-red-200 wrap-break-word">{errorMsg}</p>
        </div>
      </div>
    );
  }
  
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
      {/* <ProcessSection /> */}
      <AboutSection/>
      <TestimonialsSection testimonials={formattedTestimonials} />
      <ServicesCTASection />
    </>
  );
}
