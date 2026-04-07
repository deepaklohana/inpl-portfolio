import type { Metadata } from "next";
import PartnershipHero from "@/components/sections/PartnershipHero";
import DevStatsBar from "@/components/sections/DevStatsBar";
import PartnershipProgramsSection from "@/components/sections/PartnershipProgramsSection";
import FeaturedPartnersSection from "@/components/sections/FeaturedPartnersSection";
import PartnershipBenefitsSection from "@/components/sections/PartnershipBenefitsSection";
import PartnershipCTASection from "@/components/sections/PartnershipCTASection";

export const metadata: Metadata = {
  title: "Partnerships - Building Success Together",
  description: "Collaborating with industry leaders to deliver exceptional value and drive innovation across the global technology ecosystem.",
};

const partnershipStats = [
  { value: "50+", label: "Active Partnerships" },
  { value: "20+", label: "Countries Covered" },
  { value: "$1M+", label: "Combined Revenue" },
  { value: "95%", label: "Partner Satisfaction" }
];

export default function PartnershipPage() {
  return (
    <>
      <PartnershipHero />
      <DevStatsBar 
        stats={partnershipStats}
        gradient="linear-gradient(90deg, rgba(34, 81, 181, 1) 0%, rgba(54, 86, 174, 1) 7%, rgba(71, 91, 168, 1) 14%, rgba(86, 94, 161, 1) 21%, rgba(100, 97, 154, 1) 29%, rgba(114, 100, 146, 1) 36%, rgba(128, 102, 138, 1) 43%, rgba(141, 104, 130, 1) 50%, rgba(154, 105, 122, 1) 57%, rgba(168, 105, 112, 1) 64%, rgba(181, 105, 102, 1) 71%, rgba(194, 105, 91, 1) 79%, rgba(207, 104, 78, 1) 86%, rgba(220, 102, 63, 1) 93%, rgba(233, 100, 41, 1) 100%)"
      />
      <PartnershipProgramsSection />
      <FeaturedPartnersSection />
      <PartnershipBenefitsSection />
      <PartnershipCTASection />
    </>
  );
}
