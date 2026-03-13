import ProductHero from "@/components/sections/ProductHero";
import ProductSuiteSection from "@/components/sections/ProductSuiteSection";
import ProductFeaturesSection from "@/components/sections/ProductFeaturesSection";
import ServicesCTASection from "@/components/sections/ServicesCTASection";
import DevStatsBar from "@/components/sections/DevStatsBar";

export const metadata = {
  title: "Products | Innovative Network",
  description:
    "Comprehensive business management software solutions designed to streamline operations, boost productivity, and drive growth across all departments.",
};

export default function ProductPage() {
  return (
    <>
      <ProductHero />
      <ProductSuiteSection />
      <ProductFeaturesSection />
      <ServicesCTASection
        title="Ready to Transform Your Business?"
        description="Get started with a free demo and see how our products can revolutionize your operations"
        primaryButtonText="Schedule Free Demo"
        secondaryButtonText="Contact Sales"
      />
    </>
  );
}
