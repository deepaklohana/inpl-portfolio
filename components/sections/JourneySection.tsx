import SectionBadge from "@/components/ui/SectionBadge";

const milestones = [
  {
    year: "2010",
    title: "Company Founded",
    description: "Started with a vision to transform digital experiences",
    align: "left",
  },
  {
    year: "2013",
    title: "First Enterprise Client",
    description: "Secured our first Fortune 500 partnership",
    align: "right",
  },
  {
    year: "2016",
    title: "Global Expansion",
    description: "Opened offices in 5 countries across 3 continents",
    align: "left",
  },
  {
    year: "2019",
    title: "AI Innovation Lab",
    description: "Launched dedicated AI research and development center",
    align: "right",
  },
  {
    year: "2022",
    title: "1000+ Clients",
    description: "Reached milestone of serving over 1000 businesses worldwide",
    align: "left",
  },
  {
    year: "2024",
    title: "Industry Leader",
    description: "Recognized as a leader in digital transformation solutions",
    align: "right",
  },
];

export default function JourneySection() {
  return (
    <section className="relative w-full flex justify-center py-12 md:py-[80px] bg-white overflow-hidden">
      {/* Background Ellipses */}
      <div className="absolute top-0 right-[-100px] w-[343px] h-[307px] bg-[#2251B5]/20 rounded-full blur-[150px] md:blur-[300px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 left-[-50px] w-[343px] h-[307px] bg-[#E96429]/15 rounded-full blur-[150px] md:blur-[300px] mix-blend-multiply pointer-events-none" />

      <div className="w-full max-w-[1200px] px-6 lg:px-[120px] flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center mb-16 md:mb-[64px] z-10">
          <SectionBadge label="Journey" />
          <h2
            className="font-bold text-3xl md:text-[38px] leading-[1.052] text-[#2251B5] mt-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Our Journey
          </h2>
          <p className="text-[#4A5565] text-lg md:text-[20px] leading-[1.4] max-w-[600px] font-['Inter',sans-serif]">
            Key milestones that shaped our growth
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full max-w-[960px] flex flex-col z-10">
          {/* Vertical Center Gradient Line (Hidden on mobile, visible on lg) */}
          <div className="absolute left-[24px] lg:left-1/2 top-4 bottom-4 w-1 lg:-ml-[2px] rounded-full bg-linear-to-b from-[#2251B5] to-[#E96429] opacity-20" />

          <div className="flex flex-col gap-8 md:gap-12">
            {milestones.map((milestone, index) => {
              const isLeft = milestone.align === "left";
              return (
                <div
                  key={milestone.year}
                  className={`relative flex flex-col lg:flex-row items-start lg:items-center w-full gap-8 lg:gap-0
                    ${isLeft ? "lg:justify-start" : "lg:justify-end"}`}
                >
                  {/* Timeline Dot (Mobile & Desktop) */}
                  <div
                    className={`absolute left-[9px] lg:left-1/2 top-[32px] lg:top-1/2 w-8 h-8 rounded-full border-[3px] border-white shadow-md shrink-0 z-20 
                      -translate-y-1/2 lg:-translate-x-1/2
                      ${isLeft ? "bg-[#E96429]" : "bg-[#2251B5]"}`}
                  />

                  {/* Content Card (Left or Right on Desktop, always right-aligned to line on mobile) */}
                  <div
                    className={`w-full lg:w-[calc(50%-2rem)] pl-16 lg:pl-0 flex flex-col
                      ${isLeft ? "lg:pr-12 lg:items-end lg:text-right" : "lg:pl-12 lg:items-start lg:text-left"}`}
                  >
                    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <span
                        className={`font-bold text-2xl font-['Inter',sans-serif] block mb-2
                          ${isLeft ? "text-[#E96429]" : "text-[#2251B5]"}`}
                      >
                        {milestone.year}
                      </span>
                      <h3 className="text-[#101828] text-xl font-bold font-['Inter',sans-serif] mb-2 leading-[1.4]">
                        {milestone.title}
                      </h3>
                      <p className="text-[#4A5565] text-base leading-normal font-['Inter',sans-serif]">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
