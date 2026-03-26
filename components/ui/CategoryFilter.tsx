"use client";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  className?: string;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onChange,
  className = "",
}: CategoryFilterProps) {
  return (
    <div
      className={`w-full bg-[#F9FAFB] border-b border-[#E5E7EB] ${className}`}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-[120px] py-8">
        {/* Scrollable pill row */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => onChange(category)}
                className={`flex items-center justify-center whitespace-nowrap rounded-full font-medium text-[16px] leading-normal transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-[#E96429] text-white px-[23px] py-[5px] border border-[#E96429] leading-normal"
                    : "bg-white text-[#364153] border border-[#E5E7EB] px-5 py-[6px] hover:border-[#E96429]/50 hover:text-[#E96429]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
