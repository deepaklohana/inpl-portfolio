import ProductHero from "@/components/sections/ProductHero";
import ProductSuiteSection from "@/components/sections/ProductSuiteSection";
import ProductFeaturesSection from "@/components/sections/ProductFeaturesSection";
import ServicesCTASection from "@/components/sections/ServicesCTASection";
import DevStatsBar from "@/components/sections/DevStatsBar";
import ProductCTASection from "@/components/sections/ProductCTASection";
import { getCachedProducts } from "@/lib/cached-queries";

export const metadata = {
  title: "Products | Innovative Network",
  description:
    "Comprehensive business management software solutions designed to streamline operations, boost productivity, and drive growth across all departments.",
};

export const revalidate = 60; // Fallback validation

export default async function ProductPage() {
  let products: Awaited<ReturnType<typeof getCachedProducts>> = [];
  try {
    products = await getCachedProducts("published");
  } catch (error) {
    console.warn("Products page fetch failed. Rendering empty products list.");
  }

  return (
    <>
      <ProductHero />
      <ProductSuiteSection products={products} />
      <ProductFeaturesSection />
      <ProductCTASection />
    </>
  );
}
