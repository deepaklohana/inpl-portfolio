"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface NewsletterCTASectionProps {
  title?: string;
  subtitle?: string;
}

export default function NewsletterCTASection({
  title = "Never Miss an Update",
  subtitle = "Subscribe to our newsletter for the latest news, insights, product updates, and event announcements",
}: NewsletterCTASectionProps) {
  const [email, setEmail] = useState("");

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#2251B5", minHeight: 402 }}
    >
      {/* ── Decorative orange ellipses — Figma absolute positions ────────────── */}
      {/* Large ellipse — top-right: x:1284, y:-58, 260×260 */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          top: -58,
          right: 0,
          background: "#E96429",
          opacity: 0.35,
          filter: "blur(60px)",
        }}
      />
      {/* Small ellipse — left: x:69, y:52, 40×40 */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 40, height: 40, top: 52, left: 69, background: "#E96429", opacity: 0.6 }}
      />
      {/* Small ellipse — bottom-right: x:1323, y:307, 40×40 */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 40, height: 40, bottom: 95, right: 117, background: "#E96429", opacity: 0.6 }}
      />

      {/* ── Content — centered, max-w 628px ────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 py-[120px]">
        {/* Text block */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[628px]">
          {/* Title — Plus Jakarta Sans 700 48px lh 1.25 letter-spacing -2.5% */}
          <h2
            className="text-white font-bold text-[32px] sm:text-[40px] md:text-[48px]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: "1.25",
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </h2>

          {/* Subtitle — Inter 400 20px lh 1.4 white/90 */}
          <p
            className="text-white/90 text-[16px] sm:text-[18px] md:text-[20px] leading-[1.4] px-0 sm:px-[120px] md:px-0"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Email input row — 470px wide, 60px height, border-white, br-12 */}
        <div
          className="flex w-full max-w-[470px] rounded-xl overflow-hidden border border-white"
          style={{ height: 60 }}
        >
          {/* Input field */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 bg-transparent text-white placeholder:text-white/60 text-[14px] px-4 outline-none"
            style={{ fontFamily: "Inter, sans-serif" }}
          />

          {/* Submit button — white bg, blue text, br-12, px-6 py-4 */}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 px-6 shrink-0 rounded-xl font-semibold text-[16px] leading-normal bg-white text-[#2251B5] hover:bg-white/90 transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif", margin: 6 }}
            onClick={() => setEmail("")}
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </section>
  );
}
