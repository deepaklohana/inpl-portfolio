import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost-link" | "white" | "glass";

interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  variant = "primary",
  children,
  href,
  onClick,
  icon,
  className = "",
  type = "button",
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 group";

  const variants: Record<ButtonVariant, string> = {
    // Figma: padding 18px 32px, height 56px, border-radius 12px, bg #2251B5, font Plus Jakarta Sans 600 16px
    primary:
      "bg-[#2251B5] hover:bg-[#E96429] text-white hover:text-[#101828] px-8 py-[18px] rounded-xl h-14 font-['Plus_Jakarta_Sans',sans-serif]",
    // Figma: padding 16px 32px, border-radius 10px, border 2px #D1D5DC, font Inter 500 16px
    outline:
      "border-2 border-[#D1D5DC] hover:border-[#9CA3AF] hover:bg-gray-50 text-[#101828] px-8 py-4 rounded-[10px] font-medium",
    // Text + arrow link — used in cards
    "ghost-link":
      "text-[#E96429] group p-0 bg-transparent font-semibold",
    // CTA: white background
    white:
      "bg-white hover:bg-gray-100 text-[#2251B5] hover:text-[#101828] px-10 py-[18px] rounded-2xl h-[60px] font-['Plus_Jakarta_Sans',sans-serif]",
    // CTA: glass background
    glass:
      "bg-white/10 hover:bg-white/20 border-2 border-white text-white hover:text-white px-9 py-[18px] rounded-2xl h-[60px] font-['Plus_Jakarta_Sans',sans-serif] backdrop-blur-sm",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const content = (
    <>
      {children}
      {variant === "ghost-link"
        ? (icon ?? <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />)
        : icon}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
