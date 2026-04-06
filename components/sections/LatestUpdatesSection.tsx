import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { EventCard } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";


function formatDate(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}



interface LatestUpdatesSectionProps {
  articles?: any[];
}

export default function LatestUpdatesSection({ articles }: LatestUpdatesSectionProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  const updates = articles.map((a: any, i: number) => ({
    id: a.id,
    title: a.title,
    date: formatDate(a.type === "event" ? a.eventDate || a.publishedAt : a.publishedAt),
    description: a.excerpt || "",
    imageSrc: a.coverImage || "",
    isHighlighted: i === 0,
    href:
      a.type === "event"
        ? `/events/${a.slug}`
        : a.type === "blog"
        ? `/blog/${a.slug}`
        : `/news/${a.slug}`,
  }));

  return (
    <section className="bg-[#F5F5F5] w-full py-20 md:py-[80px] flex justify-center">
      <div className="w-full max-w-[1200px] px-6 mx-auto flex flex-col items-center gap-[48px]">
        {/* Header section */}
        <ScrollReveal variant="fadeUp" className="max-w-[672px] mx-auto">
          <SectionHeader
            badge="Latest Updates"
            title="News & Events"
            subtitle="Stay updated with our latest innovations, insights, and industry events"
            titleColor="#2251B5"
            align="center"
          />
        </ScrollReveal>

        {/* Cards row */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {updates.map((update: any) => (
            <Link key={update.id} href={update.href} className="block h-full no-underline">
              <EventCard
                title={update.title}
                date={update.date}
                description={update.description}
                imageSrc={update.imageSrc}
                isHighlighted={update.isHighlighted}
              />
            </Link>
          ))}
        </StaggerReveal>

        {/* Button */}
        <div>
          <Button variant="primary" href="/news">View All News &amp; Events</Button>
        </div>
      </div>
    </section>
  );
}
