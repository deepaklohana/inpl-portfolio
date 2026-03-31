"use client";

import { motion } from "framer-motion";

// ── SVG Icons ──────────────────────────────────────────────────────────────
const LeadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 4V24" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 10L14 4L20 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="14" r="10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="14" cy="7" rx="10" ry="4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 7V14C4 16.209 8.477 18 14 18C19.523 18 24 16.209 24 14V7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 14V21C4 23.209 8.477 25 14 25C19.523 25 24 23.209 24 21V14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PipelineIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4H4V24" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 20L14 12L18 16L24 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 8H24V12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EmailIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="22" height="16" rx="2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8L14 15L25 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CallIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.1119 18.067C23.1119 18.4284 22.9567 18.775 22.6806 19.0142L20.2458 21.1232C19.9274 21.3992 19.5138 21.5658 19.0792 21.5658C18.6791 21.5658 18.2789 21.4168 17.9615 21.1645C13.844 18.1561 10.3752 14.5056 7.57551 10.4217C7.26528 9.94056 7.07632 9.38792 7.03714 8.81056C6.98565 8.1691 7.21832 7.53065 7.68307 7.04944L10.0827 4.67285C10.5186 4.242 11.1963 4.103 11.751 4.34148C12.8718 4.819 13.8824 5.48514 14.7336 6.30239C15.2285 6.77978 15.2447 7.58188 14.7674 8.07799L13.1115 9.77457C13.626 11.0963 14.2494 12.3789 14.9961 13.5937C16.1422 14.39 17.3828 15.0601 18.6873 15.5898L20.3013 13.9118C20.766 13.4306 21.5434 13.414 22.0294 13.8742C22.8441 14.6599 23.5182 15.5677 24.0177 16.5794C23.3615 17.0628 23.1119 17.5109 23.1119 18.067Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QuoteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4H6C4.89543 4 4 4.89543 4 6V22C4 23.1046 4.89543 24 6 24H22C23.1046 24 24 23.1046 24 22V12L16 4Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 4V12H24" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 16H18" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 20H14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="20" height="20" rx="2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 10H24" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M10 24V10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const SupportIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 24C19.5228 24 24 19.5228 24 14C24 8.47715 19.5228 4 14 4C8.47715 4 4 8.47715 4 14C4 16.3217 4.79326 18.4593 6.13437 20.1584L5.16335 23.9535L9.1994 23.0163C10.6358 23.6489 12.261 24 14 24Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 14H10.01" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 14H14.01" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 14H18.01" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <LeadIcon />,
    iconVariant: "orange",
    title: "Lead Management",
    description:
      "Capture, qualify, and nurture leads through the sales funnel with automated workflows",
  },
  {
    icon: <DatabaseIcon />,
    iconVariant: "blue",
    title: "Customer Database",
    description:
      "Centralized customer information with complete interaction history and preferences",
  },
  {
    icon: <PipelineIcon />,
    iconVariant: "orange",
    title: "Sales Pipeline",
    description:
      "Visual sales pipeline tracking with deal stages, forecasting, and conversion analytics",
  },
  {
    icon: <EmailIcon />,
    iconVariant: "blue",
    title: "Email Marketing",
    description:
      "Create and send targeted email campaigns with templates and performance tracking",
  },
  {
    icon: <CallIcon />,
    iconVariant: "orange",
    title: "Call Management",
    description:
      "Log and track customer calls, schedule follow-ups, and maintain communication history",
  },
  {
    icon: <QuoteIcon />,
    iconVariant: "blue",
    title: "Quote Generation",
    description:
      "Create professional quotations quickly with product catalogs and pricing rules",
  },
  {
    icon: <AnalyticsIcon />,
    iconVariant: "orange",
    title: "Sales Analytics",
    description:
      "Comprehensive reports on sales performance, revenue forecasts, and team productivity",
  },
  {
    icon: <SupportIcon />,
    iconVariant: "blue",
    title: "Customer Support",
    description:
      "Ticket management system for tracking and resolving customer issues efficiently",
  },
];

const ORANGE_ICON_BG = "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.8) 100%)";
const BLUE_ICON_BG = "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.8) 100%)";

// ── Component ──────────────────────────────────────────────────────────────
export default function ERPCRMSection() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 md:py-20">
      <div className="max-w-[1232px] mx-auto px-4 md:px-8 lg:px-10 flex flex-col items-center gap-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 max-w-[672px] text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-[13px] py-2 rounded-full bg-[rgba(233,100,41,0.1)]">
            <span className="text-[14px] font-semibold leading-[1.43] text-[#E96429] font-['Inter',sans-serif]">
              CRM
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-bold text-[28px] md:text-[38px] leading-[1.05] text-[#2251B5]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            CRM Management
          </h2>

          {/* Subtitle */}
          <p
            className="text-base md:text-[20px] leading-[1.4] text-[#4A5565]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Build stronger customer relationships with comprehensive CRM tools
          </p>
        </motion.div>

        {/* ── Feature Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              whileHover={{ y: -4, boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.12)" }}
              className="flex flex-col gap-4 p-6 bg-white border border-[#E0E0E0] rounded-2xl transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
                style={{
                  background:
                    feature.iconVariant === "orange" ? ORANGE_ICON_BG : BLUE_ICON_BG,
                }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                className="font-bold text-[18px] leading-[1.56] text-[#101828]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="text-[14px] leading-relaxed text-[#4A5565]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
