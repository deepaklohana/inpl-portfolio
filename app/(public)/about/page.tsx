import AboutHero from "@/components/sections/AboutHero";
import WhoWeAreSection from "@/components/sections/WhoWeAreSection";
import CoreValuesSection from "@/components/sections/CoreValuesSection";
import JourneySection from "@/components/sections/JourneySection";
import DevStatsBar from "@/components/sections/DevStatsBar";
import TeamStatsSection from "@/components/sections/TeamStatsSection";
import ServicesCTASection from "@/components/sections/ServicesCTASection";

export const metadata = {
  title: "About Us | Innovative",
  description: "Pioneering Digital Excellence Since 2016. We empower businesses with integrated, master-class digital solutions.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white">
      <AboutHero />
      <DevStatsBar stats={[
        { value: "10+", label: "Years Experience" },
        { value: "1000+", label: "Happy Clients" },
        { value: "50+", label: "Countries Served" },
        { value: "99.9%", label: "Customer Satisfaction" }
      ]} />
      <WhoWeAreSection />
      <CoreValuesSection />
      <JourneySection />
      <TeamStatsSection />
      <ServicesCTASection 
        title="Join Our Success Story"
        description="Let's build something amazing together"
        primaryButtonText="Get In Touch"
        secondaryButtonText={undefined} 
      />
    </main>
  );
}
