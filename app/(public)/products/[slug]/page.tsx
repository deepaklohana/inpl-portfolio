import { notFound } from "next/navigation";
import ERPHero from "@/components/sections/ERPHero";
import ERPModulesSection from "@/components/sections/ERPModulesSection";
import ERPHRMSection from "@/components/sections/ERPHRMSection";
import ERPCRMSection from "@/components/sections/ERPCRMSection";
import ERPWhyChooseSection from "@/components/sections/ERPWhyChooseSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { getProductBySlug } from "@/lib/actions/products";
import { Metadata } from "next";
import TeamStatsSection from "@/components/sections/TeamStatsSection";
import DevStatsBar from "@/components/sections/DevStatsBar";
import ProductCTASection from "@/components/sections/ProductCTASection";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seo?.meta_title || `${product.name} | Innovative Network`,
    description: product.seo?.meta_description || product.tagline || product.description,
    keywords: product.seo?.keywords || "",
    openGraph: {
      images: product.seo?.og_image ? [{ url: product.seo.og_image }] : [],
    },
    robots: product.seo?.no_index ? "noindex, nofollow" : "index, follow",
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const formattedTestimonials = ((product as any).testimonials || []).map((pt: any) => ({
    id: String(pt.testimonial.id),
    name: pt.testimonial.client_name,
    role: pt.testimonial.client_title || "",
    company: pt.testimonial.client_company || "",
    companyType: pt.testimonial.company_type || "",
    project: "", // Can be filled if needed
    quote: pt.testimonial.content,
    avatar: pt.testimonial.client_image || "https://randomuser.me/api/portraits/lego/1.jpg",
    rating: pt.testimonial.rating || 5,
  }));

  return (
    <>
      <ERPHero />
      <DevStatsBar 
      stats={product.stats}
      />
      <ERPModulesSection 
        slug={product.slug}
        modules={product.modules} 
      />
      
      {/* Dynamic sections based on modules */}
      {product.modules.map((module: any, index: number) => (
        <ERPHRMSection 
          key={module.id}
          id={`module-${module.id}`}
          index={index}
          title={module.name}
          description={module.description}
          features={module.features}
          shortCode={module.shortCode}
        />
      ))}

      <TestimonialsSection 
        testimonials={formattedTestimonials} 
        stats={(product as any).testimonialStats} 
      />
      <ERPWhyChooseSection 
        title={product.whyChooseTitle}
        description={product.whyChooseDesc}
        points={product.whyChoosePoints as any}
        pillText={product.slug}
      />
      <ProductCTASection />
    </>
  );
}

