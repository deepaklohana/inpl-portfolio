import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import NewsletterSubscribeForm from "@/components/sections/NewsletterSubscribeForm";

// ─── Static Navigation link columns ─────────────────────────────────────────────────
const initialFooterLinks = [
  {
    heading: "Solutions",
    links: [
      { label: "Cloud Services", href: "#" },
      { label: "AI & Analytics", href: "#" },
      { label: "Cybersecurity", href: "#" },
      { label: "Custom Development", href: "#" }
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Partners", href: "#" },
      { label: "Press Kit", href: "#" }
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Blog", href: "/news" },
      { label: "Case Studies", href: "#" }
    ],
  },
];

// ─── Contact info rows ────────────────────────────────────────────────────────
const contactItems = [
  {
    label: "contact@innovative-net.com",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden>
        <path d="M2.5 5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833v8.334a1.667 1.667 0 01-1.667 1.666H4.167A1.667 1.667 0 012.5 14.167V5.833z" stroke="#E96429" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 5.833l7.5 5.417 7.5-5.417" stroke="#E96429" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "(021) 34303051-55",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden>
        <path d="M3.333 3.333h3.334l1.666 4.167-2.083 1.25a9.167 9.167 0 004.167 4.167l1.25-2.084 4.166 1.667v3.333A1.667 1.667 0 0113.167 18.5C5.417 17.5 2.5 14.583 2.5 5a1.667 1.667 0 011.667-1.667" stroke="#E96429" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "41-J, Street-3, Block-6, PECHS, Karachi, Sindh, Pakistan 75400",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden>
        <path d="M10 10.833a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="#E96429" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 1.667C7.1 1.667 4.167 4.033 4.167 8.333c0 3.333 4.167 8.75 5.416 10.209a.556.556 0 00.834 0c1.25-1.459 5.416-6.876 5.416-10.209 0-4.3-2.933-6.666-5.833-6.666z" stroke="#E96429" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// ─── Social icons (LinkedIn, Twitter, Facebook, Instagram) —────────────────
const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/innovative-network-pvt-ltd",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" aria-hidden>
        <path d="M15.833 2.5H4.167A1.667 1.667 0 002.5 4.167v11.666A1.667 1.667 0 004.167 17.5h11.666A1.667 1.667 0 0017.5 15.833V4.167A1.667 1.667 0 0015.833 2.5z" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.667 9.167v4.166M6.667 6.667v.008M10 13.333v-2.5c0-1.15.933-2.083 2.083-2.083s2.084.933 2.084 2.083v2.5M10 9.167v4.166" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  // {
  //   label: "Twitter",
  //   href: "#",
  //   icon: (
  //     <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" aria-hidden>
  //       <path d="M18.333 2.5a9.58 9.58 0 01-2.75 1.258A3.917 3.917 0 0010 7.083v.834a9.333 9.333 0 01-7.917-4.25s-3.333 7.5 4.167 10.833a10.167 10.167 0 01-5.833 1.667C8.75 19.583 17.5 15.833 17.5 7.083c0-.233-.024-.464-.071-.693A6.583 6.583 0 0018.333 2.5z" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  //     </svg>
  //   ),
  // },
  {
    label: "Facebook",
    href: "https://www.facebook.com/innovativenetworkltd/",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" aria-hidden>
        <path d="M15 2.5H13.333A3.333 3.333 0 0010 5.833V7.5H8.333v2.5H10v6.667h2.5V10h2.5l.833-2.5H12.5V5.833A.833.833 0 0113.333 5H15V2.5z" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/innovativenetworkltd?igsh=NWpleDE2cnZrZTU=",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" aria-hidden>
        <rect x="2.5" y="2.5" width="15" height="15" rx="4" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="3" stroke="#99A1AF" strokeWidth="1.5" />
        <circle cx="14.5" cy="5.5" r="0.5" fill="#99A1AF" />
      </svg>
    ),
  },
];

export default async function Footer() {
  const publishedProducts = await prisma.product.findMany({
    where: { status: "published" },
    select: { name: true, slug: true },
    orderBy: { sortOrder: 'asc' },
    take: 4,
  });

  const productLinks = publishedProducts.map(p => ({
    label: p.name,
    href: `/products/${p.slug}`
  }));

  const footerLinks = [
    initialFooterLinks[0], // Solutions
    {
      heading: "Products",
      links: productLinks.length > 0 ? productLinks : [
        { label: "Products loading...", href: "#" }
      ],
    },
    initialFooterLinks[1], // Company
    initialFooterLinks[2], // Resources
  ];

  return (
    <footer 
      className="relative w-full overflow-hidden" 
      style={{ 
        backgroundColor: "#1E1F21", 
        marginTop: "-110px", 
        clipPath: "polygon(0 110px, 100% 20px, 100% 100%, 0 100%)" 
      }}
    >



      {/* ── Decorative blur circles (Figma: blur 128px, opacity 5%) */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ top: 80, right: "7%", width: 384, height: 384, borderRadius: "50%", background: "#E96429", filter: "blur(128px)", opacity: 0.05 }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ bottom: 0, left: "5%", width: 384, height: 384, borderRadius: "50%", background: "#2251B5", filter: "blur(128px)", opacity: 0.05 }}
      />

      <Container className="relative z-10 pt-[149px] pb-0">
        {/* ── Top Section: Logo + Newsletter | Get in Touch ─────────────────── */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 pb-10">

          {/* Left — Logo + description + newsletter */}
          <div className="flex flex-col gap-6 max-w-[592px]">
            {/* Logo — use the original colour logo (not inverted) */}
            <Link href="/" className="inline-block w-fit">
              <Image
                src="/image 1.png"
                alt="Innovative Network"
                width={284}
                height={79}
                className="object-contain"
                style={{ maxWidth: 200, height: "auto" }}
                priority
              />
            </Link>

            {/* Figma: Inter 400 16px lh 1.625 #D1D5DC */}
            <p
              className="text-[#D1D5DC] text-base leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Subscribe to our newsletter for the latest updates on products,
              insights, and exclusive offers.
            </p>

            {/* Email + Subscribe row — Live form, saves to DB */}
            <div className="relative w-full">
              <NewsletterSubscribeForm source="footer" theme="dark" />
            </div>
          </div>

          {/* Right — Get in Touch */}
          <div className="flex flex-col gap-[52px] lg:w-[477px] shrink-0">
            {/* Figma: Inter 700 20px lh 1.4 white */}
            <h3
              className="text-white font-bold text-xl"
              style={{ fontFamily: "'Inter', sans-serif", lineHeight: "1.4" }}
            >
              Get in Touch
            </h3>
            <div className="flex flex-col gap-[56px]">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  {/* Icon box — white/10 bg, 40×40, radius 10 */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-[10px] shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="text-[#D1D5DC] text-base"
                    style={{ fontFamily: "'Inter', sans-serif", lineHeight: "1.5" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider */}
        <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

        {/* ── Nav Link Columns — Figma: row, 4-col, padding bottom 65px */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 pb-16">
          {footerLinks.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              {/* Figma: Inter 700 18px lh 1.556 white */}
              <h4
                className="text-white font-bold"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: "1.556" }}
              >
                {col.heading}
              </h4>
              {/* Figma: Inter 400 16px lh 1.5 #99A1AF, gap 12px */}
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#99A1AF] text-base hover:text-white transition-colors duration-200"
                      style={{ fontFamily: "'Inter', sans-serif", lineHeight: "1.5" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar — Figma: row, space-between, y:703 */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          {/* Copyright — Figma: Inter 400 14px lh 1.428 #99A1AF */}
          <p
            className="text-[#99A1AF] text-sm order-3 sm:order-1"
            style={{ fontFamily: "'Inter', sans-serif", lineHeight: "1.43" }}
          >
            © 2026 Innovative Network. All rights reserved.
          </p>

          {/* Social Icons — Figma: row, gap 12px, each 40×40 rounded squares */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {socialLinks.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {s.icon}
              </Link>
            ))}
          </div>

          {/* Legal Links — Figma: row, gap 24px, Inter 400 14px #99A1AF */}
          <div className="flex items-center gap-6 order-2 sm:order-3">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-[#99A1AF] text-sm hover:text-white transition-colors duration-200"
                style={{ fontFamily: "'Inter', sans-serif", lineHeight: "1.43" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
