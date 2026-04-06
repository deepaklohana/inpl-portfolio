import React from "react";
import { Phone, Mail, MapPin, Clock, LucideIcon } from "lucide-react";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  line1: string;
  line2: string;
  gradient: string;
}

function ContactInfoCard({ icon: Icon, title, line1, line2, gradient }: ContactCardProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-[#FAFAFA] border border-[#E0E0E0] rounded-[16px] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      {/* Icon Box */}
      <div 
        className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
        style={{ background: gradient }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-[18px] leading-[1.55] text-[#101828] font-['Inter',sans-serif]">
          {title}
        </h3>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-[16px] leading-normal text-[#101828] font-['Inter',sans-serif]">
            {line1}
          </p>
          <p className="font-normal text-[14px] leading-[1.42] text-[#4A5565] font-['Inter',sans-serif]">
            {line2}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ContactInfoSection() {
  const cards = [
    {
      icon: Phone,
      title: "Call Us",
      line1: "(021) 34303051-55",
      line2: "Mon - Fri: 9:00 AM - 6:00 PM",
      gradient: "linear-gradient(135deg, rgba(233,100,41,1) 0%, rgba(233,100,41,0.8) 100%)",
    },
    {
      icon: Mail,
      title: "Email Us",
      line1: "contact@innovative-net.com",
      line2: "We reply within 24 hours",
      gradient: "linear-gradient(135deg, rgba(34,81,181,1) 0%, rgba(34,81,181,0.8) 100%)",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      line1: "41-J, Street-3, Block-6, PECHS",
      line2: "Karachi, Pakistan",
      gradient: "linear-gradient(135deg, rgba(233,100,41,1) 0%, rgba(233,100,41,0.8) 100%)",
    },
    {
      icon: Clock,
      title: "Working Hours",
      line1: "Mon - Fri: 9:00 AM - 6:00 PM",
      line2: "Saturday: 10:00 AM - 2:00 PM",
      gradient: "linear-gradient(135deg, rgba(34,81,181,1) 0%, rgba(34,81,181,0.8) 100%)",
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <ContactInfoCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
