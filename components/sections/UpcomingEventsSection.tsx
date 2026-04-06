import { UpcomingEventCard } from "@/components/ui/UpcomingEventCard";
import Button from "@/components/ui/Button";

export interface EventItem {
  id: string;
  imageSrc: string;
  imageAlt?: string;
  type: string;
  statusLabel: string;
  title: string;
  date: string;
  location: string;
  attendees: string;
  href?: string;
}

interface UpcomingEventsSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  events?: EventItem[];
}

export default function UpcomingEventsSection({
  badge = "Events",
  title = "Upcoming Events",
  subtitle = "Join us at our latest conferences, workshops, and webinars",
  events = [],
}: UpcomingEventsSectionProps) {
  return (
    <section className="w-full py-[80px] px-6 md:px-[120px] bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
        {/* Centered Section Header */}
        <div className="flex flex-col items-center gap-3 text-center max-w-[571px]">
          {/* Orange badge pill */}
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#E96429]/10 w-fit">
            <span className="font-semibold text-[14px] leading-[1.428] text-[#E96429]">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-bold text-[38px] leading-[1.05] text-[#2251B5]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p
            className="text-[#4A5565] text-[20px] leading-[1.4]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {subtitle}
          </p>
        </div>

        {/* 2×2 event cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {events.map((event) => (
            <UpcomingEventCard
              key={event.id}
              imageSrc={event.imageSrc}
              imageAlt={event.imageAlt}
              type={event.type}
              statusLabel={event.statusLabel}
              title={event.title}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
              href={event.href}
            />
          ))}
        </div>

        {/* View all events CTA */}
        <Button variant="outline" href="/events">
          View All Events
        </Button>
      </div>
    </section>
  );
}
