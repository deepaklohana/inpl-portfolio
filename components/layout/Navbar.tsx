"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center justify-center px-4 py-2 rounded-[10px] text-[14px] font-medium transition-colors ${
      isActive
        ? "bg-[#2251B5]/5 text-[#2251B5]"
        : "text-[#4A5565] hover:bg-[#2251B5]/5 hover:text-[#2251B5]"
    }`;
  };

  const getMobileLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
      isActive
        ? "bg-[#2251B5]/10 text-[#2251B5]"
        : "text-[#4A5565] hover:bg-gray-50 hover:text-[#2251B5]"
    }`;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "News & Events", href: "/news" },
    { name: "Partnerships", href: "/partnerships" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  return (
    <nav className="flex items-center justify-between w-full h-[80px] lg:h-[100px] px-6 lg:px-[120px] bg-white border-b border-gray-100 relative z-50">
      <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">

        {/* Logo */}
        <Link href="/" className="shrink-0" onClick={closeMobileMenu}>
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
        <div className="hidden lg:flex items-center justify-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={getLinkClasses(link.href)}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button
            variant="primary"
            href="/contact-us"
            className="text-[16px]"
          >
            Contact us
          </Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 text-gray-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[80px] lg:top-[100px] left-0 w-full bg-white border-b border-gray-100 shadow-lg lg:hidden py-4 px-6 flex flex-col gap-2 z-50"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={getMobileLinkClasses(link.href)}
                onClick={closeMobileMenu}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 w-full">
              <Button
                variant="primary"
                href="/contact-us"
                className="w-full text-center text-[16px] justify-center flex"
                onClick={closeMobileMenu}
              >
                Contact us
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
