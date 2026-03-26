import Image from "next/image";

export default function PartnerMarquee({ className }: { className?: string }) {
  return (
    <div className={`absolute bottom-0 left-0 w-full overflow-hidden bg-transparent py-4 opacity-30 select-none flex ${className || ""}`}>
      <div className="flex w-max min-w-full animate-marquee gap-16 pr-16 items-center">
        {/* First Set */}
        <div className="flex items-center gap-16">
          <div className="w-[89px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-1.png" alt="Partner 1" fill className="object-contain" />
          </div>
          <div className="w-[249px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-2.png" alt="Partner 2" fill className="object-contain" />
          </div>
          <div className="w-[119px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-3.png" alt="Partner 3" fill className="object-contain" />
          </div>
          <div className="w-[103px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-4.png" alt="Partner 4" fill className="object-contain" />
          </div>
          <div className="w-[89px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-5.png" alt="Partner 5" fill className="object-contain" />
          </div>
          <div className="w-[191px] h-[46px] relative shrink-0">
            <Image src="/images/partners/partner-6-46dd6d.png" alt="Partner 6" fill className="object-contain" />
          </div>
        </div>
        {/* Duplicated for infinite scroll */}
        <div className="flex items-center gap-16">
          <div className="w-[89px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-1.png" alt="Partner 1" fill className="object-contain" />
          </div>
          <div className="w-[249px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-2.png" alt="Partner 2" fill className="object-contain" />
          </div>
          <div className="w-[119px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-3.png" alt="Partner 3" fill className="object-contain" />
          </div>
          <div className="w-[103px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-4.png" alt="Partner 4" fill className="object-contain" />
          </div>
          <div className="w-[89px] h-[35px] relative shrink-0">
            <Image src="/images/partners/partner-5.png" alt="Partner 5" fill className="object-contain" />
          </div>
          <div className="w-[191px] h-[46px] relative shrink-0">
            <Image src="/images/partners/partner-6-46dd6d.png" alt="Partner 6" fill className="object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}

