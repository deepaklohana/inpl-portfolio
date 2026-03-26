import SectionHeader from "@/components/ui/SectionHeader";
import { EventCard } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";

const UPDATES = [
  {
    id: 1,
    title: "New ERP Module Launch",
    date: "March 2, 2026",
    description:
      "Introducing advanced analytics and AI-powered insights to our ERP platform.",
    imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    isHighlighted: true,
  },
  {
    id: 2,
    title: "Strategic Partnership Announcement",
    date: "February 28, 2026",
    description:
      "Innovative Network signs major partnership agreement with leading tech provider.",
    imageSrc: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop",
    isHighlighted: false,
  },
  {
    id: 3,
    title: "Digital Transformation Summit 2026",
    date: "February 20, 2026",
    description:
      "Our team showcased cutting-edge solutions at the annual Digital Transformation Summit.",
    imageSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    isHighlighted: false,
  },
];

export default function LatestUpdatesSection() {
  return (
    <section className="bg-[#F5F5F5] w-full py-20 md:py-[80px] flex justify-center">
      <div className="w-full max-w-[1200px] px-6 mx-auto flex flex-col items-center gap-[48px]">
        {/* Header section (layout_MP4LJY) */}
        <ScrollReveal variant="fadeUp" className="max-w-[672px] mx-auto">
          <SectionHeader
            badge="Latest Updates"
            title="News & Events"
            subtitle="Stay updated with our latest innovations, insights, and industry events"
            titleColor="#2251B5"
            align="center"
          />
        </ScrollReveal>

        {/* Cards row (layout_L92J7R) */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {UPDATES.map((update) => (
            <EventCard
              key={update.id}
              title={update.title}
              date={update.date}
              description={update.description}
              imageSrc={update.imageSrc}
              isHighlighted={update.isHighlighted}
            />
          ))}
        </StaggerReveal>

        {/* Button */}
        <div>
          <Button variant="primary">View All News & Events</Button>
        </div>
      </div>
    </section>
  );
}
