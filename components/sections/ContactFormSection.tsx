"use client";

import React, { useState } from "react";
import {
  Send, Mail, Phone,
  Headset, Handshake, MessageCircle,
  Facebook, Linkedin, Instagram,
  CheckCircle, AlertCircle, Loader2,
} from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";

/* ─────────────────────────────────────────
   Department Card — each card is its own
   white bordered box (3 separate cards in Figma)
───────────────────────────────────────── */
interface DepartmentCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  email: string;
  phone: string;
  iconGradient: string;
}

function DepartmentCard({
  icon: Icon,
  title,
  description,
  email,
  phone,
  iconGradient,
}: DepartmentCardProps) {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 flex flex-row gap-4">
      {/* 48×48 gradient icon */}
      <div
        className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
        style={{ background: iconGradient }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1 min-w-0">
        <h4 className="font-bold text-[16px] leading-normal text-[#101828] font-['Inter',sans-serif]">
          {title}
        </h4>
        <p className="text-[14px] leading-normal text-[#4A5565] font-['Inter',sans-serif] mb-1">
          {description}
        </p>
        <div className="flex flex-col gap-1">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 group w-fit min-w-0"
          >
            <Mail className="w-4 h-4 text-[#364153] shrink-0" />
            <span className="text-[14px] text-[#364153] group-hover:underline font-['Inter',sans-serif] truncate">
              {email}
            </span>
          </a>
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 group w-fit"
          >
            <Phone className="w-4 h-4 text-[#364153] shrink-0" />
            <span className="text-[14px] text-[#364153] group-hover:underline font-['Inter',sans-serif]">
              {phone}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Section
───────────────────────────────────────── */
export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const departments = [
    {
      icon: MessageCircle,
      title: "Sales & Inquiries",
      description: "For product demos, pricing, and new business",
      email: "contact@innovative-net.com",
      phone: "(021) 34303051-55",
      iconGradient:
        "linear-gradient(135deg, rgba(233,100,41,1) 0%, rgba(233,100,41,0.8) 100%)",
    },
    {
      icon: Headset,
      title: "Technical Support",
      description: "For technical assistance and product support",
      email: "contact@innovative-net.com",
      phone: "(021) 34303051-55",
      iconGradient:
        "linear-gradient(135deg, rgba(34,81,181,1) 0%, rgba(34,81,181,0.8) 100%)",
    },
    {
      icon: Handshake,
      title: "Partnerships",
      description: "For collaboration and partnership opportunities",
      email: "contact@innovative-net.com",
      phone: "(021) 34303051-55",
      iconGradient:
        "linear-gradient(135deg, rgba(233,100,41,1) 0%, rgba(233,100,41,0.8) 100%)",
    },
  ];

  const socialLinks = [
    { label: "Facebook",  href: "https://www.facebook.com/innovativenetworkltd/", color: "#1877F2", Icon: Facebook  },
    { label: "LinkedIn",  href: "https://www.linkedin.com/company/innovative-network-pvt-ltd", color: "#0A66C2", Icon: Linkedin  },
    { label: "Instagram", href: "https://www.instagram.com/innovativenetworkltd?igsh=NWpleDE2cnZrZTU=", color: "#E4405F", Icon: Instagram },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    const result = await submitContactForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });

    if (result.success) {
      setStatus("success");
      setStatusMessage(result.message || "Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      setStatus("error");
      setStatusMessage(result.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative w-full bg-[#F9FAFB] py-20 overflow-hidden">
      {/* ── Blur ellipses ── */}
      <div
        className="pointer-events-none absolute w-[343px] h-[307px] rounded-full bg-[#E96429]/15 blur-[300px]"
        style={{ left: -220, top: 706 }}
      />
      <div
        className="pointer-events-none absolute w-[343px] h-[307px] rounded-full bg-[#2251B5]/20 blur-[300px]"
        style={{ right: -156, top: -63 }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_379px] gap-12 xl:gap-12 items-start">

          {/* LEFT — Form card */}
          <div
            className={[
              "flex flex-col justify-center gap-6",
              "bg-white border border-[#E0E0E0] rounded-[24px] p-8",
              "lg:min-h-[654px] lg:mt-[63px]",
            ].join(" ")}
          >
            {/* Heading */}
            <div className="flex flex-col gap-3">
              <h2
                className="font-bold text-[30px] leading-[1.2] text-[#E96429]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Send us a Message
              </h2>
              <p
                className="text-[16px] leading-normal text-[#4A5565]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Fill out the form below and our team will get back to you within
                24 hours
              </p>
            </div>

            {/* Status Banner */}
            {status === "success" && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-[14px] px-4 py-3">
                <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />
                <p className="text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {statusMessage}
                </p>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-[14px] px-4 py-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <p className="text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {statusMessage}
                </p>
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="cf-fullName"
                    className="font-semibold text-[14px] leading-[1.43] text-[#101828]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="cf-fullName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] bg-transparent text-[#101828] text-[16px] placeholder:text-black/50 outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="cf-email"
                    className="font-semibold text-[14px] leading-[1.43] text-[#101828]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="cf-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] bg-transparent text-[#101828] text-[16px] placeholder:text-black/50 outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="cf-phone"
                    className="font-semibold text-[14px] leading-[1.43] text-[#101828]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="cf-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] bg-transparent text-[#101828] text-[16px] placeholder:text-black/50 outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="cf-subject"
                    className="font-semibold text-[14px] leading-[1.43] text-[#101828]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="cf-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] bg-transparent text-[#101828] text-[16px] placeholder:text-black/50 outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cf-message"
                  className="font-semibold text-[14px] leading-[1.43] text-[#101828]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Message *
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 border border-[#D1D5DC] rounded-[14px] bg-transparent text-[#101828] text-[16px] placeholder:text-black/50 outline-none focus:border-[#2251B5] focus:ring-1 focus:ring-[#2251B5] transition-colors resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-[7px] bg-[#2251B5] hover:bg-[#1a3f8f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[16px] leading-normal rounded-[14px] py-[13px] transition-colors duration-200"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT — Contact by Department */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-4">
              <h3
                className="font-bold text-[24px] leading-[1.33] text-[#101828]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Contact by Department
              </h3>
              <div className="flex flex-col gap-4">
                {departments.map((dept, idx) => (
                  <DepartmentCard key={idx} {...dept} />
                ))}
              </div>
            </div>

            {/* Connect With Us card */}
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 flex flex-col gap-4">
              <h4
                className="font-bold text-[18px] leading-[1.56] text-[#101828]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Connect With Us
              </h4>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, color, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
