"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

function FAQCard({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left flex flex-col gap-3 p-6 bg-white border border-[#E0E0E0] rounded-[16px] transition-all duration-300 hover:border-[#2251B5]/40 hover:shadow-sm focus:outline-none"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-[18px] leading-[1.55] text-[#101828] font-['Inter',sans-serif] text-left">
          {question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-[#2251B5] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-[16px] leading-relaxed text-[#4A5565] font-['Inter',sans-serif] pt-1">
          {answer}
        </p>
      </div>
    </button>
  );
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute w-[343px] h-[307px] bg-[#2251B5]/20 blur-[300px] -left-[79px] bottom-0 pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <h2 className="font-bold text-[38px] leading-[1.05] text-[#2251B5] font-['Plus_Jakarta_Sans',sans-serif]">
            Frequently Asked Questions
          </h2>
          <p className="text-[20px] leading-[1.4] text-[#4A5565] font-['Inter',sans-serif]">
            Quick answers to common questions
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="flex flex-col gap-4 max-w-[860px] mx-auto">
          {faqs.map((faq) => (
            <FAQCard key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
