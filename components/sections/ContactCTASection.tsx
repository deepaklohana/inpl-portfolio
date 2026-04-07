import Link from "next/link";

interface CTAButton {
  label: string;
  href: string;
  variant: "primary" | "outline";
}

interface ContactCTASectionProps {
  title?: string;
  description?: string;
  buttons?: CTAButton[];
}

export default function ContactCTASection({
  title = "Ready to Get Started?",
  description = "Let's discuss how Innovative Network can transform your business",
  buttons = [
    { label: "Schedule Free Demo", href: "/contact-us", variant: "primary" },
    { label: "View Our Products", href: "/products", variant: "outline" },
  ],
}: ContactCTASectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden py-[124px]"
      style={{ backgroundColor: "#2251B5", minHeight: 402 }}
    >
      <div className="absolute inset-0 max-w-[1440px] mx-auto pointer-events-none">
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{ width: 260, height: 260, top: -58, left: 1284, background: "#E96429" }}
        />
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{ width: 40, height: 40, top: 52, left: 69, background: "#E96429" }}
        />
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{ width: 40, height: 40, top: 307, left: 1323, background: "#E96429" }}
        />
      </div>

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
            {title}
          </h2>
          <p
            className="text-white/90 text-[20px] leading-[1.4]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {buttons.map((btn, idx) => (
            <Link
              key={idx}
              href={btn.href}
              className={
                btn.variant === "primary"
                  ? "inline-flex items-center justify-center px-6 py-4 rounded-[12px] text-[#2251B5] bg-white font-semibold text-[16px] leading-normal transition-opacity hover:opacity-90"
                  : "inline-flex items-center justify-center px-6 py-4 rounded-[12px] text-white font-semibold text-[16px] leading-normal border-2 border-white transition-colors hover:bg-white/10"
              }
              style={{
                fontFamily: "Inter, sans-serif",
                ...(btn.variant === "primary"
                  ? {
                      boxShadow:
                        "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
                    }
                  : {}),
              }}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
