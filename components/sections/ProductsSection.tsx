import {
  Server, TrendingUp, FileText, Users, Calendar, Headphones, type LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/ui/Card";

interface Product {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight?: boolean;
}

const products: Product[] = [
  {
    title: "Enterprise Resource Planning (ERP)",
    description: "Streamline operations with comprehensive resource management and real-time insights.",
    icon: Server,
    highlight: true,
  },
  {
    title: "Sales & Distribution (S&D)",
    description: "Optimize your sales pipeline and distribution channels for maximum efficiency.",
    icon: TrendingUp,
  },
  {
    title: "FBR Digital Invoicing",
    description: "Stay compliant with automated digital invoicing solutions.",
    icon: FileText,
  },
  {
    title: "Human Resources Management (HRM)",
    description: "Empower your workforce with modern HR solutions and analytics.",
    icon: Users,
  },
  {
    title: "Banquet Management System (BMS)",
    description: "Manage events and banquets seamlessly with our specialized platform.",
    icon: Calendar,
  },
  {
    title: "Customer Relationship Management (CRM)",
    description: "Build lasting relationships with powerful customer engagement tools.",
    icon: Headphones,
  },
];

export default function ProductsSection() {
  return (
    <section className="w-full bg-[#F5F5F5] py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Ellipses */}
      <div className="absolute left-0 bottom-[-10%] w-[343px] h-[307px] bg-[#E96429] opacity-15 blur-[300px] rounded-full pointer-events-none" />
      <div className="absolute right-[-5%] top-[-5%] w-[343px] h-[307px] bg-[#2251B5] opacity-15 blur-[300px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge="Our Products"
          title="Explore Our Digital Mastery Portfolio"
          subtitle="Comprehensive solutions designed to transform your business operations"
          align="center"
          titleColor="#2251B5"
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              icon={product.icon}
              highlight={product.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
