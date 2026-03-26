import { UpcomingEventCard } from "@/components/ui/UpcomingEventCard";
import Button from "@/components/ui/Button";

interface EventItem {
  id: number;
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

const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 1,
    imageSrc: "/images/events/event-conference.png",
    imageAlt: "Annual Developer Conference 2026",
    type: "Conference",
    statusLabel: "Registration Open",
    title: "Annual Developer Conference 2026",
    date: "April 15-17, 2026",
    location: "Karachi Expo Center",
    attendees: "5000+ Expected",
    href: "/events/annual-developer-conference-2026",
  },
  {
    id: 2,
    imageSrc: "/images/events/event-conference.png",
    imageAlt: "Cloud Architecture Workshop",
    type: "Workshop",
    statusLabel: "Limited Seats",
    title: "Cloud Architecture Workshop",
    date: "March 28, 2026",
    location: "Lahore Tech Hub",
    attendees: "200 Expected",
    href: "/events/cloud-architecture-workshop",
  },
  {
    id: 3,
    imageSrc: "/images/events/event-conference.png",
    imageAlt: "Product Demo Day: HRM & ERP",
    type: "Webinar",
    statusLabel: "Free Event",
    title: "Product Demo Day: HRM & ERP",
    date: "March 22, 2026",
    location: "Online Webinar",
    attendees: "Unlimited Expected",
    href: "/events/product-demo-day",
  },
  {
    id: 4,
    imageSrc: "/images/events/event-conference.png",
    imageAlt: "Digital Transformation Summit",
    type: "Summit",
    statusLabel: "VIP Passes Available",
    title: "Digital Transformation Summit",
    date: "April 5, 2026",
    location: "Islamabad Convention Center",
    attendees: "1000+ Expected",
    href: "/events/digital-transformation-summit",
  },
];

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
  events = UPCOMING_EVENTS,
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
