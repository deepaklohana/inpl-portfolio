import { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import OfficesSection from "@/components/sections/OfficesSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactCTASection from "@/components/sections/ContactCTASection";
import { getFAQs } from "@/lib/actions/faqs";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Stay informed with our latest news, product updates, and thought leadership content.",
};

export default async function ContactPage() {
  const faqs = await getFAQs({ status: 'published' });

  const faqItems = faqs.map((f: any) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        badgeText="Get in Touch"
        title="Contact Us"
        description="Stay informed with our latest news, product updates, and thought leadership content"
      />
      <ContactInfoSection />
      <ContactFormSection />
      <OfficesSection />
      <FAQSection faqs={faqItems} />
      <ContactCTASection />
    </main>
  );
}
