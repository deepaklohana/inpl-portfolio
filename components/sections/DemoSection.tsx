"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function DemoSection() {
  const [email, setEmail] = useState("");

  return (
    // Figma 130:86 — bg #2251B5, w:1440, h:402
    // Ellipse 7 (260px): x:1284 y:-58 — top right, partially off-screen
    // Ellipse 9 (40px):  x:69   y:52  — small top left
    // Ellipse 10 (40px): x:1323 y:307 — small bottom right
    // Ellipse (234px):   x:-107 y:146 — large left, partially off-screen (from footer Figma Ellipse 8)
    <section className="relative w-full overflow-hidden   " style={{ backgroundColor: "#2251B5", minHeight: 402 }}>

      {/* Ellipse 7 — large 260px top-right */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 260, height: 260, background: "#E96429", top: -58, right: -90 }}
      />


      {/* Ellipse 9 — small 40px top-left area */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 40, height: 40, background: "#E96429", top: 52, left: 69 }}
      />

      {/* Ellipse 10 — small 40px bottom-right */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 40, height: 40, background: "#E96429", top: 307, right: 117 }}
      />

      {/* Ellipse (234px) — large left side, partially off-screen */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 234, height: 234, background: "#E96429", top: 256, left: -107, }}
      />
      <Container>
        {/* Frame 41 — column, gap 40px, centered, max-w 896px, y:105 */}
        <ScrollReveal variant="scale" className="flex flex-col items-center gap-10 max-w-[896px] mx-auto relative z-10 pt-[105px] pb-[215px]">

          {/* Frame 39 — heading + subtitle, gap 16px */}
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Plus Jakarta Sans 700 48px lh 1.25 tracking -2.5% white center */}
            <h2
              className="text-white font-bold text-center w-full"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: "1.25",
                letterSpacing: "-0.025em",
              }}
            >
              See our products in action
            </h2>

            {/* Inter 400 20px lh 1.625 rgba(255,255,255,0.9) center */}
            <p
              className="text-center w-full"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 20,
                lineHeight: "1.625",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Schedule a personalized demo and discover how our solutions can transform your business.
            </p>
          </div>

          {/* Frame 40 — column, gap 25px, centered */}
          <div className="flex flex-col items-center gap-[25px] w-full">
            {/* Row: input + button — w:576 h:56, gap 16px */}
            <div className="flex flex-row gap-4 w-full max-w-[576px]">
              {/* input — fill, h:56, padding 16px 24px, bg white, border-radius 10px */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="grow h-14 px-6 rounded-[10px] bg-white outline-none text-[#6A7282] placeholder:text-[#6A7282] text-base"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />

              {/* button — bg #E96429, padding 14px 29px, h:56, border-radius 10px */}
              <Button
                variant="primary"
                onClick={() => {}}
                className="bg-[#E96429]! hover:bg-[#cf5824]! rounded-[10px]! px-[29px]! py-[14px]! shrink-0 whitespace-nowrap"
              >
                Request Demo
              </Button>
            </div>

            {/* Inter 400 14px lh 1.428 rgba(255,255,255,0.7) center */}
            <p
              className="text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                lineHeight: "1.4286",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Join 500+ businesses already transforming with us
            </p>
          </div>

        </ScrollReveal>
      </Container>
    </section>
  );
}
