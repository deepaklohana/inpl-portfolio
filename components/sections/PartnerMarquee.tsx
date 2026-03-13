export default function PartnerMarquee({ className }: { className?: string }) {
  return (
    <div className={`absolute bottom-0 left-0 w-full overflow-hidden bg-transparent py-4 opacity-30 select-none flex ${className || ""}`}>
      <div className="flex w-max min-w-full animate-marquee gap-16 pr-16 items-center">
        {/* First Set */}
        <div className="flex items-center gap-16">
          <div className="w-[89px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[249px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[119px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[103px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[89px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[191px] h-[46px] bg-zinc-300 rounded shrink-0"></div>
        </div>
        {/* Duplicated for infinite scroll */}
        <div className="flex items-center gap-16">
          <div className="w-[89px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[249px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[119px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[103px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[89px] h-[35px] bg-zinc-300 rounded shrink-0"></div>
          <div className="w-[191px] h-[46px] bg-zinc-300 rounded shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
