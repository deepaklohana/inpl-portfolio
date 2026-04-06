"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function ProductCTASection() {
  return (
    // Section: 1440×402px, bg #2251B5
    <section
      className="relative w-full overflow-hidden bg-[#2251B5]"
      style={{ minHeight: "402px", paddingTop: "124px", paddingBottom: "124px" }}
    >
      {/*
        Ellipse 7 — 260×260, orange, at x:1284, y:-58 in a 1440px canvas
        = right: calc(1440 - 1284 - 260)px from right = -104px from right (overflows)
        top: -58px (overflows upward)
      */}
      <div
        className="absolute rounded-full bg-[#E96429] pointer-events-none"
        style={{
          width: "260px",
          height: "260px",
          top: "-58px",
          right: "-104px",
        }}
      />

      {/*
        Ellipse 9 — 40×40, orange, at x:69, y:52 in 1440px canvas
        = left: 69px, top: 52px
      */}
      <div
        className="absolute rounded-full bg-[#E96429] pointer-events-none"
        style={{
          width: "40px",
          height: "40px",
          top: "52px",
          left: "69px",
        }}
      />

      {/*
        Ellipse 10 — 40×40, orange, at x:1323, y:307 in 1440px canvas
        = right: calc(1440 - 1323 - 40)px from right = 77px from right
        top: 307px from section top
      */}
      <div
        className="absolute rounded-full bg-[#E96429] pointer-events-none"
        style={{
          width: "40px",
          height: "40px",
          top: "307px",
          right: "77px",
        }}
      />

      {/* Content: centered, max-width 896px, layout_NXCN9G: column, alignItems center, gap 33px */}
      <div className="relative z-10 flex justify-center px-4 sm:px-6 lg:px-8 lg:h-[320px]">
        <ScrollReveal className="flex flex-col items-center w-full max-w-[896px] gap-8">

          {/* Text block: column, gap 16px, center aligned */}
          <div className="flex flex-col items-center gap-4 text-center w-full">
            {/* Plus Jakarta Sans 700, 48px, lh 1.25, letter-spacing -2.5%, white */}
            <h2
              className="font-bold text-white text-center"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(2rem, 4vw, 48px)",
                lineHeight: "1.25",
                letterSpacing: "-0.025em",
              }}
            >
              Ready to Transform Your Business?
            </h2>

            {/* Inter 400, 20px, lh 1.4, rgba(255,255,255,0.9) */}
            <p
              className="text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(1rem, 2vw, 20px)",
                lineHeight: "1.4",
                color: "rgba(255, 255, 255, 0.9)",
                maxWidth: "844px",
              }}
            >
              Get started with a free demo and see how our products can revolutionize your operations
            </p>
          </div>

          {/* Buttons row: layout_O947UR — row, justifyContent center, gap 16px */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary button: bg white filled, shadow, borderRadius 12px, padding 16px 25px */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact-us"
                className="flex items-center justify-center bg-white text-[#2251B5] rounded-xl font-semibold transition-shadow hover:shadow-xl"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  padding: "16px 25px",
                  borderRadius: "12px",
                  boxShadow:
                    "0px 8px 10px -6px rgba(0,0,0,0.1), 0px 20px 25px -5px rgba(0,0,0,0.1)",
                }}
              >
                Schedule Free Demo
              </Link>
            </motion.div>

            {/* Outline button: transparent bg, 2px white border, borderRadius 12px, padding 16px 27px */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact-us"
                className="flex items-center justify-center bg-transparent text-white font-semibold border-2 border-white hover:bg-white/10 transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  padding: "16px 27px",
                  borderRadius: "12px",
                }}
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
}
