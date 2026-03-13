import ServicesHero from "@/components/sections/ServicesHero";
import ServiceCategories from "@/components/sections/ServiceCategories";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ServicesCTASection from "@/components/sections/ServicesCTASection";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceCategories />
      <ProcessSection />
      <TestimonialsSection />
      <ServicesCTASection />
    </>
  );
}
