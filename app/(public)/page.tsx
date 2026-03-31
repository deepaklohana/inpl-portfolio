import Hero from "@/components/sections/Hero";
import CompanyOverviewSection from "@/components/sections/CompanyOverviewSection";
import AboutSection from "@/components/sections/AboutSection";
import ProductsSection from "@/components/sections/ProductsSection";
import CTASection from "@/components/sections/CTASection";
import ServicesSection from "@/components/sections/ServicesSection";
import DemoSection from "@/components/sections/DemoSection";
import LatestUpdatesSection from "@/components/sections/LatestUpdatesSection";

export default function Home() {
  return ( 
    <>
      {/* <section id="about"><AboutSection /></section> */}
      <section id="hero"><Hero /></section>
      <section id="projects"><ProductsSection /></section>
      <section id="company-overview"><CompanyOverviewSection /></section>
      <section id="contact"><CTASection /></section>
      <section id="services"><ServicesSection /></section>
      <section id="news"><LatestUpdatesSection /></section>
      <DemoSection />
    </>
  );
}
