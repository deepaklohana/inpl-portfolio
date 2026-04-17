import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

interface OfficeCardProps {
  type: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapUrl: string;
}

function OfficeCard({ type, city, address, phone, email, hours, mapUrl }: OfficeCardProps) {
  return (
    <div className="flex flex-col bg-white border border-[#E0E0E0] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Office Image */}
      <div className="relative h-[224px] bg-gray-100 overflow-hidden shrink-0">
        <Image
          src="/images/sections/office-interior.png"
          alt={`${city} office`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={city === "Karachi"}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
        {/* Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#E96429] text-white font-bold text-[14px] leading-[1.42] px-3 py-[7px] rounded-full">
          {type}
        </div>
        {/* City */}
        <div className="absolute bottom-4 left-4 font-bold text-[24px] leading-[1.33] text-white font-['Inter',sans-serif]">
          {city}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#E96429] shrink-0 mt-0.5" />
            <p className="text-[16px] leading-normal text-[#364153] font-['Inter',sans-serif]">{address}</p>
          </div>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-3 group">
            <Phone className="w-5 h-5 text-[#E96429] shrink-0" />
            <span className="text-[16px] leading-normal text-[#364153] group-hover:text-[#2251B5] transition-colors font-['Inter',sans-serif]">{phone}</span>
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-3 group">
            <Mail className="w-5 h-5 text-[#E96429] shrink-0" />
            <span className="text-[16px] leading-normal text-[#364153] group-hover:text-[#2251B5] transition-colors font-['Inter',sans-serif] break-all">{email}</span>
          </a>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#E96429] shrink-0" />
            <span className="text-[16px] leading-normal text-[#364153] font-['Inter',sans-serif]">{hours}</span>
          </div>
        </div>

        {/* Get Directions Button */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2251B5] text-white font-semibold text-[14px] rounded-[12px] hover:bg-[#1a3e8c] transition-colors mt-2"
        >
          <ExternalLink className="w-4 h-4" />
          Get Directions
        </a>
      </div>
    </div>
  );
}

const OFFICES: OfficeCardProps[] = [
  {
    type: "Head Office",
    city: "Karachi",
    address: "41-J, Street-3, Block-6, PECHS, Karachi, Sindh, Pakistan 75400",
    phone: "(021) 34303051-55",
    email: "contact@innovative-net.com",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM",
    mapUrl: "https://maps.app.goo.gl/i9HpfC9XnMmoLwCGA",
  },
  // {
  //   type: "Regional Office",
  //   city: "Lahore",
  //   address: "DHA Phase 6, Main Boulevard, Lahore, Pakistan",
  //   phone: "+92 42 9876 5432",
  //   email: "lahore@innovativenetwork.com",
  //   hours: "Mon - Fri: 9:00 AM - 6:00 PM",
  //   mapUrl: "https://maps.google.com/?q=DHA+Phase+6+Lahore+Pakistan",
  // },
  // {
  //   type: "Branch Office",
  //   city: "Islamabad",
  //   address: "Blue Area, F-7 Markaz, Islamabad, Pakistan",
  //   phone: "+92 51 5555 6666",
  //   email: "islamabad@innovativenetwork.com",
  //   hours: "Mon - Fri: 9:00 AM - 6:00 PM",
  //   mapUrl: "https://maps.google.com/?q=Blue+Area+F-7+Markaz+Islamabad+Pakistan",
  // },
];

export default function OfficesSection() {
  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute w-[343px] h-[307px] bg-[#E96429]/15 blur-[300px] right-[1131px] top-[454px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <h2 className="font-bold text-[38px] leading-[1.05] text-[#2251B5] font-['Plus_Jakarta_Sans',sans-serif]">
            Our Office
          </h2>
          <p className="text-[20px] leading-[1.4] text-[#4A5565] font-['Inter',sans-serif]">
            Visit us at any of our locations across Pakistan
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICES.map((office) => (
            <OfficeCard key={office.city} {...office} />
          ))}
        </div>
      </div>
    </section>
  );
}
