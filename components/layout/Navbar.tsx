"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center justify-center px-4 py-2 rounded-[10px] text-[14px] font-medium transition-colors ${
      isActive
        ? "bg-[#2251B5]/5 text-[#2251B5]"
        : "text-[#4A5565] hover:bg-[#2251B5]/5 hover:text-[#2251B5]"
    }`;
  };

  return (
    <nav className="flex items-center justify-between w-full h-[100px] px-[120px] bg-white border-b border-gray-100">
      <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Innovative Logo"
            width={83}
            height={50}
            className="object-contain"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-1">
          <Link href="/" className={getLinkClasses("/")}>
            Home
          </Link>

          <Link href="/about" className={getLinkClasses("/about")}>
            About Us
          </Link>

          <Link href="/products" className={getLinkClasses("/products")}>
            Products
          </Link>

          <Link href="/services" className={getLinkClasses("/services")}>
            Services
          </Link>

          <Link href="/news-events" className={getLinkClasses("/news-events")}>
            News &amp; Events
          </Link>

          <Link href="/partnerships" className={getLinkClasses("/partnerships")}>
            Partnerships
          </Link>

          <Link href="/contact-us" className={getLinkClasses("/contact-us")}>
            Contact Us
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button
            variant="primary"
            href="/contact-us"
            className="text-[16px]"
          >
            Contact us
          </Button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
