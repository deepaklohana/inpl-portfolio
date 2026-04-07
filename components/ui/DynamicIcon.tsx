import React from 'react';
import * as LucideIcons from 'lucide-react';

// ============================================================================
// ICON REGISTRY
// ============================================================================
// Import only the specific react-icons you are using to avoid massive bundle size.
// Do NOT import * as FaIcons from 'react-icons/fa', it will break tree-shaking!
import { FaReact,FaFigma, FaAws, FaNodeJs, FaGoogle, FaAndroid, FaApple, FaFacebookF, FaInstagram,FaTiktok } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiFigma, SiVercel, SiNestjs, SiPostgresql, SiMongodb,SiGoogleads } from 'react-icons/si';
import { TbBrandAdobeXd,TbBrandAdobeAfterEffect,TbBrandAdobeIllustrator,TbBrandAdobePhotoshop } from "react-icons/tb";
import { PiSketchLogoLight } from "react-icons/pi";
import { RiInvisionLine } from "react-icons/ri";
import { RxSketchLogo } from "react-icons/rx";
import { FaXTwitter } from "react-icons/fa6";
import { FiLinkedin,FiYoutube } from "react-icons/fi";
import { ImPinterest2 } from "react-icons/im";








// Add the imported icons to this map.
// The key is the exact string you will type in the Admin panel (e.g., "FaReact" or "SiNextdotjs").
export const iconRegistry: Record<string, React.ElementType> = {
  // FontAwesome (Fa)
  FaReact,
  FaAws,
  FaNodeJs,
  FaGoogle,
  FaAndroid,
  FaApple,
  FaFigma,
  FaFacebookF, 
  FaInstagram,
  FaTiktok,
  
  // SimpleIcons (Si)
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiFigma,
  SiVercel,
  SiNestjs,
  SiPostgresql,
  SiMongodb,
  SiGoogleads,

  // Tb
  TbBrandAdobeXd,
  TbBrandAdobeAfterEffect,
  TbBrandAdobeIllustrator,
  TbBrandAdobePhotoshop,

  // Pi
  PiSketchLogoLight, 

  // Ri
  RiInvisionLine,

  // Rx
  RxSketchLogo,

  // Fa6
  FaXTwitter,

  // Fi
  FiLinkedin,
  FiYoutube,

  // Im
  ImPinterest2,
};

// ============================================================================
// COMPONENT
// ============================================================================

export interface DynamicIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name?: string | null;
  className?: string;
  size?: number | string;
  fallbackName?: string;
}

export default function DynamicIcon({ 
  name, 
  className = '', 
  size,
  fallbackName = 'HelpCircle',
  ...props 
}: DynamicIconProps) {
  if (!name) return null;

  // 1. Support Emojis naturally (e.g., "🚀" or "⚛️")
  if (/\p{Emoji}/u.test(name) && name.length < 5) {
    return (
      <span className={className} style={{ fontSize: size }} aria-hidden="true">
        {name}
      </span>
    );
  }

  // 2. Check Custom Registry (react-icons)
  if (iconRegistry[name]) {
    const CustomIcon = iconRegistry[name];
    return <CustomIcon className={className} size={size} {...props} />;
  }

  // 3. Fallback to Lucide React Icons
  let LucideComponent = (LucideIcons as any)[name];

  if (!LucideComponent) {
    // Try PascalCase
    const pascal = name.charAt(0).toUpperCase() + name.slice(1);
    LucideComponent = (LucideIcons as any)[pascal];
  }

  if (!LucideComponent && name.includes('-')) {
    // Try kebab-case to PascalCase (e.g., 'help-circle' -> 'HelpCircle')
    const camel = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    LucideComponent = (LucideIcons as any)[camel];
  }

  // Final fallback if nothing is found
  const FinalIcon = LucideComponent || (LucideIcons as any)[fallbackName] || LucideIcons.HelpCircle;

  return <FinalIcon className={className} size={size || 24} {...props} />;
}
