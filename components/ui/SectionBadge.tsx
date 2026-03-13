interface SectionBadgeProps {
  label: string;
  /** Use 'dark' for the CTA section (white/translucent bg on dark gradient) */
  variant?: "light" | "dark";
  icon?: React.ReactNode;
}

export default function SectionBadge({ label, variant = "light", icon }: SectionBadgeProps) {
  if (variant === "dark") {
    return (
      <div className="inline-flex items-center justify-center px-3 py-2 gap-2 bg-white/20 backdrop-blur-sm border border-white/10 rounded-full w-fit">
        {icon}
        <span className="text-white font-semibold text-sm leading-[1.428]">{label}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center justify-center bg-[#E96429]/10 text-[#E96429] px-[13px] py-2 gap-2 rounded-full w-fit">
      {icon}
      <span className="font-semibold text-sm leading-[1.428] text-center">{label}</span>
    </div>
  );
}
