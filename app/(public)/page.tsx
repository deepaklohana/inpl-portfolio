import Hero from "@/components/sections/Hero";
import CompanyOverviewSection from "@/components/sections/CompanyOverviewSection";
import ProductsSection from "@/components/sections/ProductsSection";
import CTASection from "@/components/sections/CTASection";
import ServicesSection from "@/components/sections/ServicesSection";
import DemoSection from "@/components/sections/DemoSection";
import LatestUpdatesSection from "@/components/sections/LatestUpdatesSection";
import { getArticles } from "@/lib/actions/articles";

export default async function Home() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    articles = await getArticles({ status: "published", limit: 3 });
  } catch (error) {
    console.warn("Home page articles fetch failed. Rendering fallback list.");
  }

  return ( 
    <>
      {/* <section id="about"><AboutSection /></section> */}
      <section id="hero"><Hero /></section>
      <section id="projects"><ProductsSection /></section>
      <section id="company-overview"><CompanyOverviewSection /></section>
      <section id="contact"><CTASection /></section>
      <section id="services"><ServicesSection /></section>
      <section id="news"><LatestUpdatesSection articles={articles} /></section>
      <DemoSection />
    </>
  );
}
