"use client";

import React from "react";
import { Send, Mail, Phone, Building2, Headset, Handshake } from "lucide-react";
import Button from "@/components/ui/Button";

interface DepartmentCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  email: string;
  phone: string;
  gradient: string;
}

function DepartmentCard({ icon: Icon, title, description, email, phone, gradient }: DepartmentCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white border border-[#E0E0E0] rounded-[16px] transition-all hover:shadow-md">
      <div 
        className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
        style={{ background: gradient }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="font-bold text-[18px] text-[#101828] font-['Inter',sans-serif]">
          {title}
        </h4>
        <p className="text-[16px] leading-normal text-[#4A5565] font-['Inter',sans-serif] mb-2">
          {description}
        </p>
        <div className="flex flex-col gap-2">
          <a href={`mailto:${email}`} className="flex items-center gap-2 group w-fit">
            <Mail className="w-4 h-4 text-[#E96429]" />
            <span className="text-[16px] text-[#2251B5] group-hover:underline font-['Inter',sans-serif]">
              {email}
            </span>
          </a>
          <a href={`tel:${phone}`} className="flex items-center gap-2 group w-fit">
            <Phone className="w-4 h-4 text-[#E96429]" />
            <span className="text-[16px] text-[#2251B5] group-hover:underline font-['Inter',sans-serif]">
              {phone}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ContactFormSection() {
  const departments = [
    {
      icon: Building2,
      title: "Sales & Inquiries",
      description: "For product demos, pricing, and new business",
      email: "sales@innovativenetwork.com",
      phone: "+92 21 1234 5678",
      gradient: "linear-gradient(135deg, rgba(233,100,41,1) 0%, rgba(233,100,41,0.8) 100%)",
    },
    {
      icon: Headset,
      title: "Technical Support",
      description: "For technical assistance and product support",
      email: "support@innovativenetwork.com",
      phone: "+92 21 1234 5679",
      gradient: "linear-gradient(135deg, rgba(34,81,181,1) 0%, rgba(34,81,181,0.8) 100%)",
    },
    {
      icon: Handshake,
      title: "Partnerships",
      description: "For collaboration and partnership opportunities",
      email: "partnerships@innovativenetwork.com",
      phone: "+92 21 1234 5680",
      gradient: "linear-gradient(135deg, rgba(233,100,41,1) 0%, rgba(233,100,41,0.8) 100%)",
    },
  ];

  return (
    <section className="relative w-full bg-[#F9FAFB] py-16 md:py-24 overflow-hidden">
      {/* Background blurs */}
      <div className="absolute w-[343px] h-[307px] bg-[#E96429]/15 blur-[300px] -left-[220px] top-[706px] pointer-events-none rounded-full" />
      <div className="absolute w-[343px] h-[307px] bg-[#2251B5]/10 blur-[300px] right-[100px] top-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 xl:gap-16">
          
          {/* Left Column: Form */}
          <div className="flex flex-col gap-8 bg-white p-6 md:p-8 lg:p-10 border border-[#E0E0E0] rounded-[24px] shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-[30px] leading-[1.2] text-[#E96429] font-['Inter',sans-serif]">
                Send us a Message
              </h2>
              <p className="text-[16px] leading-normal text-[#4A5565] font-['Inter',sans-serif]">
                Fill out the form below and our team will get back to you within 24 hours
              </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="font-semibold text-[14px] text-[#101828] font-['Inter',sans-serif]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] text-[#101828] placeholder:text-black/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-semibold text-[14px] text-[#101828] font-['Inter',sans-serif]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] text-[#101828] placeholder:text-black/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="font-semibold text-[14px] text-[#101828] font-['Inter',sans-serif]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] text-[#101828] placeholder:text-black/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="font-semibold text-[14px] text-[#101828] font-['Inter',sans-serif]">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] text-[#101828] placeholder:text-black/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-semibold text-[14px] text-[#101828] font-['Inter',sans-serif]">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] text-[#101828] placeholder:text-black/50 transition-colors resize-y"
                ></textarea>
              </div>

              <div className="pt-2">
                <Button variant="primary" icon={<Send className="w-5 h-5" />} className="w-full md:w-auto px-8 rounded-[14px]">
                  Send Message
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Departments */}
          <div className="flex flex-col gap-6">
            <h3 className="font-semibold text-[24px] text-[#101828] font-['Inter',sans-serif] mb-2">
              Contact by Department
            </h3>
            <div className="flex flex-col gap-4">
              {departments.map((dept, idx) => (
                <DepartmentCard key={idx} {...dept} />
              ))}
            </div>
            {/* Adding an extra illustrative element or spacing if needed? Figma didn't explicitly show more than the 3 cards and title, but connecting with us text is there. Let's add the "Connect With Us" section from the Figma dump. */}
            <div className="mt-4 p-6 bg-white border border-[#E0E0E0] rounded-[16px] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md">
              <span className="font-semibold text-[18px] text-[#101828] font-['Inter',sans-serif]">
                Connect With Us
              </span>
              <div className="flex items-center gap-4">
                {/* Social Placeholders */}
                <div className="w-10 h-10 rounded-full bg-[#2251B5]/10 flex items-center justify-center cursor-pointer hover:bg-[#2251B5]/20 transition-colors">
                  <span className="text-[#2251B5] font-bold">in</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#2251B5]/10 flex items-center justify-center cursor-pointer hover:bg-[#2251B5]/20 transition-colors">
                  <span className="text-[#2251B5] font-bold">tw</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#2251B5]/10 flex items-center justify-center cursor-pointer hover:bg-[#2251B5]/20 transition-colors">
                  <span className="text-[#2251B5] font-bold">fb</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
