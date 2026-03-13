import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import ProductsSection from "@/components/sections/ProductsSection";
import CTASection from "@/components/sections/CTASection";
import ServicesSection from "@/components/sections/ServicesSection";
import DemoSection from "@/components/sections/DemoSection";
import LatestUpdatesSection from "@/components/sections/LatestUpdatesSection";

export default function Home() {
  return ( 
    <>
      <Hero />
      <ProductsSection />
      <AboutSection />
      <CTASection />
      <ServicesSection />
      <LatestUpdatesSection />
      <DemoSection />
    </>
  );
}
