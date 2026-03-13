import SectionBadge from "@/components/ui/SectionBadge";
import { CTACard } from "@/components/ui/Card";

// Figma: stats row — Inter 700 30px for value, Inter 400 14px (white/70) for label
const stats = [
  { value: "2.5x", label: "ROI Average" },
  { value: "48hrs", label: "Quick Start" },
  { value: "100%", label: "Satisfaction" },
];

// Figma: two CTA cards, primary (white bg) and glass (white/10 bg + border)
const ctaCards = [
  {
    title: "Schedule a Demo",
    description: "See our solutions in action with a personalized walkthrough from our experts",
    linkLabel: "Book Your Demo",
    // Calendar icon path
    svgPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    variant: "primary" as const,
  },
  {
    title: "Talk to an Expert",
    description: "Get personalized consultation and answers to all your questions",
    linkLabel: "Contact Us Now",
    // Chat bubble icon path
    svgPath: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    variant: "glass" as const,
  },
];

export default function CTASection() {
  return (
    // Figma: linear-gradient 135deg → #1d1d1d 0% → #2251B5 50% → #E96429 100%
    <section className="relative w-full py-24 overflow-hidden" style={{
      background: "linear-gradient(135deg, rgba(29,29,29,1) 0%, rgba(34,81,181,1) 50%, rgba(233,100,41,1) 100%)"
    }}>
      {/* Figma: radial decorative overlays at 20/50% and 80/80% */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 50%)",
        opacity: 0.3
      }} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Figma: 2-col layout, left at x:120, right at x:732, gap ~120px */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column — column gap 40px */}
          <div className="flex flex-col items-start gap-10">
            {/* Figma: badge bg rgba(255,255,255,0.2), padding 8px 12px, border white/10, white font */}
            <SectionBadge label="Let's Get Started" variant="dark" />

            {/* Figma: Plus Jakarta Sans 700, 48px, lh 1.25 */}
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2.25rem, 4vw, 3rem)", lineHeight: "1.25" }}>
              Ready to Transform{" "}
              <span className="text-[#E96429]">Your Business?</span>
            </h2>

            {/* Figma: Inter 400, 20px, lh 1.625, color rgba(255,255,255,0.9) */}
            <p className="text-[20px] text-white/90 max-w-xl leading-relaxed font-['Inter',sans-serif]">
              Join hundreds of companies that have revolutionized their operations with our solutions.
              Let&apos;s discuss how we can help you achieve your goals.
            </p>

            {/* Stats Row — Figma: row, 3 stats, each 181px wide, no explicit gap divider in layout */}
            <div className="flex flex-wrap gap-8 pt-2">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-8">
                  <div>
                    {/* Figma: Inter 700, 30px, lh 1.2, white */}
                    <div className="text-[30px] font-bold text-white mb-1 font-['Inter',sans-serif]">{stat.value}</div>
                    {/* Figma: Inter 400, 14px, lh 1.428, rgba(255,255,255,0.7) */}
                    <div className="text-[#ffffffb3] text-[14px] font-['Inter',sans-serif]">{stat.label}</div>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="w-px bg-white/20 hidden sm:block self-stretch" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Figma: width 588, column gap 24px, starting y:80 */}
          <div className="flex flex-col gap-6 lg:pl-10">
            {ctaCards.map((card) => (
              <CTACard key={card.title} {...card} />
            ))}

            {/* Avatar strip — Figma: avatars -space-x-4, border #2251B5, text white/80, Inter 400 14px */}
            <div className="flex items-center gap-4 pt-2 pl-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#2251B5] overflow-hidden bg-gray-200">
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt={`Avatar ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-white/80 text-[14px] font-['Inter',sans-serif]">
                Join 500+ satisfied clients worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
