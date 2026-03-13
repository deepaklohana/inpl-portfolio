import SectionBadge from "./SectionBadge";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  titleColor?: string;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  titleColor = "#101828",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {badge && <SectionBadge label={badge} />}
      <h2
        className="font-bold text-3xl md:text-[38px] leading-[1.05] tracking-[-0.03em]"
        style={{ color: titleColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#3C3C3B] text-base md:text-[18px] leading-[1.55]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
