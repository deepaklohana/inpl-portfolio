import Link from "next/link";

export default function ContactCTASection() {
  return (
    <section
      className="relative w-full overflow-hidden py-[124px]"
      style={{ backgroundColor: "#2251B5", minHeight: 402 }}
    >
      {/* Decorative orange ellipses matching Figma */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 260, height: 260, top: -58, right: 0, background: "#E96429", opacity: 0.35, filter: "blur(60px)" }}
      />
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 40, height: 40, top: 52, left: 69, background: "#E96429", opacity: 0.6 }}
      />
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 40, height: 40, bottom: 95, right: 117, background: "#E96429", opacity: 0.6 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-[896px] mx-auto text-center">
        {/* Text */}
        <div className="flex flex-col gap-4">
          <h2
            className="text-white font-bold"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: "1.25",
              letterSpacing: "-0.025em",
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            className="text-white/90 text-[20px] leading-[1.4]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Let&apos;s discuss how Innovative Network can transform your business
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-4 rounded-[12px] text-[#2251B5] bg-white font-semibold text-[16px] leading-normal transition-opacity hover:opacity-90"
            style={{
              fontFamily: "Inter, sans-serif",
              boxShadow: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
            }}
          >
            Schedule Free Demo
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-4 rounded-[12px] text-white font-semibold text-[16px] leading-normal border-2 border-white transition-colors hover:bg-white/10"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            View Our Products
          </Link>
        </div>
      </div>
    </section>
  );
}
