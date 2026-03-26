import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

interface UpcomingEventCardProps {
  imageSrc: string;
  imageAlt?: string;
  type: string;          // e.g. "Conference", "Workshop", "Webinar", "Summit"
  statusLabel: string;   // e.g. "Registration Open", "Limited Seats", "Free Event", "VIP Passes Available"
  title: string;
  date: string;
  location: string;
  attendees: string;
  href?: string;
}

export function UpcomingEventCard({
  imageSrc,
  imageAlt = "Event image",
  type,
  statusLabel,
  title,
  date,
  location,
  attendees,
  href = "#",
}: UpcomingEventCardProps) {
  return (
    <div
      className="flex flex-col sm:flex-row w-full rounded-3xl overflow-hidden border border-[#E0E0E0] hover:-translate-y-1 transition-transform duration-300"
      style={{ background: "linear-gradient(135deg, rgba(249,250,251,1) 0%, rgba(255,255,255,1) 100%)" }}
    >
      {/* Left — image panel (300px wide on desktop) with gradient overlay */}
      <div className="relative w-full sm:w-[300px] h-[200px] sm:h-auto shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
        {/* Brand gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(34,81,181,0.2) 0%, rgba(233,100,41,0.2) 100%)" }}
        />
      </div>

      {/* Right — content panel */}
      <div className="flex flex-col justify-between gap-4 p-6 flex-1">
        {/* Top section */}
        <div className="flex flex-col gap-3">
          {/* Pills row */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Event type pill — blue tint */}
            <span className="inline-flex items-center px-[10px] py-[3px] rounded-full bg-[#2251B5]/10 font-bold text-[12px] leading-[1.33] text-[#2251B5]">
              {type}
            </span>
            {/* Status pill — green */}
            <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-[#DCFCE7] font-bold text-[12px] leading-[1.33] text-[#008236]">
              {statusLabel}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-bold text-[24px] leading-[1.33] text-[#101828]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {title}
          </h3>
        </div>

        {/* Meta row — date, location, attendees */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-[#4A5565] shrink-0" />
            <span className="text-[#4A5565] text-[14px] leading-[1.428]" style={{ fontFamily: "Inter, sans-serif" }}>
              {date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-[#4A5565] shrink-0" />
            <span className="text-[#4A5565] text-[14px] leading-[1.428]" style={{ fontFamily: "Inter, sans-serif" }}>
              {location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-[#4A5565] shrink-0" />
            <span className="text-[#4A5565] text-[14px] leading-[1.428]" style={{ fontFamily: "Inter, sans-serif" }}>
              {attendees}
            </span>
          </div>
        </div>

        {/* Register Now CTA */}
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-semibold text-[14px] leading-[1.428] text-[#2251B5] hover:gap-2 transition-all duration-200 w-fit"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Register Now
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
