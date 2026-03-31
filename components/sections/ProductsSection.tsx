import { getProducts } from "@/lib/actions/products";
import * as LucideIcons from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/ui/Card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";
import Link from "next/link";

export default async function ProductsSection() {
  const products = await getProducts({ status: 'published' });

  return (
    <section className="w-full bg-[#F5F5F5] py-20 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute w-[343px] h-[307px] left-[557px] top-[200px] bg-[rgba(248,130,77,0.4)] blur-[100px] rounded-full" />

      {/* Background Ellipses */}
      <div className="absolute left-0 bottom-[-10%] w-[343px] h-[307px] bg-[#E96429] opacity-15 blur-[300px] rounded-full pointer-events-none" />
      <div className="absolute right-[-5%] top-[-5%] w-[343px] h-[307px] bg-[#2251B5] opacity-15 blur-[300px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fadeUp">
          <SectionHeader
            badge="Our Products"
            title="Explore Our Digital Mastery Portfolio"
            subtitle="Comprehensive solutions designed to transform your business operations"
            align="center"
            titleColor="#2251B5"
          />
        </ScrollReveal>

        {/* Cards Grid */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products.map((product, index) => {
            const IconComponent = (product.icon && (LucideIcons as any)[product.icon]) || LucideIcons.Box;
            const isHighlighted = product.featured || index === 0; // Highlight featured or at least first one
            return (
              <Link href={`/products/${product.slug}`} key={product.id || index}>
                <ProductCard
                  title={product.fullName || product.name || 'Unnamed Product'}
                  description={product.shortDescription || product.description || 'No description available.'}
                  icon={IconComponent}
                  highlight={isHighlighted}
                />
              </Link>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
