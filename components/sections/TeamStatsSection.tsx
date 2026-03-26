import SectionBadge from "@/components/ui/SectionBadge";
import ShinyCard from "@/components/ui/ShinyCard";

export default function TeamStatsSection() {
  return (
    <section className="w-full flex justify-center py-[80px] px-6 lg:px-[120px] bg-[#F9FAFB]">
      <div className="w-full max-w-[1440px] flex flex-col items-center gap-[64px]">
        {/* Header */}
        <div className="w-full max-w-[672px] flex flex-col items-center gap-[12px]">
          <SectionBadge label="Team" />
          <div className="flex flex-col items-stretch self-stretch gap-[16px]">
            <h2
              className="font-bold text-[38px] leading-[1.052] text-[#2251B5] text-center"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Our Team
            </h2>
            <p className="text-[#4A5565] text-[20px] leading-[1.4] text-center font-['Inter',sans-serif]">
              Let's build something amazing together
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full flex flex-col md:flex-row justify-center items-center self-stretch gap-[32px]">
          {/* Card 1 */}
          <ShinyCard className="flex flex-col justify-center items-center gap-[8px] p-[32px] w-full md:w-[284px] h-[212px]">
            <div className="flex flex-col items-stretch gap-[16px] w-[220px]">
              <div className="flex flex-row justify-center items-center self-stretch gap-[8px] px-[62px]">
                <div
                  className="font-bold text-[48px] leading-none text-center font-['Inter',sans-serif] text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.8) 100%)",
                  }}
                >
                  20+
                </div>
              </div>
              <div className="flex flex-col items-stretch self-stretch gap-[8px]">
                <div className="flex flex-row justify-stretch self-stretch">
                  <h3 className="w-full font-bold text-[20px] leading-[1.4] text-[#101828] text-center font-['Inter',sans-serif]">
                    Leadership Team
                  </h3>
                </div>
                <div className="flex flex-row self-stretch w-full">
                  <p className="w-full text-[#4A5565] text-[16px] leading-normal text-center font-['Inter',sans-serif]">
                    Years of combined experience
                  </p>
                </div>
              </div>
            </div>
          </ShinyCard>

          {/* Card 2 */}
          <ShinyCard 
            className="flex flex-col justify-center items-stretch gap-[8px] p-[32px] w-full md:w-[284px]"
            glowColor="#E96429"
          >
            <div className="flex flex-col items-stretch self-stretch gap-[16px]">
              <div className="flex flex-row justify-center items-center self-stretch gap-[8px] px-[49px]">
                <div
                  className="font-bold text-[48px] leading-none text-center font-['Inter',sans-serif] text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.8) 100%)",
                  }}
                >
                  150+
                </div>
              </div>
              <div className="flex flex-col items-stretch self-stretch gap-[8px]">
                <div className="flex flex-row justify-stretch self-stretch">
                  <h3 className="w-full font-bold text-[20px] leading-[1.4] text-[#101828] text-center font-['Inter',sans-serif]">
                    Engineers
                  </h3>
                </div>
                <div className="flex flex-row justify-center items-center self-stretch gap-[8px] px-[31px]">
                  <p className="w-[157px] text-[#4A5565] text-[16px] leading-normal text-center font-['Inter',sans-serif]">
                    Expert developers and architects
                  </p>
                </div>
              </div>
            </div>
          </ShinyCard>

          {/* Card 3 */}
          <ShinyCard className="flex flex-col justify-center items-stretch gap-[8px] p-[32px] w-full md:w-[284px]">
            <div className="flex flex-col justify-center items-stretch self-stretch gap-[16px]">
              <div className="flex flex-row justify-center items-center self-stretch gap-[8px] px-[61px]">
                <div
                  className="font-bold text-[48px] leading-none text-center font-['Inter',sans-serif] text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(135deg, rgba(233, 100, 41, 1) 0%, rgba(233, 100, 41, 0.8) 100%)",
                  }}
                >
                  30+
                </div>
              </div>
              <div className="flex flex-col items-stretch self-stretch gap-[8px]">
                <div className="flex flex-row justify-stretch self-stretch">
                  <h3 className="w-full font-bold text-[20px] leading-[1.4] text-[#101828] text-center font-['Inter',sans-serif]">
                    Designers
                  </h3>
                </div>
                <div className="flex flex-row justify-center items-center self-stretch gap-[8px] px-[28px]">
                  <p className="w-[163px] text-[#4A5565] text-[16px] leading-normal text-center font-['Inter',sans-serif]">
                    Creative minds crafting experiences
                  </p>
                </div>
              </div>
            </div>
          </ShinyCard>

          {/* Card 4 */}
          <ShinyCard 
            className="flex flex-col justify-center items-stretch gap-[8px] py-[32px] px-[18px] w-full md:w-[270px] h-[212px]"
            glowColor="#E96429"
          >
            <div className="flex flex-col self-stretch gap-[16px]">
              <div className="flex w-[220px] h-[48px] mx-auto relative overflow-hidden">
                <div
                  className="absolute left-[54.97px] top-[-3.78px] w-[110px] h-[48px] font-bold text-[48px] leading-none text-center font-['Inter',sans-serif] text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(135deg, rgba(34, 81, 181, 1) 0%, rgba(34, 81, 181, 0.8) 100%)",
                  }}
                >
                  24/7
                </div>
                <div className="w-[220.05px] h-[48px]"></div>
              </div>
              <div className="flex flex-col self-stretch gap-[8px]">
                <div className="flex flex-row justify-stretch w-[220px] h-[28px] mx-auto">
                  <h3 className="w-full font-bold text-[20px] leading-[1.4] text-[#101828] text-center font-['Inter',sans-serif]">
                    Support
                  </h3>
                </div>
                <div className="flex flex-row justify-center items-center self-stretch">
                  <p className="text-[#4A5565] text-[16px] leading-normal text-center font-['Inter',sans-serif]">
                    Always here when you need us
                  </p>
                </div>
              </div>
            </div>
          </ShinyCard>
        </div>
      </div>
    </section>
  );
}
