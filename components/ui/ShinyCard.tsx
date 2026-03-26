"use client";

import { useCallback, useRef } from "react";
import { useMousePosition } from "@/lib/hooks/useMousePosition";
import { cn } from "@/lib/utils";

export default function ShinyCard({ 
  children, 
  className,
  glowColor = "#2251B5"
}: { 
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!overlayRef.current) {
      return;
    }

    const { width, height } = overlayRef.current?.getBoundingClientRect() ?? {};
    const xOffset = x - width / 2;
    const yOffset = y - height / 2;

    overlayRef.current?.style.setProperty("--x", `${xOffset}px`);
    overlayRef.current?.style.setProperty("--y", `${yOffset}px`);
  }, []);

  useMousePosition(containerRef, update);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative isolate overflow-hidden bg-white border border-[#E0E0E0] rounded-[24px] transition-shadow hover:shadow-lg",
        className
      )}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute -z-10 h-[300px] w-[300px] rounded-full opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-30 mix-blend-multiply"
        style={{
          transform: "translate(var(--x), var(--y))",
          left: 0,
          top: 0,
          backgroundColor: glowColor,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
