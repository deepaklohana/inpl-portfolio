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
      <WhoWeAreSection />
      <CoreValuesSection />
      <JourneySection />
      <DevStatsBar />
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
